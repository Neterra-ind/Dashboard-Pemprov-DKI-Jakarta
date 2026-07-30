import { cn } from '@/lib/utils'
import type { Klasifikasi, LevelRisiko, Sentimen, StatusPenanganan, Trend } from '@/types'

const sentimenStyle: Record<Sentimen, string> = {
  Positif:
    'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400',
  Netral:
    'bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-500/10 dark:text-slate-300',
  Negatif:
    'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-400',
}

const levelStyle: Record<LevelRisiko, string> = {
  Low: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400',
  Medium:
    'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400',
  High: 'bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-500/10 dark:text-orange-400',
  Critical:
    'bg-red-100 text-red-800 ring-red-600/30 dark:bg-red-500/15 dark:text-red-400',
}

const trendStyle: Record<Trend, string> = {
  Naik:
    'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-400',
  Turun:
    'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400',
  Stabil:
    'bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-500/10 dark:text-slate-300',
}

const klasifikasiStyle: Record<Klasifikasi, string> = {
  Positif:
    'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400',
  Negatif: 'bg-red-100 text-red-800 ring-red-600/30 dark:bg-red-500/15 dark:text-red-400',
  'Potensi Negatif':
    'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400',
}

const statusStyle: Record<StatusPenanganan, string> = {
  'Belum Ditindaklanjuti':
    'bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-500/10 dark:text-slate-300',
  Didisposisikan:
    'bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-500/10 dark:text-sky-400',
  Diproses:
    'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400',
  Selesai:
    'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400',
}

function BaseBadge({ label, style }: { label: string; style: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        style,
      )}
    >
      {label}
    </span>
  )
}

export function SentimenBadge({ value }: { value: Sentimen }) {
  return <BaseBadge label={value} style={sentimenStyle[value]} />
}

export function LevelBadge({ value }: { value: LevelRisiko }) {
  return <BaseBadge label={value} style={levelStyle[value]} />
}

export function TrendBadge({ value }: { value: Trend }) {
  return <BaseBadge label={value} style={trendStyle[value]} />
}

export function KlasifikasiBadge({ value }: { value: Klasifikasi }) {
  return <BaseBadge label={value} style={klasifikasiStyle[value]} />
}

export function StatusBadge({ value }: { value: StatusPenanganan }) {
  return <BaseBadge label={value} style={statusStyle[value]} />
}
