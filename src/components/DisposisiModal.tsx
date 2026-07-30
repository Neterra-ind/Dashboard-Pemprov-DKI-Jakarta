import { useId, useState } from 'react'
import { Send, X } from 'lucide-react'
import { FilterSelect } from '@/components/FilterSelect'
import { daftarOpd } from '@/data/mockData'
import { useDisposisi } from '@/lib/store'
import type { Isu, Opd } from '@/types'

export function DisposisiModal({
  isu,
  onClose,
  onSubmitted,
}: {
  isu: Isu
  onClose: () => void
  onSubmitted: () => void
}) {
  const { tambahDisposisi } = useDisposisi()
  const [opdTujuan, setOpdTujuan] = useState<string>(isu.opd)
  const [catatan, setCatatan] = useState('')
  const catatanId = useId()

  function submit() {
    tambahDisposisi(isu.id, opdTujuan as Opd, catatan.trim() || 'Mohon segera diklarifikasi ke publik.')
    onSubmitted()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 sm:items-center" onClick={onClose}>
      <div
        className="w-full max-w-md animate-[slideUp_0.2s_ease-out] rounded-t-2xl bg-white p-5 shadow-xl dark:bg-slate-900 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Tindak Lanjuti ke OPD</h3>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{isu.namaIsu}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          <FilterSelect label="OPD Tujuan" value={opdTujuan} options={daftarOpd} onChange={setOpdTujuan} />

          <label htmlFor={catatanId} className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-400">
            Catatan Arahan
            <textarea
              id={catatanId}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              rows={3}
              placeholder="Contoh: Mohon segera diklarifikasi ke publik dan laporkan progres penanganan dalam 2x24 jam."
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </label>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={submit}
            className="flex items-center gap-1.5 rounded-lg bg-brand-red px-3 py-2 text-sm font-medium text-white hover:bg-brand-red/90"
          >
            <Send className="h-3.5 w-3.5" />
            Kirim Disposisi
          </button>
        </div>
      </div>
    </div>
  )
}
