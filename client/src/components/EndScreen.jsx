export default function EndScreen({ total, matches, onReset }) {
  const pct = total > 0 ? Math.round((matches / total) * 100) : 0
  const emoji = pct >= 70 ? '🥰' : pct >= 40 ? '💕' : '🤔'
  const tagline =
    pct >= 70 ? '¡Se conocen muy bien!' :
    pct >= 40 ? 'Bastante parecidos, ¿no?' :
    'Son únicos a su manera ✨'

  return (
    <div className="end-screen">
      <div className="end-content">
        <div className="end-emoji">{emoji}</div>
        <h1>¡Juego terminado!</h1>

        <div className="end-matches-display">
          <span className="end-matches-num">{matches}</span>
          <span className="end-matches-of">de {total}</span>
          <span className="end-matches-label">coincidencias</span>
        </div>

        <div className="end-bar-wrap">
          <div className="end-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <p className="end-pct">{pct}% de afinidad</p>

        <p className="end-tagline">{tagline}</p>

        <button className="start-btn" onClick={onReset}>
          Jugar de nuevo
        </button>
      </div>
    </div>
  )
}
