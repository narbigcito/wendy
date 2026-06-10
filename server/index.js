const express = require('express');
const { WebSocketServer, WebSocket } = require('ws');
const http = require('http');
const path = require('path');
const { QUESTIONS } = require('./questions');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const CLIENT_DIST = path.join(__dirname, '../client/dist');
app.use(express.static(CLIENT_DIST));
app.get('*', (req, res) => res.sendFile(path.join(CLIENT_DIST, 'index.html')));

const rooms = new Map();

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// sockets[0] y sockets[1] guardan la ws activa por slot.
// null = ese slot está libre (o jugador desconectado).
// Así si alguien recarga siempre recupera el mismo slot.
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

        // Asignar slot libre (el primero en null)
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
        const cats = msg.categories?.length ? msg.categories : Object.keys(QUESTIONS);
        const all = [];
        cats.forEach(cat => {
          if (QUESTIONS[cat]) QUESTIONS[cat].forEach(q => all.push({ ...q, cat }));
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
        break;
      }

      case 'answer': {
        if (!room || !room.started || room.revealed) return;
        if (slot < 0 || slot > 1) return;
        if (room.answers[slot] !== null) return; // ya respondió
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
    // Borrar sala solo si ambos slots están vacíos
    if (room.sockets.every(s => s === null)) {
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
