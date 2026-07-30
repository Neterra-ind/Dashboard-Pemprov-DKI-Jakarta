import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Opd, StatusPenanganan, TindakLanjut } from '@/types'
import { seedTindakLanjut } from '@/data/mockData'
import { useRole } from '@/lib/role'

interface DisposisiContextValue {
  daftarTindakLanjut: TindakLanjut[]
  statusUntukIsu: (isuId: string) => StatusPenanganan
  tindakLanjutUntukIsu: (isuId: string) => TindakLanjut[]
  tambahDisposisi: (isuId: string, opdTujuan: Opd, catatanArahan: string) => void
  updateTindakLanjut: (id: string, status: StatusPenanganan, catatan: string) => void
}

const DisposisiContext = createContext<DisposisiContextValue | null>(null)

export function DisposisiProvider({ children }: { children: ReactNode }) {
  const [daftarTindakLanjut, setDaftarTindakLanjut] = useState<TindakLanjut[]>(seedTindakLanjut)
  const { role } = useRole()

  const value = useMemo<DisposisiContextValue>(() => {
    function tindakLanjutUntukIsu(isuId: string) {
      return daftarTindakLanjut
        .filter((t) => t.isuId === isuId)
        .sort((a, b) => (a.tanggalDisposisi < b.tanggalDisposisi ? 1 : -1))
    }

    function statusUntukIsu(isuId: string): StatusPenanganan {
      const terbaru = tindakLanjutUntukIsu(isuId)[0]
      return terbaru?.status ?? 'Belum Ditindaklanjuti'
    }

    function tambahDisposisi(isuId: string, opdTujuan: Opd, catatanArahan: string) {
      const baru: TindakLanjut = {
        id: `tl-${Date.now()}`,
        isuId,
        opdTujuan,
        catatanArahan,
        didisposisikanOleh: role,
        tanggalDisposisi: new Date().toISOString().slice(0, 10),
        status: 'Didisposisikan',
      }
      setDaftarTindakLanjut((prev) => [baru, ...prev])
    }

    function updateTindakLanjut(id: string, status: StatusPenanganan, catatan: string) {
      setDaftarTindakLanjut((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                status,
                catatanTindakLanjut: catatan,
                tanggalTindakLanjut: new Date().toISOString().slice(0, 10),
              }
            : t,
        ),
      )
    }

    return { daftarTindakLanjut, statusUntukIsu, tindakLanjutUntukIsu, tambahDisposisi, updateTindakLanjut }
  }, [daftarTindakLanjut, role])

  return <DisposisiContext.Provider value={value}>{children}</DisposisiContext.Provider>
}

export function useDisposisi() {
  const ctx = useContext(DisposisiContext)
  if (!ctx) throw new Error('useDisposisi harus dipakai di dalam DisposisiProvider')
  return ctx
}
