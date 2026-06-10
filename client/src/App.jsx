import { useState, useEffect, useRef, useCallback } from 'react'
import Lobby from './components/Lobby'
import Game from './components/Game'
import EndScreen from './components/EndScreen'

function genRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

const initialState = {
  started: false,
  gameOver: false,
  questions: [],
  idx: 0,
  timerSecs: 45,
  playerCount: 0,
  slot: null,
  myAnswer: null,
  partnerAnswer: null,
  revealed: false,
  answeredCount: 0,
  matches: 0,
  match: false,
}

function FloatingReactions({ reactions }) {
  return (
    <>
      {reactions.map(({ id, emoji, x }) => (
        <div key={id} className="floating-reaction" style={{ left: `${x}%` }}>
          {emoji}
        </div>
      ))}
    </>
  )
}

export default function App() {
  const [roomId, setRoomId] = useState(null)
  const [state, setState] = useState(initialState)
  const [reactions, setReactions] = useState([])
  const [catalog, setCatalog] = useState(null)
  const [categories, setCategories] = useState(new Set())
  const [connected, setConnected] = useState(false)
  const wsRef = useRef(null)
  const reactionCounter = useRef(0)
  const reconnectTimer = useRef(null)
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    return () => { isMounted.current = false }
  }, [])

  // Fetch catalog once on mount
  useEffect(() => {
    fetch('/api/questions')
      .then(r => r.json())
      .then(data => {
        if (!isMounted.current) return
        setCatalog(data)
        setCategories(new Set(Object.keys(data.categorias)))
      })
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    let id = params.get('room')
    if (!id) {
      id = genRoomId()
      window.history.pushState({}, '', `?room=${id}`)
    }
    setRoomId(id)
  }, [])

  useEffect(() => {
    if (!roomId) return

    function connect() {
      if (!isMounted.current) return

      const proto = window.location.protocol === 'https:' ? 'wss' : 'ws'
      const port = window.location.port ? `:${window.location.port}` : ''
      const wsUrl = `${proto}://${window.location.hostname}${port}`
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        if (!isMounted.current) return
        setConnected(true)
        ws.send(JSON.stringify({ type: 'join_room', roomId }))
      }

      ws.onmessage = ({ data }) => {
        if (!isMounted.current) return
        let msg
        try { msg = JSON.parse(data) } catch { return }

        if (msg.type === 'state') {
          setState(prev => ({
            ...prev,
            started: msg.started,
            gameOver: msg.gameOver ?? false,
            questions: msg.questions ?? prev.questions,
            idx: msg.idx,
            timerSecs: msg.timerSecs ?? prev.timerSecs,
            playerCount: msg.playerCount,
            slot: msg.slot ?? prev.slot,
            answeredCount: msg.answeredCount ?? 0,
            revealed: msg.revealed ?? false,
            matches: msg.matches ?? prev.matches,
            myAnswer: msg.myAnswer ?? null,
            partnerAnswer: msg.partnerAnswer ?? null,
            match: msg.match ?? false,
          }))
        } else if (msg.type === 'player_count') {
          setState(prev => ({ ...prev, playerCount: msg.count }))
        } else if (msg.type === 'tick') {
          setState(prev => ({ ...prev, timerSecs: msg.secs }))
        } else if (msg.type === 'answered_update') {
          setState(prev => ({ ...prev, answeredCount: msg.count }))
        } else if (msg.type === 'reveal') {
          setState(prev => ({
            ...prev,
            revealed: true,
            myAnswer: msg.myAnswer,
            partnerAnswer: msg.partnerAnswer,
            match: msg.match,
            matches: msg.matches,
          }))
        } else if (msg.type === 'game_over') {
          setState(prev => ({
            ...prev,
            started: false,
            gameOver: true,
            matches: msg.matches,
            questions: prev.questions.length ? prev.questions : [{ length: msg.total }],
          }))
        } else if (msg.type === 'reaction') {
          const id = reactionCounter.current++
          const x = 10 + Math.random() * 80
          setReactions(prev => [...prev, { id, emoji: msg.emoji, x }])
          setTimeout(() => {
            if (isMounted.current) setReactions(prev => prev.filter(r => r.id !== id))
          }, 2500)
        } else if (msg.type === 'error') {
          alert(msg.message)
        }
      }

      ws.onclose = () => {
        if (!isMounted.current) return
        setConnected(false)
        reconnectTimer.current = setTimeout(connect, 3000)
      }

      ws.onerror = () => {}
    }

    connect()

    return () => {
      clearTimeout(reconnectTimer.current)
      wsRef.current?.close()
    }
  }, [roomId])

  const send = useCallback((msg) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg))
    }
  }, [])

  const handleAnswer = useCallback((answerIdx) => {
    setState(prev => ({ ...prev, myAnswer: answerIdx }))
    send({ type: 'answer', answer: answerIdx })
  }, [send])

  const shareUrl = roomId
    ? `${window.location.origin}${window.location.pathname}?room=${roomId}`
    : ''

  const handleToggleCategory = useCallback((cat) => {
    setCategories(prev => {
      const next = new Set(prev)
      if (next.has(cat) && next.size > 1) next.delete(cat)
      else next.add(cat)
      return next
    })
  }, [])

  if (state.gameOver) {
    return (
      <div className="app">
        <FloatingReactions reactions={reactions} />
        <EndScreen
          total={state.questions.length}
          matches={state.matches}
          onReset={() => send({ type: 'reset' })}
        />
      </div>
    )
  }

  if (state.started) {
    return (
      <div className="app">
        <FloatingReactions reactions={reactions} />
        <Game
          catalog={catalog}
          question={state.questions[state.idx]}
          idx={state.idx}
          total={state.questions.length}
          timerSecs={state.timerSecs}
          playerCount={state.playerCount}
          myAnswer={state.myAnswer}
          partnerAnswer={state.partnerAnswer}
          answeredCount={state.answeredCount}
          revealed={state.revealed}
          match={state.match}
          matches={state.matches}
          onAnswer={handleAnswer}
          onNext={() => send({ type: 'next' })}
          onReaction={(emoji) => send({ type: 'reaction', emoji })}
        />
      </div>
    )
  }

  return (
    <div className="app">
      {!connected && <div className="connecting-banner">Reconectando...</div>}
      <FloatingReactions reactions={reactions} />
      <Lobby
        catalog={catalog}
        shareUrl={shareUrl}
        playerCount={state.playerCount}
        selectedCategories={categories}
        onToggleCategory={handleToggleCategory}
        onStart={() => send({ type: 'start', categories: [...categories] })}
      />
    </div>
  )
}
