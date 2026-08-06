import type { ReactNode } from 'react'

/** Judul halaman standar design system — Dashboard Title 36→48px Bold. */
export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-[32px] font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-[40px] lg:text-[48px]">
          {title}
        </h1>
        {subtitle && <p className="mt-2 max-w-2xl text-[15px] text-slate-500">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

/** Label kecil di atas sekelompok kartu (mis. "Total Instansi Terpantau"). */
export function SectionLabel({ children, hint }: { children: ReactNode; hint?: ReactNode }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-2">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{children}</p>
      {hint && <span className="text-[11px] text-slate-400">{hint}</span>}
    </div>
  )
}
