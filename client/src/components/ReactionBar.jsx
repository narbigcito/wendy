const EMOJIS = ['❤️', '😂', '😮', '🔥', '🤔']

export default function ReactionBar({ onReaction }) {
  return (
    <div className="reaction-bar">
      {EMOJIS.map(emoji => (
        <button
          key={emoji}
          className="reaction-btn"
          onClick={() => onReaction(emoji)}
          aria-label={emoji}
        >
          {emoji}
        </button>
      ))}
    </div>
  )
}
