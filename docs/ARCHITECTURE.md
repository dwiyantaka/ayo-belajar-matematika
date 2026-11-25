# ARCHITECTURE

## Stack
HTML + CSS + JavaScript murni, SVG untuk ilustrasi. **Tanpa** framework, bundler, npm, server. Alat bantu: `tools/cek-aset.mjs` (Node bawaan, tanpa paket).

## Struktur
```
index.html            shell + urutan muat skrip + kontainer layar & panel overlay
galeri-aset.html      halaman cek/pratinjau semua aset (dibuka pengguna di peramban)
AGENTS.md GEMINI.md PROMPT-AWAL.md TASK_LOGS.md
docs/                 PRD, ARCHITECTURE, ASSETS, TASKS, ALUR, BALAP-BECAK, DAFTAR-ASET
css/  tema.css        warna, ukuran, variabel (SATU tempat ganti tema)
      fonts.css       @font-face ke assets/fonts
      style.css       tata letak (hanya memakai variabel tema)
js/   aset.js         pemuat aset (SIAP, jangan diubah kecuali bug)
      soal.js         bank soal (SIAP, 38 soal) + PESAN umpan balik
      generator-soal.js generator soal dinamis untuk Balap Becak
      funfact.js      fun fact per objek (SIAP)
      util.js         acak(), simpan()/baca() localStorage aman, $()
      skor.js         riwayat skor & ekspor CSV
      layar.js        router layar + penskalaan panggung
      menu-hamburger.js modul panel drawer hamburger (buka/tutup, overlay, fokus Esc)
      belajar.js      tabel perkalian/pembagian & peraga visual
      game.js         kuis Tebak Jajan (Sendiri/Tim) dan arena Balap Becak
      guru.js         PIN, editor soal, riwayat, ekspor/impor
      app.js          inisialisasi aplikasi & pemasangan navigasi
assets/ manifest.js   DAFTAR ASET (satu-satunya tempat ganti/tambah aset)
        img/ audio/ fonts/ (lihat ASSETS.md)
tools/  cek-aset.mjs  cek aset + validasi soal; --placeholder; --daftar
        uji-generator.mjs penguji generator soal Balap Becak
```

## Urutan muat di `index.html`
`assets/manifest.js` → `js/aset.js` → `js/soal.js` → `js/generator-soal.js` → `js/funfact.js` → `js/util.js` → `js/skor.js` → `js/layar.js` → `js/menu-hamburger.js` → `js/belajar.js` → `js/game.js` → `js/guru.js` → `js/app.js`

## API yang sudah ada (jangan ditulis ulang)
- `Aset.img(kunci, kelas?)` → `<img>` (otomatis placeholder jika berkas belum ada)
- `Aset.url(kunci)` → URL bergambar
- `Aset.susunan(kunciObjek, baris, kolom)` → `<div class="susunan">` grid berisi ikon (baris = kelompok, kolom = isi)
- `Aset.putar(kunciAudio)` / `Aset.henti(kunciAudio)` / `Aset.narasi(idSoal)` (diam jika berkas tidak ada)
- `Aset.suara` = `{ musik:true, sfx:true, narasi:true }` (ubah lewat `Aset.atur(jenis, nilai)`)
- `Aset.hilang()` → daftar kunci yang jatuh ke placeholder
- `BANK_SOAL` (array), `PESAN` ({benar:[], salah:[], semangat:[]}), `FUNFACT` ({ "makanan.klepon": "..." })

## Komponen Menu Hamburger (`js/menu-hamburger.js`)
- Mengontrol komponen panel drawer overlay (`#panel-hamburger`) dan tombol pemicu "☰ Menu" (`#btn-hamburger`).
- **Aturan Visibilitas:**
  - Aktif dan tampil hanya pada layar `menu` (Menu Utama) dan `belajar` (Ruang Belajar).
  - Tersembunyi penuh pada layar `bumper`, `panduan`, `tujuan`, `nama`, dan seluruh layar game (`main-tebak`, `main-balap-setup`, `main-balap`).
- **Manajemen Fokus dan Aksesibilitas:**
  - Saat dibuka: simpan elemen fokus sebelumnya (`document.activeElement`), setel panel `hidden = false`, pindahkan fokus ke tombol tutup X (`#btn-tutup-hamburger`) atau item menu pertama. Elemen di luar panel dinonaktifkan dari interaksi (`inert` atau backdrop modal).
  - Saat ditutup: kembalikan fokus ke tombol hamburger (`#btn-hamburger`).
  - Menutup panel dapat dipicu oleh tombol X, klik area backdrop luar, atau menekan tombol keyboard **Esc**.
- **Isi Panel:**
  1. Kelompok Bantuan: Tujuan Pembelajaran, Panduan Aplikasi.
  2. Kelompok Pengaturan: Pengaturan Suara (rinci), Akses Guru (PIN), Profil Pengembang.
  3. Bagian Bawah Terpisah: Tombol "Kembali ke awal" (dengan modal dialog konfirmasi reset sesi).

## Skema soal (`js/soal.js`)
```js
{ id:"P-01", permainan:"tebak", operasi:"kali"|"bagi", level:1|2|3,
  objek:"makanan.klepon"|null, susunan:{baris:3,kolom:5}|null,   // yang DIGAMBAR
  operan:[3,5],            // kali: a×b ; bagi: a÷b  (dipakai validator)
  teks:"...", pilihan:[8,12,15,35], kunci:15, hint:"...", penjelasan:"3 × 5 = 15" }
```
Penimpaan guru disimpan di `localStorage["abm.soalGuru"]` sebagai `{tambah:[soal], ubah:{id:soal}, hapus:[id]}`; daftar soal akhir = `BANK_SOAL` digabung penimpaan.

## Penyimpanan (`localStorage`, semua try/catch)
`abm.skor` (riwayat sesi), `abm.pengaturan` (aturan skor, jumlah soal, audio, PIN), `abm.soalGuru`.
Riwayat sesi: `{ pemain, kelompok, mode, topik, tanggal, benar, total, skor, durasiDetik }`.

## Panggung dan penskalaan
Elemen `#panggung` berukuran tetap 1366×768, diskalakan dengan `transform: scale()` agar muat jendela/proyektor (letterbox, tengah). Semua koordinat dalam piksel basis.

## Router layar
Tiap layar = `<section class="layar" id="layar-<nama>" hidden>`. `Layar.tampil(nama)`; `Layar.kembali()` memakai tumpukan riwayat; menu utama bisa dipanggil dari mana saja.

## Audio
Autoplay diblokir peramban: musik/gamelan baru diputar setelah klik START. Tombol speaker global di luar hamburger berfungsi sebagai tombol bisu cepat (mute toggle). Pengaturan rinci volume / toggle instrumen (musik, SFX, narasi) diatur melalui panel pengaturan suara di menu hamburger.

## Pengujian
Agen: `node --check` tiap `js/*.js` dan `node tools/cek-aset.mjs`. Pengguna: buka `index.html` dan `galeri-aset.html` di peramban. Checklist uji fungsi (black-box): navigasi, kontrol media, kuis/skor/hint/ulang/tim, Akses Guru, tampilan 1366×768 + mode luring.
