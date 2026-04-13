import { useNavigate } from 'react-router-dom'

interface Props {
  current: 'list' | 'matrix'
}

export function ViewToggle({ current }: Props) {
  const navigate = useNavigate()

  return (
    <div className="inline-flex rounded-xl border-2 border-ink overflow-hidden shadow-hard-sm">
      <button
        className={`px-4 py-1.5 text-sm font-bold transition-colors ${
          current === 'list' ? 'bg-ink text-cream' : 'bg-cream text-ink hover:bg-ink/10'
        }`}
        onClick={() => current !== 'list' && navigate('/')}
        aria-current={current === 'list' ? 'page' : undefined}
      >
        List
      </button>
      <button
        className={`border-l-2 border-ink px-4 py-1.5 text-sm font-bold transition-colors ${
          current === 'matrix' ? 'bg-ink text-cream' : 'bg-cream text-ink hover:bg-ink/10'
        }`}
        onClick={() => current !== 'matrix' && navigate('/matrix')}
        aria-current={current === 'matrix' ? 'page' : undefined}
      >
        Matrix
      </button>
    </div>
  )
}
