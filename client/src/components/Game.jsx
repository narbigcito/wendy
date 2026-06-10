import { useState, useEffect, useMemo } from 'react'
import ReactionBar from './ReactionBar'
import Timer from './Timer'

function Confetti() {
  const pieces = useMemo(() =>
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,
      delay: Math.random() * 0.6,
      size: 7 + Math.random() * 7,
      color: ['#7F77DD', '#BA7517', '#993556', '#D85A30', '#1D9E75', '#533AB7', '#639922'][i % 7],
      rotate: Math.random() * 360,
    })), [])

  return (
    <div className="confetti-container" aria-hidden="true">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.x}%`,
            animationDelay: `${p.delay}s`,
            width: p.size,
            height: p.size,
            background: p.color,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  )
}

export default function Game({
  catalog, question, idx, total,
  timerSecs, playerCount, myAnswer, partnerAnswer,
  answeredCount, revealed, match, matches,
  onAnswer, onNext, onReaction,
}) {
  const [flipped, setFlipped] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    setFlipped(false)
    setShowConfetti(false)
  }, [idx])

  useEffect(() => {
    if (!revealed) return
    const t = setTimeout(() => setFlipped(true), 150)
    return () => clearTimeout(t)
  }, [revealed])

  useEffect(() => {
    if (flipped && revealed && match) {
      setShowConfetti(true)
      const t = setTimeout(() => setShowConfetti(false), 3200)
      return () => clearTimeout(t)
    }
  }, [flipped, revealed, match])

  if (!question) return null

  const catMeta = catalog?.categorias?.[question.cat] ?? {}
  const catColor = catMeta.color ?? '#8B5CF6'
  const catBg = catMeta.bg ?? 'rgba(139,92,246,0.15)'
  const progress = ((idx + 1) / total) * 100
  const iAnswered = myAnswer !== null
  const partnerAnswered = answeredCount > (iAnswered ? 1 : 0)

  return (
    <div className="game" style={{ '--cat-color': catColor, '--cat-bg': catBg }}>
      {showConfetti && <Confetti />}

      <div className="game-header">
        <div className="player-badge">
          <span className="pdot" style={{ background: playerCount >= 1 ? '#10B981' : '#475569' }} />
          <span className="pdot" style={{ background: playerCount >= 2 ? '#10B981' : '#475569' }} />
          <span>{playerCount}/2</span>
        </div>
        <div className="cat-badge" style={{ background: catColor }}>
          {question.cat}
        </div>
        <div className="match-chip">{matches} ✓</div>
      </div>

      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%`, background: catColor }} />
      </div>
      <p className="progress-label">{idx + 1} / {total}</p>

      <div className="question-card" key={idx}>
        <p className="question-text">{question.q}</p>
      </div>

      {!revealed && (
        <>
          <div className="options-grid">
            {question.options.map((opt, i) => (
              <button
                key={i}
                className={[
                  'option-btn',
                  myAnswer === i ? 'selected' : '',
                  iAnswered && myAnswer !== i ? 'dimmed' : '',
                ].join(' ')}
                onClick={() => !iAnswered && onAnswer(i)}
                disabled={iAnswered}
              >
                <span className="option-letter">{['A', 'B', 'C', 'D'][i]}</span>
                <span className="option-text">{opt}</span>
                {myAnswer === i && <span className="option-check">✓</span>}
              </button>
            ))}
          </div>

          <div className="waiting-row">
            {!iAnswered && partnerAnswered && (
              <div className="waiting-banner partner-answered">
                Tu pareja ya respondió — ¡elige tú!
              </div>
            )}
            {iAnswered && answeredCount < 2 && (
              <div className="waiting-banner thinking">
                <span className="thinking-dots">Tu pareja está pensando</span>
              </div>
            )}
          </div>

          <div className="timer-row">
            <Timer secs={timerSecs} />
          </div>
        </>
      )}

      {revealed && (
        <div className="reveal-section">
          <div className="reveal-cards">
            <div className="reveal-card">
              <div className={`card-inner ${flipped ? 'flipped' : ''}`}>
                <div className="card-face card-front">
                  <span className="card-face-icon">?</span>
                </div>
                <div className={`card-face card-back mine ${match ? 'match-yes' : 'match-no'}`}>
                  <span className="card-who">Tú</span>
                  <span className="card-answer">
                    {myAnswer !== null ? question.options[myAnswer] : 'Sin respuesta'}
                  </span>
                </div>
              </div>
            </div>

            <div className="reveal-card">
              <div className={`card-inner ${flipped ? 'flipped stagger' : ''}`}>
                <div className="card-face card-front">
                  <span className="card-face-icon">?</span>
                </div>
                <div className={`card-face card-back partner ${match ? 'match-yes' : 'match-no'}`}>
                  <span className="card-who">Pareja</span>
                  <span className="card-answer">
                    {partnerAnswer !== null ? question.options[partnerAnswer] : 'Sin respuesta'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={`match-result ${match ? 'is-match' : 'no-match'}`}>
            {match ? '✨ ¡Coincidencia!' : '💭 Visión diferente'}
          </div>

          <div className="matches-counter">
            {matches} de {idx + 1} {matches === 1 ? 'coincidencia' : 'coincidencias'}
          </div>

          <button className="next-btn full" onClick={onNext}>
            Siguiente →
          </button>
        </div>
      )}

      <ReactionBar onReaction={onReaction} />
    </div>
  )
}
