export default function EndScreen({ total, onReset }) {
  return (
    <div className="end-screen">
      <div className="end-content">
        <div className="end-emoji">🎉</div>
        <h1>¡Juego terminado!</h1>
        <p>Respondieron <strong>{total}</strong> preguntas juntos.</p>
        <p className="end-tagline">Ahora ya se conocen un poco mejor 💕</p>
        <button className="start-btn" onClick={onReset}>
          Jugar de nuevo
        </button>
      </div>
    </div>
  )
}
