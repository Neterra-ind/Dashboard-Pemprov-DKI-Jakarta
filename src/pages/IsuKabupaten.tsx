import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { DataTable } from '@/components/DataTable'
import { FilterSelect } from '@/components/FilterSelect'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { KlasifikasiBadge, TrendBadge } from '@/components/ui/Badge'
import { hitungPerHariRange } from '@/lib/aggregations'
import { daftarBerita, daftarIsuKabupaten, daftarKategoriIsu, semuaKlasifikasi } from '@/data/mockData'
import type { Isu } from '@/types'

const SENTIMEN_COLOR: Record<string, string> = {
  Positif: '#10b981',
  Netral: '#94a3b8',
  Negatif: '#f43f5e',
}

const columns: ColumnDef<Isu, any>[] = [
  {
    accessorKey: 'namaIsu',
    header: 'Nama Isu',
    cell: (info) => (
      <div className="max-w-sm">
        <p className="font-medium text-slate-800 dark:text-slate-100">{info.getValue<string>()}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{info.row.original.opd}</p>
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
    accessorKey: 'trend',
    header: 'Trend',
    cell: (info) => <TrendBadge value={info.getValue()} />,
  },
  {
    accessorKey: 'jumlahBerita',
    header: 'Jml Berita',
    cell: (info) => <span className="tabular-nums">{info.getValue<number>()}</span>,
  },
]

export function IsuKabupaten() {
  const [kategori, setKategori] = useState('')
  const [klasifikasi, setKlasifikasi] = useState('')

  const terfilter = useMemo(
    () =>
      daftarIsuKabupaten.filter(
        (isu) => (!kategori || isu.kategori === kategori) && (!klasifikasi || isu.klasifikasi === klasifikasi),
      ),
    [kategori, klasifikasi],
  )

  // Kategori dari isu Kabupaten yang lolos filter (kategori/klasifikasi), dipakai
  // untuk menarik berita riil yang sepadan agar grafik tren & sentimen konsisten dengan
  // rentang tanggal data asli (bukan tanggal isu yang jarang/tidak merata).
  const kategoriTerfilter = useMemo(() => new Set(terfilter.map((isu) => isu.kategori)), [terfilter])

  const beritaTerfilter = useMemo(
    () => daftarBerita.filter((b) => !b.entitasTerkait && kategoriTerfilter.has(b.kategori)),
    [kategoriTerfilter],
  )

  const rentangTanggalData = useMemo(() => {
    const semuaTanggal = daftarBerita.map((b) => b.tanggal).sort()
    return { min: semuaTanggal[0], max: semuaTanggal[semuaTanggal.length - 1] }
  }, [])

  const volumeSentimen = useMemo(() => {
    const map = new Map<string, number>()
    for (const b of beritaTerfilter) map.set(b.sentimen, (map.get(b.sentimen) ?? 0) + 1)
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }))
  }, [beritaTerfilter])

  const trenMingguan = useMemo(
    () =>
      hitungPerHariRange(
        beritaTerfilter.map((b) => ({ tanggal: b.tanggal })),
        rentangTanggalData.min,
        rentangTanggalData.max,
      ),
    [beritaTerfilter, rentangTanggalData],
  )

  const mediaShare = useMemo(() => {
    const map = new Map<string, number>()
    for (const isu of terfilter) {
      for (const sumber of isu.sumberUtama) {
        map.set(sumber, (map.get(sumber) ?? 0) + 1)
      }
    }
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [terfilter])

  const eksposMedia = useMemo(() => {
    const map = new Map<string, number>()
    for (const b of beritaTerfilter) map.set(b.sumber, (map.get(b.sumber) ?? 0) + 1)
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)
  }, [beritaTerfilter])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Isu Kabupaten Wonosobo
        </h1>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap gap-3">
          <FilterSelect label="Kategori Isu" value={kategori} options={daftarKategoriIsu} onChange={setKategori} />
          <FilterSelect label="Klasifikasi" value={klasifikasi} options={semuaKlasifikasi} onChange={setKlasifikasi} />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="GRAFIK TREND" subtitle="Jumlah berita per hari (sesuai filter)" />
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={trenMingguan}>
                <defs>
                  <linearGradient id="colorTrenKab" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#b5121b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#b5121b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="tanggal" fontSize={11} tickLine={false} />
                <YAxis fontSize={12} tickLine={false} allowDecimals={false} />
                <Tooltip />
                <Area type="monotone" dataKey="jumlah" stroke="#b5121b" fill="url(#colorTrenKab)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="VOLUME SENTIMENT" />
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={volumeSentimen} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {volumeSentimen.map((entry) => (
                    <Cell key={entry.name} fill={SENTIMEN_COLOR[entry.name]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="MEDIA SHARE" subtitle="Distribusi sumber pemberitaan isu Kabupaten (sesuai filter)" />
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={mediaShare} layout="vertical" margin={{ left: 16 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" fontSize={12} allowDecimals={false} />
                <YAxis type="category" dataKey="name" fontSize={11} width={140} />
                <Tooltip />
                <Bar dataKey="value" fill="#f2b705" radius={[0, 4, 4, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="EKSPOS MEDIA" subtitle="Jumlah pemberitaan per nama media (sesuai filter)" />
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={eksposMedia} layout="vertical" margin={{ left: 16 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" fontSize={12} allowDecimals={false} />
                <YAxis type="category" dataKey="name" fontSize={11} width={140} />
                <Tooltip />
                <Bar dataKey="value" fill="#b5121b" radius={[0, 4, 4, 0]} maxBarSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <DataTable data={terfilter} columns={columns} searchPlaceholder="Cari nama isu, OPD..." />
      </Card>
    </div>
  )
}
