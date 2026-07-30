import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
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
import { AlertTriangle, Building2, Newspaper, UserRound } from 'lucide-react'
import { StatCard } from '@/components/StatCard'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/Badge'
import { FilterSelect } from '@/components/FilterSelect'
import { useRole } from '@/lib/role'
import { useDisposisi } from '@/lib/store'
import {
  daftarBerita,
  daftarEarlyWarning,
  daftarIsu,
  daftarIsuKabupaten,
  daftarOpd,
  daftarRankingOpd,
  substansiMasalahUntuk,
} from '@/data/mockData'
import { hitungPerHariRange, levelKeAngka } from '@/lib/aggregations'
import ilustrasiWonosobo from '@/assets/ilustrasi-wonosobo.jpg'

const SENTIMEN_COLOR: Record<string, string> = {
  Positif: '#10b981',
  Netral: '#94a3b8',
  Negatif: '#f43f5e',
}

const waktuSekarang = new Date().toLocaleString('id-ID', {
  dateStyle: 'full',
  timeStyle: 'short',
})

function AdminOpdSummary() {
  const { opdAktif, setOpdAktif } = useRole()
  const { statusUntukIsu } = useDisposisi()

  const isuOpd = useMemo(
    () => daftarIsu.filter((isu) => isu.opd === opdAktif).slice(0, 12),
    [opdAktif],
  )

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Isu Relevan OPD Saya
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Isu yang berkaitan dengan kedinasan Anda beserta status tindak lanjut. Login sebagai Admin
          OPD hanya melihat data yang relevan dengan dinasnya.
        </p>
      </div>

      <Card className="p-4">
        <FilterSelect
          label="Organisasi Perangkat Daerah (OPD)"
          value={opdAktif}
          options={daftarOpd}
          onChange={(v) => setOpdAktif(v as typeof opdAktif)}
        />
      </Card>

      <Card>
        <CardHeader
          title={`Isu — ${opdAktif}`}
          subtitle={`${isuOpd.length} isu ditemukan untuk OPD ini`}
          action={
            <Link
              to="/tindak-lanjut"
              className="rounded-lg bg-brand-red px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-red/90"
            >
              Buka Tindak Lanjut
            </Link>
          }
        />
        <CardContent className="space-y-3">
          {isuOpd.length === 0 && (
            <p className="text-sm text-slate-400">Belum ada isu tercatat untuk OPD ini.</p>
          )}
          {isuOpd.map((isu) => (
            <Link
              key={isu.id}
              to={`/isu/${isu.id}`}
              className="flex items-start justify-between gap-3 rounded-lg border border-slate-100 p-3 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
            >
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{isu.namaIsu}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isu.kategori} · {isu.jumlahBerita} berita
                </p>
              </div>
              <StatusBadge value={statusUntukIsu(isu.id)} />
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export function Dashboard() {
  const { role } = useRole()
  const { statusUntukIsu } = useDisposisi()

  const totalBeritaPemkab = daftarBerita.length
  const totalBeritaBupati = useMemo(
    () => daftarBerita.filter((b) => b.entitasTerkait === 'Bupati').length,
    [],
  )
  const totalBeritaOpd = useMemo(
    () => daftarBerita.filter((b) => b.kategori === 'Tata Kelola Pemerintahan').length,
    [],
  )
  const totalBeritaNegatif = useMemo(
    () => daftarBerita.filter((b) => b.sentimen === 'Negatif').length,
    [],
  )

  const belumDitindaklanjuti = useMemo(
    () =>
      daftarEarlyWarning.filter(
        (isu) =>
          (isu.levelRisiko === 'Critical' || isu.levelRisiko === 'High') &&
          statusUntukIsu(isu.id) === 'Belum Ditindaklanjuti',
      ),
    [statusUntukIsu],
  )

  const trenBerita = useMemo(() => {
    const semuaTanggal = daftarBerita.map((b) => b.tanggal).sort()
    return hitungPerHariRange(
      daftarBerita.map((b) => ({ tanggal: b.tanggal })),
      semuaTanggal[0],
      semuaTanggal[semuaTanggal.length - 1],
    )
  }, [])

  const distribusiSentimen = useMemo(() => {
    const map = new Map<string, number>()
    for (const b of daftarBerita) {
      map.set(b.sentimen, (map.get(b.sentimen) ?? 0) + 1)
    }
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }))
  }, [])

  const topIsuKabupaten = useMemo(
    () => [...daftarIsuKabupaten].sort((a, b) => b.jumlahBerita - a.jumlahBerita).slice(0, 5),
    [],
  )
  const earlyWarningTeratas = useMemo(
    () =>
      [...daftarEarlyWarning]
        .sort(
          (a, b) => levelKeAngka(b.levelRisiko) - levelKeAngka(a.levelRisiko) || b.viralityScore - a.viralityScore,
        )
        .slice(0, 4),
    [],
  )

  const rankingOpdTeratas = useMemo(
    () =>
      daftarRankingOpd
        .filter((r) => r.jumlahNegatif > 0)
        .slice(0, 8)
        .map((r) => ({ name: r.opd.replace('Dinas ', ''), value: r.jumlahNegatif })),
    [],
  )

  if (role === 'Admin OPD') {
    return <AdminOpdSummary />
  }

  return (
    <div className="space-y-6">
      <img
        src={ilustrasiWonosobo}
        alt="Ilustrasi Kabupaten Wonosobo"
        className="h-40 w-full rounded-xl object-cover sm:h-48"
      />

      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Executive Summary
        </h1>
        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Data per {waktuSekarang} WIB</p>
      </div>

      {belumDitindaklanjuti.length > 0 && (
        <Link
          to="/early-warning"
          className="flex items-center justify-between gap-3 rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700"
        >
          <span className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {belumDitindaklanjuti.length} Isu Potensi Negatif/Negatif berisiko tinggi membutuhkan
            perhatian segera
          </span>
          <span className="shrink-0 rounded-md bg-white/15 px-2 py-1 text-xs">Lihat Semua →</span>
        </Link>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Berita Pemkab Wonosobo" value={totalBeritaPemkab} icon={Newspaper} />
        <StatCard label="Total Berita Bupati Wonosobo" value={totalBeritaBupati} icon={UserRound} />
        <StatCard label="Total Berita OPD" value={totalBeritaOpd} icon={Building2} tone="warning" />
        <StatCard label="Total Berita Negatif" value={totalBeritaNegatif} icon={AlertTriangle} tone="negative" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="EKSPOS ISU WONOSOBO" subtitle="Jumlah berita per hari" />
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={trenBerita} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="tanggal" fontSize={12} tickLine={false} />
                <YAxis fontSize={12} tickLine={false} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="jumlah" fill="#f2b705" radius={[4, 4, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="SENTIMEN DOMINAN ISU" />
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={distribusiSentimen}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                >
                  {distribusiSentimen.map((entry) => (
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

      <Card>
        <CardHeader
          title="Issues Negatif"
          subtitle="Berita negatif atau berpotensi negatif yang perlu direspons OPD"
          action={
            <Link to="/early-warning" className="text-xs font-medium text-brand-red hover:underline dark:text-brand-gold">
              Lihat semua →
            </Link>
          }
        />
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {earlyWarningTeratas.length === 0 && (
            <p className="text-sm text-slate-400">Tidak ada isu berisiko tinggi saat ini.</p>
          )}
          {earlyWarningTeratas.map((isu) => (
            <Link
              key={isu.id}
              to={`/isu/${isu.id}`}
              className="rounded-lg border border-slate-100 p-3 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
            >
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                {substansiMasalahUntuk(isu)}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {isu.jumlahBerita} ekspos berita · Kewenangan: {isu.opd}
              </p>
            </Link>
          ))}
        </CardContent>
      </Card>

      <Card id="isu-kabupaten" className="scroll-mt-4">
        <CardHeader
          title="Top 5 Isu Kabupaten Wonosobo"
          subtitle="Berdasarkan jumlah berita/postingan"
        />
        <CardContent className="space-y-3">
          {topIsuKabupaten.map((isu, idx) => (
            <div
              key={isu.id}
              className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0 dark:border-slate-800"
            >
              <div className="flex gap-3">
                <span className="mt-0.5 text-xs font-semibold text-slate-400">{idx + 1}</span>
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    {isu.namaIsu}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isu.kategori} · {isu.jumlahBerita} berita
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="PUBLIKASI KINERJA OPD" />
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={rankingOpdTeratas} layout="vertical" margin={{ left: 16 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" fontSize={12} allowDecimals={false} />
              <YAxis type="category" dataKey="name" fontSize={11} width={160} />
              <Tooltip />
              <Bar dataKey="value" fill="#f2b705" radius={[0, 4, 4, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
