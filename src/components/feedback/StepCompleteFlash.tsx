interface Props {
  active: boolean
  children: React.ReactNode
}

export function StepCompleteFlash({ active, children }: Props) {
  return (
    <div className={active ? 'animate-step-pop rounded-lg' : ''}>
      {children}
    </div>
  )
}
