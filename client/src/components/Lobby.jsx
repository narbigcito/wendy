import { useState } from 'react'
import { CATEGORY_META } from '../constants'

export default function Lobby({ shareUrl, playerCount, selectedCategories, onToggleCategory, onStart }) {
  const [copied, setCopied] = useState(false)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback for older browsers
      const el = document.createElement('textarea')
      el.value = shareUrl
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const totalQuestions = selectedCategories.size * 10

  return (
    <div className="lobby">
      <header className="lobby-header">
        <div className="logo">💕</div>
        <h1 className="title">¿Nos conocemos?</h1>
        <p className="subtitle">Un juego de preguntas para dos</p>
      </header>

      <div className="room-card">
        <p className="room-label">Link para compartir</p>
        <div className="room-link-row">
          <span className="room-url">{shareUrl}</span>
          <button className="copy-btn" onClick={copyLink}>
            {copied ? '✓' : 'Copiar'}
          </button>
        </div>
        <div className="player-indicators">
          <div className={`player-dot ${playerCount >= 1 ? 'active' : ''}`} />
          <div className={`player-dot ${playerCount >= 2 ? 'active' : ''}`} />
          <span className="player-label">
            {playerCount === 2 ? '¡Listo para empezar!' : `${playerCount}/2 jugadores conectados`}
          </span>
        </div>
      </div>

      <section className="categories-section">
        <h2 className="section-title">Elige las categorías</h2>
        <div className="categories-grid">
          {Object.entries(CATEGORY_META).map(([key, { label, color, icon }]) => (
            <button
              key={key}
              className={`category-card ${selectedCategories.has(key) ? 'selected' : ''}`}
              style={{ '--cat-color': color }}
              onClick={() => onToggleCategory(key)}
            >
              <span className="cat-icon">{icon}</span>
              <span className="cat-label">{label}</span>
              {selectedCategories.has(key) && (
                <span className="cat-check">✓</span>
              )}
            </button>
          ))}
        </div>
        <p className="questions-count">{totalQuestions} preguntas seleccionadas</p>
      </section>

      <button
        className="start-btn"
        onClick={onStart}
        disabled={playerCount < 2}
      >
        {playerCount < 2 ? 'Esperando al segundo jugador...' : '¡Empezar juego!'}
      </button>

      {playerCount < 2 && (
        <p className="waiting-hint">
          Comparte el link de arriba con la otra persona
        </p>
      )}
    </div>
  )
}
