import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { ExternalLink, RefreshCw, Rss } from 'lucide-react'
import { DataTable } from '@/components/DataTable'
import { FilterSelect } from '@/components/FilterSelect'
import { DateRangeFilter } from '@/components/DateRangeFilter'
import { PlatformBadge } from '@/components/PlatformBadge'
import { SentimenBadge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { useRole } from '@/lib/role'
import { daftarBerita, daftarJenisSumber, daftarKategoriIsu } from '@/data/mockData'
import type { Berita } from '@/types'

const SUMBER_AKTIF = [{ nama: 'Media Online (RSS/API)', tipe: 'Otomatis', interval: '15 menit', icon: Rss }]

export function DataSumber() {
  const { role } = useRole()
  const [jenisSumber, setJenisSumber] = useState('')
  const [kategori, setKategori] = useState('')
  const [dariTanggal, setDariTanggal] = useState('')
  const [sampaiTanggal, setSampaiTanggal] = useState('')

  const filtered = useMemo(() => {
    return daftarBerita.filter(
      (b) =>
        (!jenisSumber || b.jenisSumber === jenisSumber) &&
        (!kategori || b.kategori === kategori) &&
        (!dariTanggal || b.tanggal >= dariTanggal) &&
        (!sampaiTanggal || b.tanggal <= sampaiTanggal),
    )
  }, [jenisSumber, kategori, dariTanggal, sampaiTanggal])

  const columns = useMemo<ColumnDef<Berita, any>[]>(
    () => [
      {
        accessorKey: 'tanggal',
        header: 'Tanggal',
        cell: (info) => <span className="whitespace-nowrap text-slate-500">{info.getValue<string>()}</span>,
      },
      {
        accessorKey: 'judul',
        header: 'Judul',
        cell: (info) => (
          <a
            href={info.row.original.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex max-w-md items-start gap-1.5"
          >
            <div className="min-w-0">
              <p className="font-medium text-slate-800 group-hover:underline dark:text-slate-100">
                {info.getValue<string>()}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{info.row.original.sumber}</p>
            </div>
            <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
          </a>
        ),
      },
      {
        accessorKey: 'jenisSumber',
        header: 'Jenis Sumber',
        cell: (info) => (
          <div className="flex items-center gap-2">
            <PlatformBadge platform={info.getValue()} size="sm" />
            <span className="text-xs">{info.getValue<string>()}</span>
          </div>
        ),
      },
      { accessorKey: 'kategori', header: 'Kategori' },
      {
        accessorKey: 'sentimen',
        header: 'Sentimen',
        cell: (info) => <SentimenBadge value={info.getValue()} />,
      },
    ],
    [],
  )

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Data Sumber</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Berita dan postingan mentah hasil klasifikasi AI (sentimen, kategori) — bukti pendukung di
          balik setiap isu.
        </p>
      </div>

      {role === 'Super Admin' && (
        <Card>
          <CardHeader
            title="Manajemen Sumber Data"
            subtitle="Status koneksi sumber data yang aktif dipantau sistem"
          />
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SUMBER_AKTIF.map((s) => (
              <div key={s.nama} className="rounded-lg border border-slate-100 p-3 dark:border-slate-800">
                <div className="mb-2 flex items-center gap-2">
                  <s.icon className="h-4 w-4 text-brand-red dark:text-brand-gold" />
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{s.nama}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{s.tipe}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                  <RefreshCw className="h-3 w-3" /> Refresh setiap {s.interval}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="p-4">
        <div className="flex flex-wrap items-end gap-3">
          <FilterSelect label="Jenis Sumber" value={jenisSumber} options={daftarJenisSumber} onChange={setJenisSumber} />
          <FilterSelect label="Kategori" value={kategori} options={daftarKategoriIsu} onChange={setKategori} />
          <DateRangeFilter
            dari={dariTanggal}
            sampai={sampaiTanggal}
            onDariChange={setDariTanggal}
            onSampaiChange={setSampaiTanggal}
          />
          {(dariTanggal || sampaiTanggal) && (
            <button
              type="button"
              onClick={() => {
                setDariTanggal('')
                setSampaiTanggal('')
              }}
              className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Reset Tanggal
            </button>
          )}
        </div>
      </Card>

      <Card className="p-4">
        <DataTable data={filtered} columns={columns} searchPlaceholder="Cari judul, media..." />
      </Card>
    </div>
  )
}
