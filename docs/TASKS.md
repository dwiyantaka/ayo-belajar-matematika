# TASKS — Kerjakan berurutan, satu task per sesi

Verifikasi standar (selalu berhenti sendiri) — sebut **[V]**:
```
for f in js/*.js; do node --check "$f" || exit 1; done
node tools/cek-aset.mjs
```
Agen tidak menjalankan server dan tidak membuka peramban; pengguna menguji tampilan.

## T0 — Fondasi
- Lengkapi `index.html` dengan semua `<section class="layar">` sesuai PRD §6 dan kontainer komponen global: `#panel-hamburger` (overlay drawer), `#bilah-suara-global` (speaker mute toggle di luar hamburger), `#nav-global`.
- Siapkan `js/util.js` (`$`, `acak`, `simpan`, `baca`), `js/layar.js` (router + penskalaan panggung 1366×768 + dukungan parameter asal `"onboarding"`/`"menu"` dan `Layar.mulaiUlang()`), `js/app.js` (init), `css/style.css` dasar.
- Pastikan semua kunci aset UI terdaftar di `assets/manifest.js` termasuk aset hamburger (`ui.ikon-hamburger`, `ui.ikon-tutup`, `ui.panel-menu`, `ui.ikon-bantuan`, `ui.ikon-pengaturan`, `ui.ikon-profil`, `ui.ikon-gembok`, `ui.ikon-rumah`).
- Jalankan `node tools/cek-aset.mjs --placeholder` sekali.
- **Selesai bila:** [V] lolos; `Layar.tampil("menu")` tersedia; panggung 1366×768 diskalakan.

## T1 — Layar statis, navigasi, dan Menu Hamburger (FR-01–05, FR-22)
- Bumper (START → onboarding: panduan → tujuan → nama/karakter → menu).
- Menu Utama bersih dengan **2 kartu besar** (Ruang Belajar dan Ruang Bermain) + tombol hamburger "☰ Menu" (min. 48 px).
- Panel hamburger (`#panel-hamburger`):
  - Bantuan: Tujuan Pembelajaran, Panduan Aplikasi (dibuka dengan `asal = "menu"`, tombol kembali kembali ke menu).
  - Pengaturan: Pengaturan Suara (rinci untuk musik, SFX, narasi), Akses Guru (PIN), Profil Pengembang (2 halaman).
  - Bagian Bawah Terpisah: Tombol "Kembali ke awal" (konfirmasi pop-up → reset sesi pemain & skor, kembali ke bumper, riwayat tetap aman).
  - Perilaku buka/tutup: tombol X, klik luar (backdrop), atau tombol **Esc**. Manajemen fokus keyboard aktif.
  - Hamburger hanya aktif di menu dan Ruang Belajar; tidak tampil di layar game (Tebak Jajan & Balap Becak).
- Ikon speaker global (bisu cepat) tetap tampil di luar hamburger di semua layar.
- **Selesai bila:** [V] lolos; alur onboarding berjalan; menu utama menampilkan 2 kartu + hamburger; panel hamburger membuka dan menutup mulus dengan tombol X, klik luar, atau Esc; aksi "Kembali ke awal" mereset sesi tanpa menghapus riwayat di storage.

## T2 — Mesin kuis individu (FR-08, 10–14, 19)
- `js/game.js`: ambil soal dari `BANK_SOAL` (mode "individu" / permainan "tebak") sesuai topik/level, acak soal dan pilihan, tampilkan `Aset.susunan(objek, baris, kolom)`, penilaian, hint, aturan skor 3/2/1, penjelasan setelah percobaan ke-3, layar hasil.
- Ikon **i** (aturan) dan **?** (`FUNFACT[objek]`) sebagai pop-up pada bilah kuis (tanpa tombol hamburger). Kunci tombol saat dinilai.
- **Selesai bila:** [V] lolos; satu sesi 10 soal berjalan dari pilih topik sampai hasil.

## T3 — Ruang Belajar (FR-06, 07)
- Tabel perkalian dan pembagian 1–10 (10 kotak per tabel), peraga visual baris × kolom dengan penjumlahan berulang dan kebalikan.
- Tombol hamburger "☰ Menu" tetap dapat diakses di Ruang Belajar.
- **Selesai bila:** [V] lolos; tabel benar secara matematis.

## T4 — Mode tim dan Balap Becak (FR-09, 18 / BALAP-BECAK.md)
- Tebak Jajan mode tim (2–4 tim, papan skor, pemenang).
- Balap Becak (2 pemain adu cepat via keyboard: Z/X dan ./slash) dengan generator soal dinamis (`js/generator-soal.js`).
- Layar game bebas distraksi: tanpa tombol hamburger.
- **Selesai bila:** [V] lolos; uji generator lolos (`node tools/uji-generator.mjs`); Balap Becak merespons keyboard dengan tepat.

## T5 — Skor dan Akses Guru (FR-15, 16)
- `js/skor.js` (riwayat sesi), `js/guru.js`: PIN 4 digit (default `1234`, wajib dapat diubah), editor soal (penimpaan di `localStorage`), pengaturan game (durasi ronde, lewati onboarding), riwayat skor, ekspor CSV, ekspor/impor JSON soal.
- Akses Guru dibuka dari menu hamburger.
- **Selesai bila:** [V] lolos; verifikasi PIN benar; data tersimpan aman bila `localStorage` gagal.

## T6 — Audio dan narasi (FR-05, 17)
- Musik latar berkelanjutan + gamelan bumper, SFX benar/salah/menang/klik, narasi `Aset.narasi(id)` dengan tombol "dengarkan".
- Speaker global di luar hamburger sebagai tombol bisu cepat; modal pengaturan rinci di hamburger mengontrol status musik, SFX, dan narasi secara independen.
- **Selesai bila:** [V] lolos; ketiadaan berkas audio tidak menimbulkan error.

## T7 — Poles dan QA
- Transisi tirai (bisa dimatikan), konsistensi ikon, jebakan fokus panel hamburger dan keyboard balap, uji klik cepat, cek 1366×768, isi checklist uji fungsi di `docs/UJI-FUNGSI.md`.
- `node tools/cek-aset.mjs --daftar` → serahkan `docs/DAFTAR-ASET.md` ke pengguna.
- **Selesai bila:** [V] lolos; `TASK_LOGS.md` terisi lengkap.
