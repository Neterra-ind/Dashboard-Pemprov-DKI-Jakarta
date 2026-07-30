import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Newspaper, Share2, ThumbsDown, ThumbsUp, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { KlasifikasiBadge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { daftarBerita, daftarIsuGubernur, daftarIsuWakilGubernur, reputasiByEntitas } from '@/data/mockData'
import type { EntitasPimpinan } from '@/types'
import fotoGubernur from '@/assets/gubernur-pramono-anung.jpg'
import fotoWakilGubernur from '@/assets/wakil-gubernur-rano-karno.jpg'

const SENTIMEN_COLOR = { Positif: '#10b981', Negatif: '#f43f5e' }

const TABS: { key: EntitasPimpinan; label: string }[] = [
  { key: 'Gubernur', label: 'Isu Gubernur DKI Jakarta' },
  { key: 'Wakil Gubernur', label: 'Isu Wakil Gubernur DKI Jakarta' },
]

const FOTO_PIMPINAN: Record<EntitasPimpinan, string> = {
  Gubernur: fotoGubernur,
  'Wakil Gubernur': fotoWakilGubernur,
}

export function IsuPimpinan() {
  const [tab, setTab] = useState<EntitasPimpinan>('Gubernur')

  const reputasi = reputasiByEntitas(tab)
  const isuTerkait = useMemo(
    () => (tab === 'Gubernur' ? daftarIsuGubernur : daftarIsuWakilGubernur).slice(0, 8),
    [tab],
  )

  if (!reputasi) return null

  const sentimenPie = [
    { name: 'Positif', value: reputasi.positiveRatio },
    { name: 'Negatif', value: reputasi.negativeRatio },
  ]

  const beritaTerkait = useMemo(() => daftarBerita.filter((b) => b.entitasTerkait === tab), [tab])

  const eksposMedia = useMemo(() => {
    const map = new Map<string, number>()
    for (const b of beritaTerkait) {
      map.set(b.sumber, (map.get(b.sumber) ?? 0) + 1)
    }
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)
  }, [beritaTerkait])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Isu Gubernur &amp; Wakil Gubernur
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Pemantauan persepsi publik, citra media, dan narasi yang melekat khusus pada entitas Gubernur
          dan Wakil Gubernur DKI Jakarta — Media Share of Voice (SoV) &amp; sentimen netizen/media.
        </p>
      </div>

      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              '-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors',
              tab === key
                ? 'border-brand-red text-brand-red dark:border-brand-gold dark:text-brand-gold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <img
                src={FOTO_PIMPINAN[tab]}
                alt={reputasi.nama}
                className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-brand-red/10 dark:ring-brand-gold/20"
              />
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{reputasi.nama}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{tab} DKI Jakarta</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Total Berita {beritaTerkait.length}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-1.5 dark:bg-slate-800/60">
              <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <Share2 className="h-3 w-3" /> Share of Voice
              </span>
              <span className="text-sm font-semibold text-brand-red dark:text-brand-gold">
                {reputasi.shareOfVoiceRatio}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="flex items-center justify-center gap-1 rounded-lg bg-slate-50 p-1.5 dark:bg-slate-800/60">
                <ThumbsUp className="h-3 w-3 text-emerald-500" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                  {reputasi.positiveRatio}%
                </span>
              </div>
              <div className="flex items-center justify-center gap-1 rounded-lg bg-slate-50 p-1.5 dark:bg-slate-800/60">
                <ThumbsDown className="h-3 w-3 text-rose-500" />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                  {reputasi.negativeRatio}%
                </span>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={64}>
              <LineChart data={reputasi.trendData}>
                <YAxis hide domain={[0, 100]} />
                <Tooltip labelFormatter={(_, payload) => payload?.[0]?.payload?.tanggal} />
                <Line type="monotone" dataKey="nilai" stroke="#f2b705" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>

            <div className="flex flex-wrap gap-1.5">
              {reputasi.topIsu.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  {t}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="SENTIMEN NETIZEN/MEDIA" />
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={sentimenPie} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                  {sentimenPie.map((entry) => (
                    <Cell key={entry.name} fill={SENTIMEN_COLOR[entry.name as 'Positif' | 'Negatif']} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="EKSPOS MEDIA" subtitle="Jumlah pemberitaan per nama media" />
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={eksposMedia} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" fontSize={12} allowDecimals={false} />
                <YAxis type="category" dataKey="name" fontSize={11} width={90} />
                <Tooltip />
                <Bar dataKey="value" fill="#b5121b" radius={[0, 4, 4, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader
          title={`Isu Terkait ${tab}`}
          subtitle="Isu yang melekat pada entitas ini, diurutkan berdasarkan jumlah berita"
        />
        <CardContent className="space-y-3">
          {isuTerkait.map((isu) => (
            <Link
              key={isu.id}
              to={`/isu/${isu.id}`}
              className="flex items-start justify-between gap-3 rounded-lg border border-slate-100 p-3 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
            >
              <div className="flex gap-2">
                <Newspaper className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{isu.namaIsu}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isu.kategori} · {isu.jumlahBerita} berita
                  </p>
                </div>
              </div>
              <KlasifikasiBadge value={isu.klasifikasi} />
            </Link>
          ))}
        </CardContent>
      </Card>

      <p className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
        <TrendingUp className="h-3 w-3" /> Engagement rate rata-rata: {reputasi.engagementRate}%
      </p>
    </div>
  )
}
