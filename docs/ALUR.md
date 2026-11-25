# ALUR.md — Alur Layar Baru (dengan Menu Hamburger)

> Dokumen ini MENGGANTIKAN urutan layar lama di `docs/PRD.md` (FR-01 s.d. FR-04 dan §6) serta flowchart di Task T0/T1 bila ada yang bertentangan. Bagian lain PRD dan `docs/BALAP-BECAK.md` tetap berlaku.

## 1. Alur utama

```
intro (bumper)
  → panduan
  → tujuan
  → nama-karakter
  → menu (2 kartu besar + tombol "☰ Menu" hamburger)
       │
       ├─ [Kartu 1] Ruang Belajar ── perkalian / pembagian / peraga
       ├─ [Kartu 2] Ruang Bermain ── Tebak Jajan (Sendiri / Tim) | Balap Becak ── hasil ── (ulang | menu)
       │
       └─ [Tombol ☰ Menu] Panel Hamburger (overlay)
            ├─ Bantuan:
            │    ├─ Tujuan Pembelajaran (baca, tombol kembali → menu)
            │    └─ Panduan Aplikasi    (baca, tombol kembali → menu)
            ├─ Pengaturan:
            │    ├─ Suara (modal pengaturan rinci musik, SFX, narasi)
            │    ├─ Akses Guru (dialog PIN 4 digit → editor soal, riwayat, ekspor/impor)
            │    └─ Profil Pengembang (2 halaman profil)
            └─ [Bagian Bawah Terpisah]:
                 └─ Kembali ke awal (konfirmasi "Kembali ke awal?" → Ya: reset sesi, kembali ke intro)
```

## 2. Aturan transisi

| Layar | Komponen Aksi | Layar / Panel Tujuan | Tombol Kembali |
|---|---|---|---|
| `bumper` (intro) | START | → `panduan` | — |
| `panduan` (mode onboarding) | Lanjut | → `tujuan` | → `bumper` |
| `tujuan` (mode onboarding) | Lanjut | → `nama` | → `panduan` |
| `nama` (nama + karakter) | MULAI | → `menu` | → `tujuan` |
| `menu` | Kartu "Ruang Belajar"<br>Kartu "Ruang Bermain"<br>Tombol "☰ Menu" (hamburger) | → `belajar`<br>→ `main`<br>→ Buka `panel-hamburger` (overlay) | tidak ada (menu adalah akar navigasi) |
| `belajar` (Ruang Belajar) | Pilihan sub-menu (kali, bagi, peraga)<br>Tombol "☰ Menu" (hamburger) | → `belajar-kali` / `belajar-bagi` / `peraga`<br>→ Buka `panel-hamburger` (overlay) | → `menu` |
| `main` (Ruang Bermain) | Pilihan game: Tebak Jajan / Balap Becak | → `main-tebak` / `main-balap-setup` | → `menu` |
| `panduan` / `tujuan` (mode menu) | Dibuka via panel hamburger | — | → `menu` (bukan onboarding) |
| `profil` | Dibuka via panel hamburger | Halaman 1 / 2 | → `menu` |
| `guru-pin` / `guru` | Dibuka via panel hamburger | Panel manajemen guru | → `menu` |
| Layar game (`main-tebak`, `main-balap`) | Kuis / balapan keyboard | → `hasil` | → `main` atau `menu` |

Aturan penting:
1. **Layar `panduan` dan `tujuan` dipakai dua kali:** Beri parameter `asal`: `"onboarding"` atau `"menu"`. Perilaku tombol lanjut/kembali mengikuti `asal` (tabel di atas). Jangan membuat dua layar terpisah.
2. **Menu Utama Hanya 2 Kartu + Tombol Hamburger (FR-03 Baru):**
   - Di panggung tengah hanya ada 2 kartu besar: **Ruang Belajar** dan **Ruang Bermain**.
   - Tombol hamburger "☰ Menu" (ikon + teks "Menu", target klik min. 48 px) terletak di sudut bilah navigasi.
   - 5 item fungsional lama (Tujuan, Panduan, Pengaturan Suara, Akses Guru, Profil) serta aksi "Kembali ke awal" dipindahkan ke dalam panel hamburger.
