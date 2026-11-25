# AGENTS.md — Aturan Kerja Agen (Antigravity / Gemini)

> Baca file ini PERTAMA di setiap sesi. Aturan di bagian 2 dan 3 adalah KEPUTUSAN FINAL, jangan didiskusikan ulang.

## 0. Isi sebelum dipakai (oleh pengguna)

| Variabel | Nilai |
|---|---|
| `<WSL_DISTRO>` | `Ubuntu` |
| `<PROJECT_PATH>` | `/var/www/html/ayo-belajar-matematika` |

## 1. Proyek singkat

Game edukasi **"Ayo Belajar Matematika"**: perkalian dan pembagian fakta dasar 1–10 (hasil sampai 100), kelas IV MI, berkonteks makanan/transportasi/busana khas Jawa. **HTML + CSS + JavaScript murni**, berjalan **offline** dengan membuka `index.html` langsung dari berkas (`file://`) pada laptop sekolah + proyektor (1366×768). Tidak ada Laravel, PHP, Composer, npm, bundler, atau server.

Urutan baca dokumen:
1. `docs/PRD.md` (kebutuhan dan fitur)
2. `docs/ARCHITECTURE.md` (struktur, modul, aturan teknis)
3. `docs/ASSETS.md` (sistem aset)
4. `docs/TASKS.md` (daftar task bertahap; kerjakan berurutan)
5. `TASK_LOGS.md` (catat hasil tiap task)

## 2. Cara Menjalankan Perintah (KEPUTUSAN FINAL, jangan didiskusikan ulang)

Antigravity berjalan di Windows 10, file proyek ada di WSL. Aturan:

1. **Utama:** proyek dibuka lewat *Remote WSL* sehingga terminal agen sudah berada di dalam WSL (prompt bash Linux). Jalankan perintah langsung, mis. `node tools/cek-aset.mjs`.
2. **Fallback** (hanya jika terminal ternyata PowerShell/CMD Windows): bungkus SEMUA perintah proyek dengan format ini, satu perintah per pemanggilan:
   ```
   wsl.exe -d <WSL_DISTRO> --cd <PROJECT_PATH> -- bash -lc "<perintah>"
   ```
3. **Dilarang:** menjalankan `node`, `npm`, `python`, atau `php` versi Windows; mengakses file via `\\wsl$\...` atau `/mnt/c/...` untuk menjalankan perintah; memakai PowerShell untuk logika proyek. Membaca/menulis file lewat tool editor boleh.
4. Semua path dalam perintah memakai path Linux relatif terhadap `PROJECT_PATH`.

## 3. Larangan Mutlak (hemat waktu dan hindari macet)

- **JANGAN** mengecek versi apa pun (`node -v`, `python --version`, `npm -v`, `lsb_release`, dll). Anggap semua sudah terpasang dan sesuai.
- **JANGAN** memeriksa/menginstal/mengupdate paket sistem: tanpa `sudo`, `apt`, `apt-get`, `snap`, `systemctl`, `service`, `brew`.
- **JANGAN** menjalankan perintah interaktif atau yang meminta input (password, konfirmasi y/n, wizard). Selalu non-interaktif.
- **JANGAN** menjalankan proses yang tidak berhenti: `python -m http.server`, `npx serve`, `live-server`, `npm run dev`, `watch`, dll. **Tidak ada server dev.** Pengguna sendiri yang membuka `index.html` di peramban untuk menguji tampilan.
- **JANGAN** memasang paket (`npm install`, `npm ci`, `pip install`). Proyek ini **tanpa dependensi**; alat bantu hanya `tools/*.mjs` yang memakai modul bawaan Node.
- **JANGAN** mengakses internet. Tidak ada CDN, Google Fonts, Firebase, atau API daring. Semua aset lokal.
- **JANGAN** menambah library/framework tanpa alasan tercatat di `TASK_LOGS.md`.
- **JANGAN** membuka `git commit` interaktif. Jika perlu commit, selalu `git commit -m "<pesan>"`.
- **JANGAN** menghapus atau menimpa berkas milik pengguna di `assets/`. Pembuatan placeholder hanya untuk berkas yang belum ada (`node tools/cek-aset.mjs --placeholder` sudah aman).

## 4. Aturan kode dan aset

1. **Tanpa ES Modules** (`import`/`export`) dan **tanpa `fetch()`** ke berkas lokal; keduanya diblokir pada `file://`. Pakai `<script src>` klasik dan variabel global (`window.X`).
2. Semua gambar/audio diambil lewat **`Aset`** (`js/aset.js`) memakai **kunci** dari `assets/manifest.js`. **Dilarang** menulis path aset langsung di kode (mis. `"assets/img/makanan/klepon.svg"`).
3. Warna dan font memakai CSS variable di `css/tema.css`; **dilarang** hardcode warna di `style.css`/JS.
4. Soal hanya dari `js/soal.js` (+ penimpaan dari Akses Guru di `localStorage`). Jangan menulis soal di kode game.
5. Semua pemakaian `localStorage` dibungkus `try/catch` dan harus tetap jalan bila penyimpanan kosong/gagal.
6. Tata letak basis **1366×768** (rasio 16:9), diskalakan otomatis; teks isi min. 28 px; target klik min. 48 px.
7. Benar/salah harus ditandai ikon **dan** teks, bukan warna saja.
8. Kode berkomentar bahasa Indonesia singkat; nama variabel dan fungsi bahasa Indonesia konsisten dengan `docs/ARCHITECTURE.md`.
9. Ikuti prinsip CTML: satu soal per layar, teks singkat (maks. ±25 kata), ornamen tidak menimpa teks.

## 5. Alur kerja per task

1. Baca task di `docs/TASKS.md`, kerjakan hanya task itu.
2. Tulis kode. Verifikasi dengan perintah yang tercantum di task (selalu berhenti sendiri):
   - `for f in js/*.js; do node --check "$f" || exit 1; done` (cek sintaks)
   - `node tools/cek-aset.mjs` (cek aset, soal, kunci jawaban)
3. Tambahkan entri di `TASK_LOGS.md` (apa yang dibuat, berkas yang diubah, hasil verifikasi, hal yang perlu dicek pengguna di peramban).
4. Berhenti dan lapor. Jangan lanjut ke task berikutnya tanpa diminta.

## 6. Definisi selesai (tiap task)

- Perintah verifikasi lolos tanpa error.
- Tidak ada path aset hardcode, tidak ada warna hardcode, tidak ada `import`/`fetch` lokal.
- `TASK_LOGS.md` terisi.
