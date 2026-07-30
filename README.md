# Issues Monitoring Dashboard — Pemkab Wonosobo

Dashboard eksekutif untuk memantau isu dan pemberitaan media terkait Kabupaten Wonosobo: klasifikasi kategori isu, sentimen, ranking OPD, dan alur disposisi/tindak lanjut ke OPD terkait.

Data yang dipakai adalah **264 berita riil** (21–27 Juli 2026, 1 minggu penuh) hasil monitoring media online yang menyebut Wonosobo, sudah diklasifikasikan otomatis ke 10 kategori isu (Pelayanan Publik, Infrastruktur, Pendidikan, Kesehatan, Ekonomi & Ketahanan Pangan, Pariwisata, Lingkungan & Bencana, Sosial & Kemiskinan, Keamanan & Ketertiban, Tata Kelola Pemerintahan) dan entitas terkait (Bupati/Wakil Bupati bila relevan). Bukan data simulasi/dummy.

## Stack

React 19 + TypeScript + Vite (rolldown) + Tailwind CSS v4 (CSS-first `@theme`, lihat `src/index.css`) + Recharts + React Router v7 + TanStack Table + TanStack Query + lucide-react.

## Halaman

- **Executive Summary** (`/`) — ringkasan total berita, grafik ekspos isu harian, sentimen dominan, kartu Issues Negatif, Top 5 Isu Kabupaten, dan ranking publikasi kinerja OPD.
- **Isu Kabupaten Wonosobo** (`/isu-kabupaten`) — daftar isu level kabupaten dengan filter kategori/klasifikasi, grafik tren, media share, dan tabel isu.
- **Isu Bupati & Wakil Bupati** (`/isu-pimpinan`) — reputasi, share of voice, dan isu yang melekat pada masing-masing pimpinan.
- **Pemberitaan OPD** (`/pemberitaan-opd`) — ranking OPD berdasarkan jumlah/isu negatif, plus daftar isu per OPD.
- **Issues Negatif** (`/early-warning`) — isu berklasifikasi Negatif/Potensi Negatif yang perlu direspons OPD, lengkap tombol disposisi.
- **Detail Isu** (`/isu/:id`) — ringkasan AI, penyebab, risiko/eskalasi, rekomendasi, daftar sumber berita asli (link ke artikel), dan riwayat disposisi.
- **Tindak Lanjut** (`/tindak-lanjut`) — tracker status disposisi ke OPD.
- **Data Sumber** (`/data-sumber`) — tabel mentah seluruh berita dengan link ke artikel asli.

## Struktur data penting

- `src/data/beritaWonosobo.json` — 264 berita riil (tanggal, judul, sumber, sentimen, url, kategori, entitasTerkait).
- `src/data/mockData.ts` — clustering berita → Isu (per kombinasi kategori × entitas), generator ringkasan AI, dan penamaan singkat "substansi masalah" untuk kartu Issues Negatif.
- `src/lib/store.tsx` — state disposisi/tindak lanjut (in-memory, tidak persisten).
- `src/lib/role.tsx` — konteks role (Eksekutif/Admin OPD/Super Admin), default Eksekutif.

## Menjalankan

```bash
npm install
npm run dev
```

Build produksi:

```bash
npm run build
```

## Export standalone (opsional)

`Dashboard-Wonosobo-Standalone.html` di root project adalah versi single-file dari halaman Executive Summary (Tailwind + Chart.js via CDN, semua data & gambar ter-embed) — bisa dibuka langsung di browser mana pun tanpa server, cocok untuk dibagikan sebagai laporan statis. Dibangkitkan dari skrip Node terpisah (tidak termasuk dalam source ini), bukan bagian dari build Vite normal.
