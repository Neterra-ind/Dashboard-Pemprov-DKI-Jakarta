import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { DataTable } from '@/components/DataTable'
import { FilterSelect } from '@/components/FilterSelect'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { KlasifikasiBadge } from '@/components/ui/Badge'
import { daftarIsu, daftarOpd, daftarRankingOpd } from '@/data/mockData'
import type { Isu, RankingOpd } from '@/types'

const rankingColumns: ColumnDef<RankingOpd, any>[] = [
  { accessorKey: 'opd', header: 'OPD' },
  {
    accessorKey: 'jumlahBerita',
    header: 'Total Berita',
    cell: (info) => <span className="tabular-nums">{info.getValue<number>()}</span>,
  },
  {
    accessorKey: 'jumlahPositif',
    header: 'Isu Positif',
    cell: (info) => <span className="tabular-nums text-emerald-600 dark:text-emerald-400">{info.getValue<number>()}</span>,
  },
  {
    accessorKey: 'jumlahNegatif',
    header: 'Isu Negatif/Potensi Negatif',
    cell: (info) => <span className="tabular-nums text-rose-600 dark:text-rose-400">{info.getValue<number>()}</span>,
  },
  {
    accessorKey: 'severityScore',
    header: 'Severity Score',
    cell: (info) => <span className="tabular-nums font-medium">{info.getValue<number>()}</span>,
  },
]

const isuColumns: ColumnDef<Isu, any>[] = [
  {
    accessorKey: 'namaIsu',
    header: 'Nama Isu',
    cell: (info) => (
      <div className="max-w-sm">
        <p className="font-medium text-slate-800 dark:text-slate-100">{info.getValue<string>()}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{info.row.original.scope}</p>
      </div>
    ),
  },
  { accessorKey: 'kategori', header: 'Kategori' },
  {
    accessorKey: 'klasifikasi',
    header: 'Klasifikasi',
    cell: (info) => <KlasifikasiBadge value={info.getValue()} />,
  },
  {
    accessorKey: 'jumlahBerita',
    header: 'Jml Berita',
    cell: (info) => <span className="tabular-nums">{info.getValue<number>()}</span>,
  },
]

export function PemberitaanOpd() {
  const [opd, setOpd] = useState('')

  const topPopuler = useMemo(
    () =>
      [...daftarRankingOpd]
        .sort((a, b) => b.jumlahBerita - a.jumlahBerita)
        .slice(0, 8)
        .map((r) => ({ name: r.opd.replace('Dinas ', ''), value: r.jumlahBerita })),
    [],
  )

  const topNegatif = useMemo(
    () =>
      [...daftarRankingOpd]
        .sort((a, b) => b.jumlahNegatif - a.jumlahNegatif)
        .slice(0, 8)
        .map((r) => ({ name: r.opd.replace('Dinas ', ''), value: r.jumlahNegatif })),
    [],
  )

  const isuTerfilter = useMemo(() => (opd ? daftarIsu.filter((isu) => isu.opd === opd) : daftarIsu), [opd])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Pemberitaan OPD</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Monitoring isu dan kinerja publikasi dari setiap Organisasi Perangkat Daerah (Dinas,
          Kecamatan) — ranking OPD terpopuler dan OPD paling banyak diberitakan negatif.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="OPD TERPOPULER" subtitle="Berdasarkan total berita/postingan" />
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topPopuler} layout="vertical" margin={{ left: 16 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" fontSize={12} allowDecimals={false} />
                <YAxis type="category" dataKey="name" fontSize={11} width={150} />
                <Tooltip />
                <Bar dataKey="value" fill="#b5121b" radius={[0, 4, 4, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="OPD PALING BANYAK DIBERITAKAN NEGATIF" subtitle="Isu Negatif + Potensi Negatif" />
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topNegatif} layout="vertical" margin={{ left: 16 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" fontSize={12} allowDecimals={false} />
                <YAxis type="category" dataKey="name" fontSize={11} width={150} />
                <Tooltip />
                <Bar dataKey="value" fill="#dc2626" radius={[0, 4, 4, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <DataTable data={daftarRankingOpd} columns={rankingColumns} searchPlaceholder="Cari OPD..." />
      </Card>

      <Card className="p-4">
        <div className="mb-3">
          <FilterSelect label="Drill-down per OPD" value={opd} options={daftarOpd} onChange={setOpd} />
        </div>
        <DataTable data={isuTerfilter} columns={isuColumns} searchPlaceholder="Cari nama isu..." />
      </Card>
    </div>
  )
}
