# Issues Monitoring Dashboard — Pemprov DKI Jakarta

Dashboard eksekutif untuk memantau isu dan pemberitaan media terkait Provinsi DKI Jakarta: klasifikasi kategori isu, sentimen, ranking OPD, dan alur disposisi/tindak lanjut ke OPD terkait.

Data yang dipakai adalah **3.210 berita riil unik** (23–28 Juli 2026) hasil monitoring media online yang relevan secara spesifik dengan DKI Jakarta (difilter dan dideduplikasi dari 43.624 baris mentah di 4 file sumber: gubernur, wakil gubernur, OPD, dan wilayah), sudah diklasifikasikan otomatis ke 10 kategori isu (Pelayanan Publik, Infrastruktur, Pendidikan, Kesehatan, Ekonomi & Ketahanan Pangan, Pariwisata, Lingkungan & Bencana, Sosial & Kemiskinan, Keamanan & Ketertiban, Tata Kelola Pemerintahan) dan entitas terkait (Gubernur/Wakil Gubernur bila relevan). Bukan data simulasi/dummy.

Project ini adalah **duplikat** dari dashboard serupa untuk Pemkab Wonosobo — struktur komponen, desain, dan tech stack identik, hanya data dan branding yang disesuaikan.

## Stack

React 19 + TypeScript + Vite (rolldown) + Tailwind CSS v4 (CSS-first `@theme`, lihat `src/index.css`) + Recharts + React Router v7 + TanStack Table + TanStack Query + lucide-react.

## Halaman

- **Executive Summary** (`/`) — ringkasan total berita, grafik ekspos isu harian, sentimen dominan, kartu Issues Negatif, Top 5 Isu Provinsi, dan ranking publikasi kinerja OPD.
- **Isu Provinsi DKI Jakarta** (`/isu-provinsi`) — daftar isu level provinsi dengan filter kategori/klasifikasi, grafik tren, media share, dan tabel isu.
- **Isu Gubernur & Wakil Gubernur** (`/isu-pimpinan`) — reputasi, share of voice, dan isu yang melekat pada masing-masing pimpinan.
- **Pemberitaan OPD** (`/pemberitaan-opd`) — ranking OPD berdasarkan jumlah/isu negatif, plus daftar isu per OPD.
- **Issues Negatif** (`/early-warning`) — isu berklasifikasi Negatif/Potensi Negatif yang perlu direspons OPD, lengkap tombol disposisi.
- **Detail Isu** (`/isu/:id`) — ringkasan AI, penyebab, risiko/eskalasi, rekomendasi, daftar sumber berita asli (link ke artikel), dan riwayat disposisi.
- **Tindak Lanjut** (`/tindak-lanjut`) — tracker status disposisi ke OPD.
- **Data Sumber** (`/data-sumber`) — tabel mentah seluruh berita dengan link ke artikel asli.

## Struktur data penting

- `src/data/beritaJakarta.json` — 3.210 berita riil (tanggal, judul, sumber, sentimen, url, kategori, entitasTerkait).
- `src/data/mockData.ts` — clustering berita → Isu (per kombinasi kategori × entitas), generator ringkasan AI, dan penamaan singkat "substansi masalah" untuk kartu Issues Negatif.
- `src/lib/store.tsx` — state disposisi/tindak lanjut (in-memory, tidak persisten).
- `src/lib/role.tsx` — konteks role (Eksekutif/Admin OPD/Super Admin), default Eksekutif.

## Menjalankan

```bash
npm install
npm run dev
```

Dev server berjalan di **port 5174** (beda dari project Wonosobo di 5173) supaya keduanya bisa dijalankan bersamaan.

Build produksi:

```bash
npm run build
```
