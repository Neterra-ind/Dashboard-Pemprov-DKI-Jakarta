import { cn } from '@/lib/utils'

function warnaUntuk(score: number) {
  if (score >= 75) return 'bg-red-500'
  if (score >= 50) return 'bg-orange-500'
  if (score >= 25) return 'bg-amber-400'
  return 'bg-emerald-500'
}

export function SeverityGauge({ score, label = 'Virality Score' }: { score: number; label?: string }) {
  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{label}</span>
        <span className="font-semibold text-slate-700 dark:text-slate-200">{score}/100</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={cn('h-full rounded-full transition-all', warnaUntuk(score))}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
    </div>
  )
}