3. **Panel Hamburger (Komponen Modal / Drawer Overlay):**
   - Berisi dua kelompok menu utama dan satu pemisah bawah:
     - **Kelompok Bantuan:** Tujuan Pembelajaran, Panduan Aplikasi.
     - **Pengaturan:** Suara (buka modal pengaturan rinci volume/toggle musik, efek, narasi secara terpisah), Akses Guru (tetap ber-PIN 4 digit), Profil Pengembang.
     - **Bagian Bawah (Terpisah):** "Kembali ke awal" (dengan konfirmasi).
   - **Perilaku Buka/Tutup:**
     - Dibuka melalui klik/tekan tombol "☰ Menu".
     - Ditutup via: tombol **X (Tutup)** di panel, klik di area backdrop/luar panel, atau menekan tombol keyboard **Esc**.
     - Saat panel terbuka, interaksi/input pada layar di belakang panel tidak aktif (inert / pointer-events none).
     - **Aksesibilitas & Fokus:** Saat dibuka, fokus keyboard berpindah ke item pertama di dalam panel (atau tombol X). Saat ditutup, fokus keyboard dikembalikan ke tombol "☰ Menu".
   - **Layar Tempat Hamburger Aktif:**
     - Hamburger **HANYA aktif di layar Menu Utama (`menu`) dan Ruang Belajar (`belajar`)**.
     - Di layar game (**Tebak Jajan** dan **Balap Becak**) hamburger **TIDAK tampil**, agar tidak mengganggu timer ronde kuis dan input tombol keyboard balapan (Z, X, titik, strip miring). Ikon **i** (aturan) dan **?** (fun fact) di layar game tetap dipertahankan.
4. **Ikon Speaker Global (FR-05):**
   - Ikon speaker (bisu cepat/mute toggle) tetap tampil mandiri di luar hamburger di semua layar (pojok kanan atas).
   - Tombol "Suara" di dalam hamburger berfungsi untuk membuka panel dialog pengaturan rinci audio (musik, SFX, dan narasi yang masing-masing dapat dimatikan/dihidupkan).
5. **Tombol "Kembali ke awal" (di bagian bawah panel hamburger):**
   - Menampilkan konfirmasi pop-up "Kembali ke awal?" (Ya / Tidak).
   - Jika Ya:
     - Kembali ke layar `bumper` (intro);
     - Nama pemain, pilihan karakter, dan skor sesi aktif direset ke awal;
     - **Riwayat skor yang sudah tersimpan di `localStorage` TIDAK dihapus**;
     - Musik latar berhenti dan gamelan bumper diputar kembali;
     - Jendela peramban tidak ditutup.
6. **Alur Onboarding:**
   - Alur pertama kali membuka aplikasi tidak berubah: `intro (bumper)` → `panduan` → `tujuan` → `nama/karakter` → `menu`.
   - Pada putaran kedua dan seterusnya (sesudah aksi Kembali ke awal), layar `panduan` dan `tujuan` menampilkan tombol **Lewati** yang langsung menuju layar `nama`. Pengaturan guru `lewatiOnboarding` (default `false`) bila diaktifkan akan melompati kedua layar onboarding otomatis pada putaran berikutnya.
7. **Integritas Navigasi:**
   - `Layar.kembali()` tidak boleh membawa pengguna dari `menu` kembali ke layar onboarding (`nama`/`tujuan`/`panduan`). Tumpukan riwayat navigasi selalu direset saat memasuki layar `menu` dan saat "Kembali ke awal".

## 3. Dampak ke task

- **T0:** Siapkan kontainer HTML untuk komponen panel hamburger (`#panel-hamburger` beserta overlay-nya) di `index.html`. `Layar` mendukung parameter `asal` dan perintah `Layar.mulaiUlang()`.
- **T1:** Implementasikan 2 kartu menu utama (Ruang Belajar dan Ruang Bermain), tombol "☰ Menu", panel hamburger beserta buka/tutup (klik luar, Esc, fokus trap), pemindahan navigasi Bantuan & Pengaturan ke panel hamburger, tombol "Kembali ke awal" + konfirmasi, dan tombol Lewati.
- **Selesai bila:** [V] lolos; menu utama tampil bersih dengan 2 kartu besar + hamburger; panel hamburger dapat dibuka/tutup dengan rapi di menu dan Ruang Belajar; hamburger tidak muncul di layar game; alur onboarding berjalan utuh; aksi "Kembali ke awal" mereset sesi tanpa menghapus riwayat skor tersimpan.

## 4. Catatan untuk dokumen penelitian

Storyboard 2, Gambar 3.1 (struktur navigasi), dan naskah Bab III pada laporan penelitian perlu direvisi:
- Menu utama tidak lagi menggunakan tata letak 6 kotak tombol seragam, melainkan **2 kartu pilihan utama (Ruang Belajar dan Ruang Bermain)** dengan **1 tombol menu hamburger ("☰ Menu")**.
- Item bantuan, pengaturan suara, akses guru, profil, dan kembali ke awal diorganisasikan ke dalam menu drawer/hamburger demi keterbacaan visual siswa kelas IV MI pada layar proyektor.
- Di flowchart Bab III, jalur keluar kembali ke intro (bukan "Selesai"/tutup peramban).
