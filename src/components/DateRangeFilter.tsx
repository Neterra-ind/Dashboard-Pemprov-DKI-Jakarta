import { useEffect, useRef, useState } from 'react'
import { Calendar } from 'lucide-react'

function formatTanggal(iso: string) {
  const d = new Date(`${iso}T00:00:00`)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function DateRangeFilter({
  label = 'Periode',
  dari,
  sampai,
  onDariChange,
  onSampaiChange,
}: {
  label?: string
  dari: string
  sampai: string
  onDariChange: (value: string) => void
  onSampaiChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const teksTampil =
    dari && sampai
      ? `${formatTanggal(dari)}  -  ${formatTanggal(sampai)}`
      : dari
        ? `Sejak ${formatTanggal(dari)}`
        : sampai
          ? `Sampai ${formatTanggal(sampai)}`
          : 'Pilih periode'

  return (
    <div ref={containerRef} className="relative">
      <span className="mb-1 block text-xs text-slate-500 dark:text-slate-400">{label}</span>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
      >
        <Calendar className="h-3.5 w-3.5 shrink-0 text-brand-red dark:text-brand-gold" />
        {teksTampil}
      </button>

      {open && (
        <div className="absolute z-20 mt-2 flex gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <label className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400">
            Dari
            <input
              type="date"
              value={dari}
              onChange={(e) => onDariChange(e.target.value)}
              className="w-36 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400">
            Sampai
            <input
              type="date"
              value={sampai}
              onChange={(e) => onSampaiChange(e.target.value)}
              className="w-36 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </label>
        </div>
      )}
    </div>
  )
}
