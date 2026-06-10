const R = 45
const C = 2 * Math.PI * R

function timerColor(secs) {
  if (secs > 20) return '#8B5CF6'
  if (secs > 8) return '#F59E0B'
  return '#EF4444'
}

export default function Timer({ secs, maxSecs = 45 }) {
  const pct = Math.max(0, Math.min(1, secs / maxSecs))
  const offset = C * (1 - pct)
  const color = timerColor(secs)

  return (
    <div className="timer">
      <svg viewBox="0 0 100 100" width="60" height="60">
        <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={R}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s ease' }}
        />
      </svg>
      <span className="timer-num" style={{ color }}>{secs}</span>
    </div>
  )
}
