import { useNavigate } from 'react-router-dom'

interface Props {
  current: 'list' | 'matrix'
}

export function ViewToggle({ current }: Props) {
  const navigate = useNavigate()

  const base = 'px-3 py-1.5 text-sm font-medium transition-colors'
  const active = `${base} bg-blue-600 text-white`
  const inactive = `${base} bg-white text-gray-600 hover:text-gray-900`

  return (
    <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
      <button
        className={current === 'list' ? active : inactive}
        onClick={() => current !== 'list' && navigate('/')}
        aria-current={current === 'list' ? 'page' : undefined}
      >
        List
      </button>
      <button
        className={`border-l border-gray-200 ${current === 'matrix' ? active : inactive}`}
        onClick={() => current !== 'matrix' && navigate('/matrix')}
        aria-current={current === 'matrix' ? 'page' : undefined}
      >
        Matrix
      </button>
    </div>
  )
}
