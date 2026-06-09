import { useState, useEffect } from 'react'
import Timer from './Timer'
import ReactionBar from './ReactionBar'
import { CATEGORY_META } from '../constants'

export default function Game({ question, idx, total, timerSecs, skips, playerCount, onNext, onSkip, onReaction }) {
  const [processing, setProcessing] = useState(false)

  // Reset processing state when question changes
  useEffect(() => { setProcessing(false) }, [idx])

  if (!question) return null

  const meta = CATEGORY_META[question.category] ?? CATEGORY_META.vida
  const progress = ((idx + 1) / total) * 100

  const handleNext = () => {
    if (processing) return
    setProcessing(true)
    onNext()
  }

  const handleSkip = () => {
    if (processing || skips <= 0) return
    setProcessing(true)
    onSkip()
  }

  return (
    <div className="game" style={{ '--cat-color': meta.color }}>
      <div className="game-header">
        <div className="player-badge">
          <span
            className="pdot"
            style={{ background: playerCount >= 1 ? '#10B981' : '#475569' }}
          />
          <span
            className="pdot"
            style={{ background: playerCount >= 2 ? '#10B981' : '#475569' }}
          />
          <span>{playerCount}/2</span>
        </div>

        <div className="cat-badge" style={{ background: meta.color }}>
          {meta.icon} {meta.label}
        </div>

        <Timer secs={timerSecs} />
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${progress}%`, background: meta.color }}
        />
      </div>
      <p className="progress-label">{idx + 1} / {total}</p>

      <div className="question-card" key={idx}>
        <p className="question-text">{question.text}</p>
      </div>

      <div className="controls">
        <button
          className="skip-btn"
          onClick={handleSkip}
          disabled={skips <= 0 || processing}
          title={skips <= 0 ? 'Sin pases disponibles' : `${skips} pases restantes`}
        >
          Pasar ({skips})
        </button>
        <button
          className="next-btn"
          onClick={handleNext}
          disabled={processing}
        >
          Siguiente →
        </button>
      </div>

      <ReactionBar onReaction={onReaction} />
    </div>
  )
}
