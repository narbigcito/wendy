const express = require('express');
const { WebSocketServer, WebSocket } = require('ws');
const http = require('http');
const { QUESTIONS } = require('./questions');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const rooms = new Map();

function genRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

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
    players: [],
    started: false,
    gameOver: false,
    questions: [],
    idx: 0,
    timerSecs: 60,
    skips: 3,
    timerInterval: null,
  };
}

function broadcast(room, msg) {
  const data = JSON.stringify(msg);
  room.players.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) ws.send(data);
  });
}

function getState(room) {
  return {
    type: 'state',
    started: room.started,
    gameOver: room.gameOver,
    questions: room.questions,
    idx: room.idx,
    timerSecs: room.timerSecs,
    skips: room.skips,
    playerCount: room.players.length,
  };
}

function clearTimer(room) {
  if (room.timerInterval) {
    clearInterval(room.timerInterval);
    room.timerInterval = null;
  }
}

function startTimer(room) {
  clearTimer(room);
  room.timerSecs = 60;
  room.timerInterval = setInterval(() => {
    room.timerSecs--;
    broadcast(room, { type: 'tick', secs: room.timerSecs });
    if (room.timerSecs <= 0) {
      clearTimer(room);
      advanceQuestion(room);
    }
  }, 1000);
}

function advanceQuestion(room, isSkip = false) {
  if (isSkip) room.skips--;
  if (room.idx + 1 >= room.questions.length) {
    clearTimer(room);
    room.started = false;
    room.gameOver = true;
    broadcast(room, { type: 'game_over' });
  } else {
    room.idx++;
    startTimer(room);
    broadcast(room, getState(room));
  }
}

wss.on('connection', (ws) => {
  let roomId = null;
  let room = null;

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw.toString()); } catch { return; }

    switch (msg.type) {
      case 'join_room': {
        roomId = msg.roomId;
        if (!rooms.has(roomId)) rooms.set(roomId, createRoom());
        room = rooms.get(roomId);
        if (room.players.length >= 2) {
          ws.send(JSON.stringify({ type: 'error', message: 'Sala llena' }));
          return;
        }
        room.players.push(ws);
        ws.send(JSON.stringify(getState(room)));
        broadcast(room, { type: 'player_count', count: room.players.length });
        break;
      }

      case 'start': {
        if (!room || room.started) return;
        const cats = msg.categories?.length ? msg.categories : Object.keys(QUESTIONS);
        const all = [];
        cats.forEach(cat => {
          if (QUESTIONS[cat]) {
            QUESTIONS[cat].forEach(q => all.push({ ...q, category: cat }));
          }
        });
        room.questions = shuffle(all);
        room.idx = 0;
        room.skips = 3;
        room.started = true;
        room.gameOver = false;
        broadcast(room, getState(room));
        startTimer(room);
        break;
      }

      case 'next': {
        if (!room || !room.started) return;
        advanceQuestion(room);
        break;
      }

      case 'skip': {
        if (!room || !room.started || room.skips <= 0) return;
        advanceQuestion(room, true);
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
        room.skips = 3;
        room.timerSecs = 60;
        broadcast(room, getState(room));
        break;
      }
    }
  });

  ws.on('close', () => {
    if (!room) return;
    room.players = room.players.filter(p => p !== ws);
    if (room.players.length === 0) {
      clearTimer(room);
      rooms.delete(roomId);
    } else {
      broadcast(room, { type: 'player_count', count: room.players.length });
    }
  });

  ws.on('error', () => {});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🎮 ¿Nos conocemos? server → http://localhost:${PORT}`);
});
