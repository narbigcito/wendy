const express = require('express');
const { WebSocketServer, WebSocket } = require('ws');
const http = require('http');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Catalog loaded once at startup — single source of truth
const CATALOG = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'preguntas-spiky.json'), 'utf8')
);

app.use(express.json());
app.get('/api/questions', (_req, res) => res.json(CATALOG));

const CLIENT_DIST = path.join(__dirname, '../client/dist');
app.use(express.static(CLIENT_DIST));
app.get('*', (req, res) => res.sendFile(path.join(CLIENT_DIST, 'index.html')));

const rooms = new Map();
const TIMER_SECS = 45;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createRoom() {
  return {
    sockets: [null, null],
    started: false,
    gameOver: false,
    questions: [],
    idx: 0,
    answers: [null, null],
    answered: 0,
    revealed: false,
    matches: 0,
    timer: null,
  };
}

function sendTo(ws, msg) {
  if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg));
}

function broadcast(room, msg) {
  const data = JSON.stringify(msg);
  room.sockets.forEach(ws => {
    if (ws && ws.readyState === WebSocket.OPEN) ws.send(data);
  });
}

function playerCount(room) {
  return room.sockets.filter(Boolean).length;
}

function clearTimer(room) {
  if (room.timer) {
    clearInterval(room.timer);
    room.timer = null;
  }
}

function startTimer(room) {
  clearTimer(room);
  let secs = TIMER_SECS;
  broadcast(room, { type: 'tick', secs });
  room.timer = setInterval(() => {
    secs--;
    broadcast(room, { type: 'tick', secs });
    if (secs <= 0) {
      clearTimer(room);
      revealAnswers(room);
    }
  }, 1000);
}

function getState(room, slot) {
  const base = {
    type: 'state',
    started: room.started,
    gameOver: room.gameOver,
    questions: room.questions,
    idx: room.idx,
    playerCount: playerCount(room),
    slot,
    answeredCount: room.answered,
    revealed: room.revealed,
    matches: room.matches,
    myAnswer: room.answers[slot],
  };
  if (room.revealed) {
    base.partnerAnswer = room.answers[1 - slot];
    base.match =
      room.answers[0] !== null &&
      room.answers[1] !== null &&
      room.answers[0] === room.answers[1];
  }
  return base;
}

function revealAnswers(room) {
  if (room.revealed) return;
  clearTimer(room);
  room.revealed = true;
  const match =
    room.answers[0] !== null &&
    room.answers[1] !== null &&
    room.answers[0] === room.answers[1];
  if (match) room.matches++;

  room.sockets.forEach((ws, slot) => {
    sendTo(ws, {
      type: 'reveal',
      myAnswer: room.answers[slot],
      partnerAnswer: room.answers[1 - slot],
      match,
      matches: room.matches,
    });
  });
}

function advanceQuestion(room) {
  room.answers = [null, null];
  room.answered = 0;
  room.revealed = false;

  if (room.idx + 1 >= room.questions.length) {
    room.started = false;
    room.gameOver = true;
    broadcast(room, { type: 'game_over', matches: room.matches, total: room.questions.length });
  } else {
    room.idx++;
    room.sockets.forEach((ws, slot) => sendTo(ws, getState(room, slot)));
    startTimer(room);
  }
}

wss.on('connection', (ws) => {
  let roomId = null;
  let room = null;
  let slot = -1;

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw.toString()); } catch { return; }

    switch (msg.type) {
      case 'join_room': {
        roomId = msg.roomId;
        if (!rooms.has(roomId)) rooms.set(roomId, createRoom());
        room = rooms.get(roomId);

        const freeSlot = room.sockets.indexOf(null);
        if (freeSlot === -1) {
          sendTo(ws, { type: 'error', message: 'Sala llena' });
          return;
        }
        slot = freeSlot;
        room.sockets[slot] = ws;
        sendTo(ws, getState(room, slot));
        broadcast(room, { type: 'player_count', count: playerCount(room) });
        break;
      }

      case 'start': {
        if (!room || room.started) return;
        const cats = msg.categories?.length ? msg.categories : Object.keys(CATALOG.categorias);
        const all = [];
        cats.forEach(cat => {
          if (CATALOG.categorias[cat]) {
            CATALOG.categorias[cat].preguntas.forEach(q => all.push({ ...q, cat }));
          }
        });
        room.questions = shuffle(all);
        room.idx = 0;
        room.answers = [null, null];
        room.answered = 0;
        room.revealed = false;
        room.matches = 0;
        room.started = true;
        room.gameOver = false;
        room.sockets.forEach((ws, s) => sendTo(ws, getState(room, s)));
        startTimer(room);
        break;
      }

      case 'answer': {
        if (!room || !room.started || room.revealed) return;
        if (slot < 0 || slot > 1) return;
        if (room.answers[slot] !== null) return;
        room.answers[slot] = msg.answer;
        room.answered++;
        broadcast(room, { type: 'answered_update', count: room.answered });
        if (room.answered >= 2) revealAnswers(room);
        break;
      }

      case 'next': {
        if (!room || !room.revealed) return;
        advanceQuestion(room);
        break;
      }

      case 'reaction': {
        if (!room) return;
        broadcast(room, { type: 'reaction', emoji: msg.emoji });
        break;
      }

      case 'reset': {
        if (!room) return;
        clearTimer(room);
        room.started = false;
        room.gameOver = false;
        room.idx = 0;
        room.questions = [];
        room.answers = [null, null];
        room.answered = 0;
        room.revealed = false;
        room.matches = 0;
        room.sockets.forEach((ws, s) => sendTo(ws, getState(room, s)));
        break;
      }
    }
  });

  ws.on('close', () => {
    if (!room || slot === -1) return;
    room.sockets[slot] = null;
    if (room.sockets.every(s => s === null)) {
      clearTimer(room);
      rooms.delete(roomId);
    } else {
      broadcast(room, { type: 'player_count', count: playerCount(room) });
    }
  });

  ws.on('error', () => {});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🎮 ¿Nos conocemos? server → http://localhost:${PORT}`);
});
