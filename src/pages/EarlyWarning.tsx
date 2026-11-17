import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { DateRangeFilter } from '@/components/DateRangeFilter'
import { FilterSelect } from '@/components/FilterSelect'
import { KlasifikasiBadge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { daftarBerita, daftarEarlyWarning, daftarJenisSumber } from '@/data/mockData'
import type { JenisSumber } from '@/types'

const PAGE_SIZE = 10

export function EarlyWarning() {
  const [jenisSumber, setJenisSumber] = useState('')
  const [dariTanggal, setDariTanggal] = useState('')
  const [sampaiTanggal, setSampaiTanggal] = useState('')
  const [page, setPage] = useState(1)

  // Lookup isuId → URL berita pertama (untuk link sumber artikel)
  const urlByIsuId = useMemo(() => {
    const map = new Map<string, { url: string; sumber: string }>()
    for (const b of daftarBerita) {
      if (!map.has(b.isuId) && b.url && b.url.startsWith('http')) {
        map.set(b.isuId, { url: b.url, sumber: b.sumber })
      }
    }
    return map
  }, [])

  const terfilter = useMemo(
    () =>
      daftarEarlyWarning
        .filter((isu) => {
          if (jenisSumber && !isu.sumberUtama.includes(jenisSumber as JenisSumber)) return false
          if (dariTanggal && isu.tanggalMulai < dariTanggal) return false
          if (sampaiTanggal && isu.tanggalMulai > sampaiTanggal) return false
          return true
        })
        .sort((a, b) => b.tanggalMulai.localeCompare(a.tanggalMulai)),
    [jenisSumber, dariTanggal, sampaiTanggal],
  )

  useEffect(() => { setPage(1) }, [jenisSumber, dariTanggal, sampaiTanggal])

  const totalPage = Math.max(1, Math.ceil(terfilter.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPage)
  const sliced = terfilter.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Isu Negatif"
        subtitle="Isu yang terklasifikasi Negatif atau Potensi Negatif dan perlu direspons OPD."
      />

      <Card className="p-4">
        <div className="flex flex-wrap items-end gap-3">
          <FilterSelect
            label="Jenis Sumber"
            value={jenisSumber}
            options={daftarJenisSumber}
            onChange={setJenisSumber}
          />
          <DateRangeFilter
            dari={dariTanggal}
            sampai={sampaiTanggal}
            onDariChange={setDariTanggal}
            onSampaiChange={setSampaiTanggal}
          />
          {(dariTanggal || sampaiTanggal) && (
            <button
              type="button"
              onClick={() => { setDariTanggal(''); setSampaiTanggal('') }}
              className="self-end rounded-lg border border-slate-200 px-2.5 py-2 text-xs text-slate-500 hover:bg-slate-50"
            >
              Reset
            </button>
          )}
        </div>
      </Card>

      <Card>
        {terfilter.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">
            <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-slate-300" />
            Tidak ada isu negatif dengan filter saat ini.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="w-10 px-4 py-3">No</th>
                    <th className="w-24 px-4 py-3">Tanggal</th>
                    <th className="min-w-[220px] px-4 py-3">Nama Isu</th>
                    <th className="min-w-[200px] px-4 py-3">Ringkasan</th>
                    <th className="w-44 px-4 py-3">Kewenangan OPD</th>
                    <th className="w-28 px-4 py-3">Klasifikasi</th>
                    <th className="w-36 px-4 py-3">Sumber Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sliced.map((isu, idx) => {
                    const nomor = (safePage - 1) * PAGE_SIZE + idx + 1
                    const ringkasan = isu.ringkasanAI.length > 160
                      ? isu.ringkasanAI.slice(0, 160) + '…'
                      : isu.ringkasanAI
                    const link = urlByIsuId.get(isu.id)
                    return (
                      <tr
                        key={isu.id}
                        className="align-top transition-colors hover:bg-slate-50/60"
                      >
                        <td className="px-4 py-3 font-medium tabular-nums text-slate-400">
                          {nomor}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                          {isu.tanggalMulai}
                        </td>
                        <td className="px-4 py-3 font-semibold leading-snug text-slate-800">
                          {isu.namaIsu}
                        </td>
                        <td className="px-4 py-3 text-xs leading-relaxed text-slate-600">
                          {ringkasan}
                        </td>
                        <td className="px-4 py-3 text-xs font-medium text-slate-700">
                          {isu.opd}
                        </td>
                        <td className="px-4 py-3">
                          <KlasifikasiBadge value={isu.klasifikasi} />
                        </td>
                        <td className="px-4 py-3">
                          {link ? (
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                            >
                              <ExternalLink className="h-3 w-3 shrink-0" />
                              {link.sumber}
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400">
                              {isu.sumberUtama.join(', ')}
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {totalPage > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
                <span className="text-xs text-slate-500">
                  {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, terfilter.length)} dari{' '}
                  {terfilter.length} isu
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="px-2 text-xs font-medium text-slate-700">
                    {safePage} / {totalPage}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
                    disabled={safePage === totalPage}
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  )
}
