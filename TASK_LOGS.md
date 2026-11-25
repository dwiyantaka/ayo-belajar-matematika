# TASK_LOGS

Catat satu entri per task. Format:

## T<nomor> — <judul> — <tanggal>
- **Dibuat/diubah:** berkas...
- **Verifikasi:** perintah + hasil ringkas
- **Perlu dicek pengguna di peramban:** ...
- **Paket/alat tambahan (jika ada) + alasan:** -
- **Catatan/penyimpangan dari docs:**

## T7-REV15 — Penyelarasan Kunci Manifest Foto Profil Pengembang — 2026-11-25
- **Dibuat/diubah:**
  1. `assets/manifest.js`:
     - Menyelaraskan kunci pendaftaran foto profil pengembang agar menyertakan kunci bertanda titik (`profil.1`, `profil.2`, `profil.3`, `profil.4`) sesuai pemanggilan di `js/app.js` (`Aset.img("profil." + i)`), sekaligus mempertahankan alias tanpa titik (`profil1`, `profil2`, `profil3`, `profil4`).
     - Menaikkan versi manifest ke 13 (`versi: 13`) agar cache peramban otomatis terbarui saat memuat berkas foto baru (.jpeg, .jfif).
- **Verifikasi:**
  - `node tools/cek-aset.mjs`: lolos validasi (96/96 gambar terdaftar & ada, 38 soal valid).
  - `node tools/uji-generator.mjs`: lolos validasi (54.000 kombinasi soal valid).
  - `node --check js/app.js && node --check js/aset.js`: sintaks JS valid.
- **Perlu dicek pengguna di peramban:**
  - Buka/segarkan `index.html`, buka menu hamburger -> **Profil Pengembang**:
    - Halaman 1: Foto pengembang 1 (`pengembang1.jpeg`) dan 2 (`pengembang2.jpeg`) muncul dengan jelas.
    - Halaman 2: Foto pengembang 3 (`pengembang3.jpeg`) dan 4 (`pengembang4.jfif`) muncul dengan jelas.


## T7-REV14 — Perbaikan Overflow Kotak Wadah Akses Guru & Format Kolom Riwayat Skor — 2026-11-24
- **Dibuat/diubah:**
  1. `index.html`:
     - Menghapus kelas `wadah-konten-statis` yang menumpuk pada `#layar-guru` sehingga `.wadah-guru-panel` berdiri secara independen tanpa batasan padding statis yang menyebabkan konten meluap.
     - Mengubah header kolom tabel riwayat skor dari `<th>Topik / Level</th>` menjadi `<th>Level</th>`.
  2. `js/guru.js`:
     - Di fungsi `renderRiwayatSkorGuru()`, kolom Permainan (`tdPer`) kini hanya menampilkan nama permainan murni ("Balap Becak" atau "Hitung Jajan") tanpa keterangan jumlah pemain/mode seperti ` (sendiri)` atau ` (tim)`.
     - Kolom Level (`tdTop`) kini menampilkan `-` untuk permainan Balap Becak, dan `Level X` untuk Hitung Jajan.
  3. `css/style.css`:
     - Menambahkan aturan spesifik `#layar-guru { padding: 75px 50px 25px 50px; }` agar proporsional di panggung 1366×768.
     - Memperbaiki `.wadah-guru-panel` dengan `height: 590px; max-height: 590px; box-sizing: border-box; overflow: hidden; display: flex; flex-direction: column;`.
     - Mengatur `.guru-tab-konten` agar fleksibel (`flex: 1; min-height: 0; overflow: hidden;`).
     - Mengatur `.guru-tabel-wrapper` (pada tab Daftar Soal dan Riwayat Skor) menjadi `flex: 1; min-height: 0; overflow-y: auto; overflow-x: auto;` sehingga seluruh baris soal dan riwayat discroll rapi di dalam kotak wadah tanpa meluap keluar.
     - Mengatur `.guru-form-pengaturan` (pada tab Pengaturan) menjadi `flex: 1; min-height: 0; overflow-y: auto;` sehingga seluruh form pengaturan (PIN, lintasan, waktu, jumlah soal, dsb.) pas dan dapat digulir di dalam kotak wadah.
     - Menambahkan styling scrollbar halus bernuansa tema Jawa (`--soga` dan `--krem-muda`).
- **Verifikasi:**
  - `node tools/cek-aset.mjs`: lolos validasi (92/92 gambar ada, 2/3 font ada, 38 soal valid).
  - `node tools/uji-generator.mjs`: lolos validasi (54.000 kombinasi soal valid).
  - `node --check js/*.js`: seluruh skrip JS lolos validasi sintaks tanpa galat.
- **Perlu dicek pengguna di peramban:**
  - Buka/segarkan `index.html`, masuk ke **Akses Guru (PIN: 1234)**:
    1. Periksa tab **Daftar Soal**: tabel soal berada rapi di dalam kotak wadah putih dan dapat digulir secara vertikal tanpa ada elemen yang meluap ke luar garis batas kotak.
    2. Periksa tab **Riwayat Skor**:
       - Header kolom telah berubah menjadi **Level**.
       - Kolom **Permainan** hanya menampilkan "Balap Becak" atau "Hitung Jajan" tanpa label pemain/mode `(sendiri)` / `(tim)`.
       - Kolom **Level** terisi tanda strip `-` untuk Balap Becak, dan terisi `Level 1` / `Level 2` / `Level 3` untuk Hitung Jajan.
       - Tabel berada rapi di dalam wadah dengan scroll vertikal internal.
    3. Periksa tab **Pengaturan**: seluruh formulir pengaturan kini muat rapi di dalam kotak wadah tanpa meluap keluar, lengkap dengan scroll internal bila layar membutuhkan.


## T7-REV13 — Pop-up Umpan Balik Kuis di Tengah Layar dengan Efek Blur & Ikon WebP — 2026-11-24
- **Dibuat/diubah:**
  1. `assets/manifest.js`:
     - Memperbarui pendaftaran `ui.ikon-benar` ke `ui/ikon-benar.webp` dan `ui.ikon-salah` ke `ui/ikon-salah.webp` serta menaikkan versi manifest ke 12.
  2. `index.html`:
     - Mengubah kontainer umpan balik kuis Hitung Jajan (`#layar-main-tebak`) dari banner bawah menjadi modal pop-up tengah layar (`.modal-overlay-kuis` & `.popup-umpan-balik`).
     - Menyusun elemen pop-up secara vertikal terpusat: wadah ikon di bagian atas (`#kuis-ikon-status`), teks judul respon (`#kuis-teks-status`), teks petunjuk/penjelasan (`#kuis-teks-bantuan`), dan tombol aksi (`#btn-kuis-lanjut`).
  3. `js/game.js`:
     - Menyesuaikan teks umpan balik saat benar ("Horee, jawaban kamu benar!") dengan tombol "Lanjut soal".
     - Menyesuaikan teks umpan balik saat salah ("Yahh, jawaban kamu salah nih") dengan tombol "Coba lagi" (percobaan 1–2) atau tombol "Lanjut soal" (jika sudah 3x salah).
  4. `css/style.css`:
     - Menambahkan backdrop overlay dengan latar belakang semi-transparan hitam 50% (`background: rgba(0, 0, 0, 0.5)`) dan efek blur (`backdrop-filter: blur(8px)`).
     - Menata kartu pop-up di tengah layar dengan sudut lengkung 28px, ukuran ikon 140px, tipografi LilitaOne 34px, dan animasi pop-in halus.
- **Verifikasi:**
  - `node tools/cek-aset.mjs`: lolos validasi (92/92 gambar ada, 2/3 font ada, 38 soal valid).
  - `node tools/uji-generator.mjs`: lolos validasi (54.000 kombinasi soal valid).
  - `node --check js/*.js`: seluruh skrip JS lolos validasi sintaks tanpa galat.
- **Perlu dicek pengguna di peramban:**
  - Buka/segarkan `index.html`, masuk ke **Ruang Bermain** -> **Hitung Jajan**:
    1. Klik jawaban yang benar: muncul pop-up di tengah layar dengan latar belakang blur 50%, menampilkan `ikon-benar.webp` besar di atas teks "Horee, jawaban kamu benar!" dan tombol "Lanjut soal".
    2. Klik jawaban yang salah: muncul pop-up di tengah layar dengan latar belakang blur 50%, menampilkan `ikon-salah.webp` besar di atas teks "Yahh, jawaban kamu salah nih" dan tombol "Coba lagi" (atau "Lanjut soal" setelah percobaan ke-3).

## T7-REV12 — Transisi Aset ke Ilustrasi Soal, 3 Pilihan Jawaban, & Pengaturan Jumlah Soal Guru — 2026-11-24
- **Dibuat/diubah:**
  1. `assets/ilustrasi-soal/`:
     - Membuat folder baru `assets/ilustrasi-soal/` beserta berkas panduan `README.md` untuk meletakkan berkas gambar ilustrasi soal secara manual (.png, .webp, .jpg, .svg).
  2. `js/soal.js`:
     - Mengubah skema visual soal dari `objek`/`susunan` ikon berulang menjadi `ilustrasi` (nama berkas ilustrasi mandiri).
     - Menyesuaikan seluruh 38 soal agar masing-masing memiliki tepat 3 pilihan jawaban (1 kunci + 2 distraktor).
  3. `js/aset.js` & `js/game.js`:
     - Menambahkan fungsi `Aset.ilustrasi(namaFile, kelas)` yang otomatis memuat berkas dari `assets/ilustrasi-soal/` dengan fallback placeholder SVG jika berkas belum ditaruh.
     - Memperbarui `muatSoalTebak` untuk menampilkan gambar ilustrasi soal tunggal.
     - Memperbarui `siapkanSoalTebak` agar mengambil target jumlah soal dinamis dari konfigurasi guru (`abm.pengaturan.jumlahSoal`).
  4. `js/guru.js` & `index.html`:
     - Mengubah kolom aset pada modal editor soal dari dropdown manifest ikon makanan menjadi input teks nama file ilustrasi (`#form-soal-ilustrasi`).
     - Menambahkan kolom `Ilustrasi` pada tabel daftar soal di panel Akses Guru.
     - Menambahkan dropdown pilihan ketentuan jumlah soal (5, 10, 15, 20 soal) pada tab Pengaturan Akses Guru (`#peng-jumlah-soal`).
  5. `css/style.css`:
     - Mengubah tata letak pilihan jawaban kuis (`.grid-pilihan-jawaban`) menjadi grid 3 kolom (`repeat(3, 1fr)`) yang simetris dan lapang.
     - Menambahkan styling `.img-ilustrasi-soal` untuk gambar ilustrasi soal berbingkai proporsional.
  6. `tools/cek-aset.mjs`:
     - Menyesuaikan aturan validasi agar memastikan 3 pilihan jawaban per soal dan mengabaikan direktori manual `assets/ilustrasi-soal`.
- **Verifikasi:**
  - `node tools/cek-aset.mjs`: lolos validasi (92/92 gambar ada, 2/3 font ada, seluruh 38 soal valid dengan 3 pilihan jawaban).
  - `node tools/uji-generator.mjs`: lolos validasi (54.000 kombinasi soal valid).
  - `node --check js/*.js`: seluruh skrip JS lolos validasi sintaks tanpa galat.
- **Perlu dicek pengguna di peramban:**
  - Buka/segarkan `index.html`:
    1. Buka **Akses Guru (PIN: 1234)** -> Tab **Pengaturan**: terdapat opsi baru "Ketentuan Jumlah Soal (Hitung Jajan)" dengan pilihan 5, 10, 15, dan 20 soal.
    2. Tab **Daftar Soal** -> Klik **Tambah Soal** atau **Edit**: kolom aset telah berubah menjadi input nama berkas ilustrasi soal (misal `P-01.png` yang dapat diletakkan di `assets/ilustrasi-soal/`).
    3. Mainkan kuis **Hitung Jajan**: setiap soal kini menyajikan tepat 3 pilihan tombol jawaban yang rapi berjajar 3 kolom horizontal, dan menampilkan gambar ilustrasi soal.

## T7-REV11 — Perubahan Judul Hitung Jajan, Ikon Baru, & Pembersihan Wadah Ruang Bermain — 2026-11-24
- **Dibuat/diubah:**
  1. `assets/manifest.js`:
     - Mendaftarkan ikon baru `ui.ikon-hitung` (`ui/ikon-hitung-jajan.webp`) dan memperbarui `ui.ikon-balap` (`ui/ikon-balap-becak.jfif`), dengan fallback alias `ui.ikon-tebak`. Versi manifest dinaikkan ke 11.
  2. `index.html`:
     - Mengubah seluruh label dan elemen judul dari "Tebak Jajan" menjadi "Hitung Jajan" pada Panduan Aplikasi, tombol menu Ruang Bermain, judul layar setup level, dan tombol mulai.
     - Menghilangkan kotak wadah `.wadah-konten-statis` di Ruang Bermain (`#layar-main`), digantikan `.wadah-konten-transparan`.
     - Menghapus subjudul layar "Pilih permainan yang ingin kamu mainkan:" dan subjudul pada masing-masing kartu, menyisakan judul saja ("Ruang Bermain", "Hitung Jajan", dan "Balap Becak").
  3. `js/game.js` & `js/guru.js`:
     - Memperbarui pemuatan ikon kartu menggunakan `ui.ikon-hitung` dan `ui.ikon-balap`.
     - Memperbarui tabel rekaman nilai di panel Akses Guru agar menampilkan nama permainan "Hitung Jajan".
  4. `css/style.css`:
     - Menata tata letak `#layar-main`, `.menu-main-grid`, dan `.tombol-menu-kartu` berdimensi 330px × 310px dengan wadah ikon ilustrasi 280px × 190px (`object-fit: cover`) serta tipografi judul LilitaOne 32px.
- **Verifikasi:**
  - `node tools/cek-aset.mjs`: lolos validasi (92/92 gambar ada, 2/3 font ada, 38 soal valid).
  - `node tools/uji-generator.mjs`: lolos validasi (54.000 kombinasi soal valid).
  - `node --check js/app.js && node --check js/game.js && node --check js/guru.js`: lolos sintaks tanpa galat.
- **Perlu dicek pengguna di peramban:**
  - Buka/segarkan `index.html`:
    1. Buka **Ruang Bermain**: kotak wadah krem luar dan teks subjudul sudah hilang; kedua kartu permainan tampil terpusat dengan ikon baru `ikon-hitung-jajan.webp` dan `ikon-balap-becak.jfif`.
    2. Judul permainan pertama kini bernama **Hitung Jajan** di menu permainan, layar setup level ("Mulai Hitung Jajan"), panduan aplikasi, dan rekap skor guru.

## T7-REV10 — Wadah Menu Ruang Belajar Transparan & Penghapusan Menu Peraga Visual — 2026-11-24
- **Dibuat/diubah:**
  1. `index.html`:
     - Mengubah wadah menu materi pada `#layar-belajar` dari `.wadah-konten-statis` (kotak krem berborder tebal) menjadi `.wadah-konten-transparan` tanpa latar belakang maupun border kotak.
     - Menghapus tombol menu Peraga Visual (`#btn-ke-peraga`) dari menu Ruang Belajar.
     - Memperbarui teks pada Panduan Aplikasi agar selaras tanpa menyebut menu peraga visual.
  2. `js/app.js`:
     - Menghapus pendaftaran event listener tombol `#btn-ke-peraga` pada array `tautanLain`.
  3. `css/style.css`:
     - Menambahkan styling `.wadah-konten-transparan` (transparan tanpa border dan tanpa shadow) dan tata letak tengah `#layar-belajar`.
     - Mengatur ulang `.menu-belajar-grid` dan memperbesar gambar kartu Perkalian & Pembagian (`.tombol-kartu-gambar img` menjadi lebar 270 px) sehingga proporsional dan elegan di layar.
- **Verifikasi:**
  - `node tools/cek-aset.mjs`: lolos validasi (91/91 gambar ada, 2/3 font ada, 38 soal valid).
  - `node tools/uji-generator.mjs`: lolos validasi (54.000 kombinasi soal valid).
  - `node --check js/app.js && node --check js/belajar.js`: sintaks valid tanpa error.
- **Perlu dicek pengguna di peramban:**
  - Buka/segarkan `index.html`, masuk ke menu Ruang Belajar:
    1. Kotak wadah krem berborder pada menu Ruang Belajar sudah hilang/transparan, menyatu dengan latar panggung.
    2. Menu Peraga Visual sudah tidak ada; tersisa dua kartu prangko besar Perkalian dan Pembagian yang rapi dan terpusat di tengah layar.

## T7-REV9 — Tombol Menu Utama Kapsul Hijau & Kartu Menu Gambar Perkalian/Pembagian — 2026-11-24
- **Dibuat/diubah:**
  1. `assets/manifest.js`:
     - Mendaftarkan aset gambar `ui.perkalian` (`ui/perkalian.webp`) dan `ui.pembagian` (`ui/pembagian.webp`) serta menaikkan versi manifest ke 10.
  2. `index.html`:
     - Menghilangkan wadah kotak kartu persegi, ikon gambar lama, dan subjudul pada tombol Ruang Belajar & Ruang Bermain di Menu Utama.
     - Mengubah menu Tabel Perkalian dan Tabel Pembagian di Ruang Belajar menjadi tombol gambar murni (`.tombol-kartu-gambar`) tanpa wadah kotak dan tanpa teks keterangan sama sekali.
  3. `js/app.js`:
     - Menyematkan aset gambar kartu `ui.perkalian` dan `ui.pembagian` ke wadah gambar tombol Ruang Belajar.
  4. `css/style.css`:
     - Mengatur `.tombol-kartu-utama` menggunakan latar belakang kapsul hijau `assets/img/ui/tombol-start.webp` dengan ukuran proporsional (480px × 155px) membungkus teks tipografi `LilitaOne` 42px warna putih.
     - Menambahkan styling `.tombol-kartu-gambar` (tanpa background/border, transisi hover halus) dan menyelaraskan tata letak kartu Ruang Belajar (`.menu-belajar-grid`).
- **Verifikasi:**
  - `node tools/cek-aset.mjs`: lolos validasi (91/91 gambar ada, 2/3 font ada, 38 soal valid).
  - `node tools/uji-generator.mjs`: lolos validasi (54.000 kombinasi soal valid).
  - `node --check js/app.js`: lolos cek sintaks tanpa galat.
- **Perlu dicek pengguna di peramban:**
  - Buka/segarkan `index.html`:
    1. Pada Menu Utama: tombol "Ruang Belajar" dan "Ruang Bermain" kini berlatar kapsul hijau `tombol-start.webp` yang pas terhadap teks tanpa kotak wadah dan tanpa subjudul.
    2. Masuk ke Ruang Belajar: menu Perkalian dan Pembagian kini tampil berupa gambar kartu `perkalian.webp` dan `pembagian.webp` yang cantik tanpa kotak wadah dan tanpa teks sama sekali.

## T7-REV8 — Penghapusan Fungsi Narasi Suara & Fitur Tirai Akses Guru — 2026-11-24
- **Dibuat/diubah:**
  1. `index.html`:
     - Menghilangkan baris toggle Narasi Suara (`#toggle-narasi`) dari Modal Pengaturan Suara.
     - Mengubah subjudul menu Suara menjadi "Musik & efek suara".
     - Menghilangkan tombol dengar narasi (`#btn-kuis-dengar`) dari bilah informasi kuis Tebak Jajan.
     - Menghilangkan checkbox pengaturan transisi tirai (`#peng-animasi-tirai`) dari formulir Akses Guru.
  2. `js/aset.js`, `js/app.js`, `js/menu-hamburger.js`, `js/game.js`:
     - Menghilangkan status dan kontrol `narasi` dari `Aset.suara`, modal suara, tombol bisu cepat (speaker), dan kuis Tebak Jajan.
  3. `js/guru.js` & `js/layar.js`:
     - Menghilangkan konfigurasi dan penanganan `animasiTirai` dari form Akses Guru.
     - Menyederhanakan transisi `Layar.tampil()` sehingga pergantian layar selalu instan dan bersih tanpa tirai.
- **Verifikasi:**
  - `node tools/cek-aset.mjs`: lolos validasi (89/89 gambar ada, 2/3 font ada, 38 soal valid).
  - `node tools/uji-generator.mjs`: lolos validasi (54.000 kombinasi soal valid).
  - `for f in js/*.js; do node --check "$f"; done`: seluruh skrip JS lolos validasi sintaks tanpa galat.
- **Perlu dicek pengguna di peramban:**
  - Buka/segarkan `index.html`:
    1. Buka Menu Hamburger -> Pengaturan Suara: kini hanya ada kontrol Musik Latar dan Efek Suara (SFX).
    2. Masuk ke Ruang Bermain -> Tebak Jajan: tombol dengar narasi (ikon speaker soal) sudah tidak ada.
    3. Masuk ke Menu Hamburger -> Akses Guru (PIN 1234) -> tab Pengaturan: opsi animasi tirai sudah ditiadakan.

## T7-REV7 — Menghilangkan Tab Angka & Menampilkan 10 Kotak Tabel Lengkap Langsung — 2026-11-24
- **Dibuat/diubah:**
  1. `index.html`:
     - Menghilangkan bilah tab pemilih angka (`#tab-angka-kali` dan `#tab-angka-bagi`) pada layar Tabel Perkalian (`#layar-belajar-kali`) dan Tabel Pembagian (`#layar-belajar-bagi`).
  2. `js/belajar.js`:
     - Menghilangkan pembuatan tombol-tombol tab (`×1` s.d. `×10` dan `÷1` s.d. `÷10`).
     - Seluruh 10 kotak tabel perkalian dan pembagian kini langsung dibangun dan ditampilkan apa adanya secara bersamaan.
  3. `css/style.css`:
     - Mengatur `.bilah-tab-angka` menjadi `display: none`.
     - Memperluas area `.grid-sepuluh-tabel` (`max-height: 570px` dan `width: 1240px`) sehingga 10 tabel tersusun rapi dalam 2 baris × 5 kolom dengan ruang pandang yang lebih lega.
- **Verifikasi:**
  - `node tools/cek-aset.mjs`: lolos validasi (89/89 gambar ada, 2/3 font ada, 38 soal valid).
  - `node tools/uji-generator.mjs`: lolos validasi (54.000 kombinasi soal valid).
  - `node --check js/belajar.js`: lolos cek sintaks tanpa galat.
- **Perlu dicek pengguna di peramban:**
  - Buka/segarkan `index.html`:
    1. Masuk ke **Ruang Belajar** -> **Tabel Perkalian Dasar**:
       - Tidak ada lagi tab `×1`, `×2`, dst. di atas.
       - Seluruh 10 tabel perkalian (Tabel 1 s.d. 10) langsung tampil lengkap dan utuh.
    2. Masuk ke **Ruang Belajar** -> **Tabel Pembagian Dasar**:
       - Tidak ada lagi tab `÷1`, `÷2`, dst. di atas.
       - Seluruh 10 tabel pembagian (Bagi 1 s.d. 10) langsung tampil lengkap dan utuh.

## T7-REV6 — Font LilitaOne & Warna Hijau Judul Layar serta Perbesaran Latar Tombol Start — 2026-11-24
- **Dibuat/diubah:**
  1. `css/fonts.css` & `assets/manifest.js`:
     - Menambahkan deklarasi `@font-face LilitaOne` mengarah ke `../assets/fonts/LilitaOne.ttf`.
     - Mendaftarkan `assets/fonts/LilitaOne.ttf` ke `font.lilita` pada `manifest.js` (versi dinaikkan ke 9).
  2. `css/style.css`:
     - Mengubah `.judul-layar` agar menggunakan font `LilitaOne` dan warna `#2b512f` (hijau tua pekat) dengan bayangan halus.
     - Memperbesar tampilan latar belakang gambar `tombol-start.webp` pada `.tombol-start` (`background-size: 140% auto` pada ukuran wadah `380px × 130px`) sehingga grafis kapsul hijau melebar sempurna dan teks "MULAI" tidak lagi melebihi batas gambar.
- **Verifikasi:**
  - `node tools/cek-aset.mjs`: lolos validasi (89/89 gambar ada, 2/3 font ada, 38 soal valid).
  - `node tools/uji-generator.mjs`: lolos validasi (54.000 kombinasi soal valid).
- **Perlu dicek pengguna di peramban:**
  - Buka/segarkan `index.html`:
    1. Pada layar awal (bumper), periksa tombol "MULAI": grafis kapsul hijau kini tampil lebih besar dan proporsional membungkus teks "MULAI" tanpa ada teks yang keluar dari gambar.
    2. Masuk ke halaman lain (Panduan, Ruang Belajar, dll.): periksa judul layar utama kini tampil dengan font tebal ceria `LilitaOne` dan berwarna hijau `#2b512f`.

## T7-REV5 — Tombol Kembali Ikon Murni, Judul Layar Putih, & Background Tombol Start WebP — 2026-11-24
- **Dibuat/diubah:**
  1. `index.html`:
     - Mengubah tombol navigasi kembali `#btn-kembali` menjadi tombol ikon murni (`class="tombol-ikon tombol-kembali-trigger"`), menghapus teks label "Kembali" dan wadah kotak tombol.
  2. `css/style.css`:
     - Menambahkan styling `.tombol-kembali-trigger` dan `#ikon-wadah-kembali` tanpa wadah/background/border dengan ukuran proporsional 58px dan efek hover lembut.
     - Mengubah warna font `.judul-layar` menjadi putih (`#FFFFFF`) dengan bayangan teks lembut agar kontras dan terbaca jelas di berbagai latar belakang layar.
     - Mengubah background `.tombol-start` menjadi gambar `img/ui/tombol-start.webp` (kapsul hijau dengan efek pantulan/highlight) dan menyesuaikan dimensi tombol (360px × 120px) serta animasi denyut (*pulse*) berbasis `drop-shadow`.
- **Verifikasi:**
  - `node tools/cek-aset.mjs`: lolos validasi (89/89 gambar ada, 38 soal valid).
  - `node tools/uji-generator.mjs`: lolos validasi (54.000 kombinasi soal valid).
- **Perlu dicek pengguna di peramban:**
  - Buka/segarkan `index.html`:
    1. Pada layar awal (bumper), tombol "MULAI" kini menggunakan grafis kapsul hijau dari `tombol-start.webp` dengan teks "MULAI" presisi di tengah dan efek denyut lembut.
    2. Masuk ke layar dalam (Panduan, Ruang Belajar, dll.): tombol "Kembali" di pojok kiri atas kini tampil bersih hanya berupa gambar ikon panah tanpa kotak wadah maupun teks.
    3. Judul setiap layar (`.judul-layar`) kini berwarna putih bersih dengan bayangan yang jelas dan kontras.

## T7-REV4 — Teks Judul Bumper & Animasi Bumper — 2026-11-20
- **Dibuat/diubah:**
  1. `css/fonts.css`:
     - Memperbarui deklarasi `@font-face JudulJawa` agar mengarah ke `../assets/fonts/judul.woff2`.
  2. `index.html` & `js/app.js`:
     - Mengubah isi wadah `#wadah-bumper-logo` dari gambar logo placeholder menjadi elemen teks judul `<h1 class="bumper-judul-teks">Ayo Belajar Matematika</h1>`.
     - Menghapus injeksi gambar `ui.logo` di `js/app.js`.
  3. `css/style.css`:
     - Menambahkan styling `.bumper-judul-teks`: ukuran 76px menggunakan font `assets/fonts/judul.woff2` (`JudulJawa`), warna soga dengan outline kuning dan bayangan elegan.
     - Menambahkan animasi masuk dan floating pada judul (`judul-masuk` dan `judul-mengapung`).
     - Menambahkan animasi mengapung dan bergoyang pada trio makanan tradisional Jawa (klepon berayun, getuk membal, cenil berayun) dengan jeda waktu alami, serta efek interaksi saat disentuh/hover.
     - Menambahkan animasi denyut lembut (*pulse*) pada tombol `MULAI` (`.tombol-start`).
     - Merapikan tata letak `#layar-bumper` agar terpusat sempurna secara vertikal dan horizontal.
- **Verifikasi:**
  - `node tools/cek-aset.mjs`: lolos validasi (89/89 gambar ada, 38 soal valid).
  - `node tools/uji-generator.mjs`: lolos validasi (54.000 kombinasi soal valid).
  - `node --check js/app.js`: lolos cek sintaks tanpa galat.
- **Perlu dicek pengguna di peramban:**
  - Buka/segarkan `index.html` di peramban.
  - Perhatikan layar pembuka (bumper):
    1. Judul tampil berupa teks tipografi "Ayo Belajar Matematika" menggunakan font `judul.woff2`.
    2. Judul muncul dengan animasi halus lalu mengapung santai.
    3. Tiga ikon jajan tradisional (klepon, getuk, cenil) bergoyang dan mengapung secara dinamis serta membesar saat disentuh/di-hover kursor.
    4. Tombol "MULAI" berdenyut lembut menarik perhatian untuk diklik.

## T7-REV3 — Ikon WebP Hamburger & Tombol Tutup Pojok Kanan Atas — 2026-11-20
- **Dibuat/diubah:**
  1. `assets/manifest.js`:
     - Mendaftarkan entri ikon menu hamburger `ui.ikon-humberger` dan `ui.ikon-hamburger` mengarah ke berkas WebP `ui/ikon-humberger.webp`.
     - Mendaftarkan entri ikon tutup `ui.ikon-close` dan `ui.ikon-tutup` mengarah ke berkas WebP `ui/ikon-close.webp`.
     - Menaikkan versi manifest ke 8 (`versi: 8`).
  2. `index.html`:
     - Memperbarui tombol trigger `#btn-hamburger`: menghilangkan teks/label dan wadah tombol persegi, menyisakan wadah gambar `#ikon-wadah-hamburger` dengan kelas `.tombol-ikon`.
     - Menempatkan tombol tutup khusus `#btn-tutup-hamburger` dengan kelas `.tombol-close-hamburger` di dalam kontainer `.panel-hamburger-drawer`.
  3. `js/menu-hamburger.js`:
     - Memasukkan ikon `ui.ikon-humberger` ke `#ikon-wadah-hamburger` dan `ui.ikon-close` ke `#ikon-wadah-tutup-hamburger`.
     - Menghubungkan tombol keluar `#btn-hb-keluar` ke modal konfirmasi keluar.
  4. `css/style.css`:
     - Menghilangkan wadah (latar cokelat, garis tepi, bayangan, padding) pada `.tombol-hamburger-trigger`, menjadikannya tombol ikon transparan tanpa wadah dengan ukuran ikon proporsional 58px dan efek hover yang lembut.
     - Menambahkan `position: relative` pada `.panel-hamburger-drawer`.
     - Mengatur penempatan tombol tutup `.tombol-close-hamburger` di pojok kanan atas drawer (`position: absolute; top: 16px; right: 18px;`) dengan ukuran target min. 48 px (`52px × 52px`), ikon 44 px, transisi hover/active interaktif.
     - Mengatur padding atas `.panel-hamburger-body` menjadi `68px 24px 24px 24px` agar susunan menu rapi dan tidak tumpang tindih dengan tombol tutup.
- **Verifikasi:**
  - `node tools/cek-aset.mjs`: lolos validasi (89/89 gambar ada, 38 soal valid).
  - `node tools/uji-generator.mjs`: lolos validasi (54.000 kombinasi soal valid).
  - `node --check js/menu-hamburger.js`: lolos cek sintaks tanpa galat.
- **Perlu dicek pengguna di peramban:**
  - Buka atau segarkan (refresh) `index.html` di peramban.
  - Periksa bilah navigasi atas: tombol menu kini murni berupa ikon `ikon-humberger.webp` tanpa latar belakang wadah/kotak dan tanpa teks label.
  - Klik tombol Menu: panel drawer meluncur terbuka dan di pojok kanan atas drawer terdapat tombol silang tutup dengan ikon `ikon-close.webp`.
  - Klik tombol silang tutup atau klik area gelap luar atau tekan tombol `Esc` untuk menutup drawer.
- **Paket/alat tambahan (jika ada) + alasan:** -
- **Catatan/penyimpangan dari docs:** -

## T7-REV2 — Penyederhanaan Setup Tebak Jajan & Kehalusan Drawer Hamburger — 2026-11-20
- **Dibuat/diubah:**
  1. `index.html` & `js/game.js`:
     - Menyederhanakan layar setup Tebak Jajan (`#layar-main-cara`): menghilangkan pilihan cara main (Sendiri/Tim) dan pilihan operasi (Perkalian/Pembagian/Campuran).
     - Pengaturan kini **hanya** menampilkan pemilihan tingkat kesulitan: **Level 1**, **Level 2**, dan **Level 3**.
     - Di `js/game.js`, mode bermain otomatis diatur ke "sendiri" dengan kumpulan soal campuran fakta dasar sesuai level yang dipilih.
  2. `css/style.css` & `js/menu-hamburger.js`:
     - Memperhalus animasi panel hamburger dengan kurva akselerasi `cubic-bezier(0.05, 0.9, 0.2, 1)`, durasi transisi 0.45s, serta translasi perangkat keras `translate3d(100%, 0, 0)` dan `will-change: transform`.
     - Ditambahkan reflow eksplisit `void panelModal.offsetWidth` di JavaScript sebelum penambahan kelas `.terbuka` untuk memastikan transisi CSS selalu terpicu tanpa patah-patah/frame drop.
- **Verifikasi:**
  - `node -c js/*.js`: seluruh berkas lolos uji kompilasi tanpa galat.
  - `node tools/cek-aset.mjs`: lolos validasi (86/86 gambar ada, 38 soal valid).
  - `node tools/uji-generator.mjs`: lolos validasi (54.000 kombinasi soal generator valid).
- **Perlu dicek pengguna di peramban:**
  - Buka/muat ulang `index.html`:
    1. Masuk ke **Ruang Bermain** -> **Tebak Jajan**:
       - Periksa bahwa sekarang hanya tampil pilihan **Level 1**, **Level 2**, dan **Level 3**, lalu tombol **Mulai Tebak Jajan**.
       - Tidak ada lagi pilihan tim maupun pilihan perkalian/pembagian.
    2. Klik tombol **"☰ Menu"**:
       - Amati luncuran drawer menu dari kanan dan kemunculan backdrop gelap yang kini meluncur jauh lebih halus, elegan, dan bebas dari patah-patah.

## T7-REV — Perubahan & Perbaikan UI/UX (Animasi, Suara, Ikon, Alur, Skala) — 2026-11-20
- **Dibuat/diubah:**
  1. `js/guru.js` & `js/layar.js`:
     - Menonaktifkan animasi tirai secara default (`animasiTirai: false`), sehingga perpindahan antar layar langsung instan tanpa menunggu tirai.
  2. `css/style.css` & `js/menu-hamburger.js`:
     - Memperhalus kemunculan drawer panel hamburger menggunakan kurva transisi `cubic-bezier(0.22, 1, 0.36, 1)` untuk sliding drawer dan backdrop fade-in/fade-out yang halus.
  3. `js/app.js` & `js/menu-hamburger.js`:
     - Tombol speaker pojok kanan atas diubah perilakunya murni sebagai tombol *bisu cepat (mute / unmute toggle)* tanpa memunculkan dialog/modal pengaturan suara.
     - Modal Pengaturan Suara rinci (Musik, SFX, Narasi) kini **hanya** muncul saat diakses melalui item "Suara" di dalam menu hamburger.
  4. `assets/manifest.js` & `js/menu-hamburger.js` & `assets/img/ui/ikon-tujuan.svg`:
     - Membedakan ikon Tujuan Pembelajaran dan Panduan Aplikasi:
       - Tujuan Pembelajaran memakai aset SVG baru `ui.ikon-tujuan` (motif target sasaran dengan anak panah khas Jawa).
       - Panduan Aplikasi tetap memakai `ui.ikon-bantuan`.
  5. `js/app.js`:
     - Meniadakan alur jendela pemilihan nama dan karakter (`layar-nama`).
     - Alur onboarding disederhanakan: Bumper -> Panduan -> Tujuan Pembelajaran -> langsung masuk ke Menu Utama (tombol aksi pada Tujuan Pembelajaran bertuliskan "Mulai Belajar").
  6. `css/style.css` & `js/layar.js`:
     - Memperbaiki penskalaan panggung responsif: menambahkan basis `transform: translate(-50%, -50%)` pada CSS `#panggung` dan mengaktifkan penyesuaian skala otomatis saat `DOMContentLoaded` serta saat event `orientationchange` pada gawai layar sentuh/proyektor.
- **Verifikasi:**
  - `node -c js/*.js`: seluruh berkas lolos uji kompilasi tanpa galat.
  - `node tools/cek-aset.mjs`: lolos validasi (86/86 gambar ada, 38 soal valid).
  - `node tools/uji-generator.mjs`: lolos validasi (54.000 kombinasi soal valid).
  - `node tools/cek-aset.mjs --daftar`: berkas `docs/DAFTAR-ASET.md` terbarui.
- **Perlu dicek pengguna di peramban:**
  - Muat ulang (`Ctrl + F5`) `index.html` di peramban:
    1. Klik tombol MULAI -> Panduan -> Lanjut -> Tujuan Pembelajaran -> Klik "Mulai Belajar" -> langsung masuk ke Menu Utama (tanpa layar nama/karakter).
    2. Coba klik tombol speaker di luar: sekarang langsung mute/unmute suara tanpa memunculkan modal dialog.
    3. Klik tombol "☰ Menu": perhatikan animasi drawer yang meluncur sangat halus.
    4. Periksa ikon "Tujuan Pembelajaran" (ikon target panahan) dan "Panduan Aplikasi" (ikon buku panduan) di dalam hamburger yang kini sudah berbeda.
    5. Klik menu "Suara" di hamburger: modal pengaturan rinci terbuka dengan rapi.
    6. Ubah ukuran jendela peramban (resize / zoom): perhatikan panggung tetap presisi di tengah dan berskala responsif.
- **Paket/alat tambahan (jika ada) + alasan:** -
- **Catatan/penyimpangan dari docs:** -

## T7 — Poles dan QA (Quality Assurance) — 2026-11-19
- **Dibuat/diubah:**
  - `index.html`:
    - Menambahkan elemen `#wadah-tirai` dengan sub-elemen `#tirai-kiri` dan `#tirai-kanan` untuk animasi transisi layar bertema tirai budaya Jawa.
    - Menambahkan opsi checkbox `#peng-animasi-tirai` ("Aktifkan Animasi Transisi Tirai Layar") pada tab Pengaturan di Panel Akses Guru.
  - `js/layar.js`:
    - Mengintegrasikan logika animasi transisi tirai saat berpindah layar menggunakan CSS class `.menutup` dan `.membuka`.
    - Animasi transisi otomatis membaca preferensi `abm.pengaturan.animasiTirai` dari `localStorage` (dapat dimatikan bila guru menginginkan perpindahan instan).
  - `js/guru.js`:
    - Memasukkan preferensi `animasiTirai` ke dalam penyimpanan `abm.pengaturan` (default: `true`).
    - Menghubungkan form checkbox pengaturan guru untuk membaca dan menyimpan opsi transisi tirai.
  - `js/app.js`:
    - Memasang aset gambar statis `ornamen.tirai-kiri` dan `ornamen.tirai-kanan` ke wadah tirai saat inisialisasi.
  - `css/style.css`:
    - Menambahkan styling transisi tirai `.wadah-tirai-transisi`, `.tirai-sisi`, `.tirai-kiri`, `.tirai-kanan`, serta animasi gerak slide berbasis bezier curve.
  - `docs/UJI-FUNGSI.md`:
    - Membuat berkas dokumentasi checklist uji fungsi lengkap (Tabel 3.8 black-box testing) untuk seluruh fitur FR-01 s.d. FR-22, aspek CTML, anti-klik ganda, aksesibilitas, dan lingkungan luring.
  - `docs/DAFTAR-ASET.md`:
    - Memperbarui daftar seluruh aset resmi melalui perintah `node tools/cek-aset.mjs --daftar`.
- **Verifikasi:**
  - `node -c js/*.js`: seluruh berkas JavaScript lolos uji kompilasi tanpa galat sintaks.
  - `node tools/cek-aset.mjs`: lolos validasi (85/85 gambar ada, 38 soal valid).
  - `node tools/uji-generator.mjs`: lolos validasi (54.000 kombinasi soal generator valid).
  - `node tools/cek-aset.mjs --daftar`: berkas `docs/DAFTAR-ASET.md` ter-generate otomatis dengan rapi.
- **Perlu dicek pengguna di peramban:**
  - Buka/muat ulang `index.html` di peramban:
    1. Coba berpindah antar layar (misal dari Menu ke Ruang Belajar atau Ruang Bermain): perhatikan tirai transisi budaya Jawa yang menutup dan membuka halus.
    2. Masuk ke Akses Guru (PIN: `1234`) -> Tab **Pengaturan**:
       - Nonaktifkan checkbox "Aktifkan Animasi Transisi Tirai Layar" -> klik "Simpan Pengaturan".
       - Coba berpindah layar lagi -> transisi layar berganti seketika tanpa tirai.
    3. Coba tes anti-klik ganda pada tombol pilihan kuis Tebak Jajan: tombol terkunci saat dinilai sehingga aman dari klik ganda cepat.
    4. Periksa kecocokan tampilan pada resolusi layar/proyektor 1366×768.
- **Paket/alat tambahan (jika ada) + alasan:** -
- **Catatan/penyimpangan dari docs:** Selesai penuh sesuai seluruh kriteria TASKS.md dan PRD.

## T1-HB — Implementasi Menu Utama 2 Kartu & Panel Hamburger Drawer — 2026-11-16
- **Dibuat/diubah:**
  - `index.html`:
    - Mengubah struktur `#layar-menu` menjadi 2 kartu besar utama: `#menu-btn-belajar` (Ruang Belajar) dan `#menu-btn-main` (Ruang Bermain).
    - Memindahkan tombol Tujuan, Panduan, Akses Guru, Profil, Suara, dan Keluar dari panggung utama ke dalam panel drawer `#panel-hamburger`.
    - Menambahkan tombol pemicu `#btn-hamburger` ("☰ Menu") di bilah kontrol atas bersebelahan dengan speaker.
    - Menambahkan struktur drawer overlay `#panel-hamburger` dengan 2 kelompok (Bantuan & Pengaturan) serta footer terpisah untuk "Kembali ke awal".
    - Mendaftarkan skrip `js/menu-hamburger.js` pada urutan muat sebelum `js/belajar.js`.
  - `js/menu-hamburger.js`:
    - Modul kontrol drawer menu hamburger dengan fungsi buka/tutup, overlay backdrop, penutupan via tombol Esc, tombol X, maupun klik area luar.
    - Manajemen fokus keyboard (fokus berpindah ke tombol tutup saat terbuka dan kembali ke tombol hamburger saat tertutup).
    - Menghubungkan visibilitas hamburger hanya pada layar `menu` dan `belajar` (tersembunyi di layar game dan onboarding).
    - Memasang event listener untuk masing-masing item menu ke router `Layar.tampil()` dan modal konfirmasi reset.
  - `js/app.js`:
    - Mengaitkan 2 kartu menu utama ke layar `belajar` dan `main`.
    - Menghilangkan referensi listener 6 tombol lama dan tombol keluar langsung di menu utama.
    - Menginjeksi aset ikon pada kedua kartu menu utama.
  - `css/style.css`:
    - Menambahkan gaya tata letak `.menu-grid-dua-kartu` dan `.tombol-kartu-utama` (ukuran besar, hover efek responsif, teks judul & subjudul proporsional).
    - Menambahkan styling panel drawer `.panel-hamburger-overlay`, `.panel-hamburger-drawer`, animasi slide & fade, tombol pemicu `.tombol-hamburger-trigger`, kelompok label, item menu drawer dengan ikon, serta footer tombol aksi bahaya (Kembali ke awal).
- **Verifikasi:**
  - `node -c js/*.js`: seluruh berkas lolos kompilasi sintaks Node.js tanpa galat.
  - `node tools/cek-aset.mjs`: lolos validasi (85/85 gambar terdaftar, 38 soal valid).
  - `node tools/uji-generator.mjs`: lolos validasi (54.000 kombinasi soal generator valid).
- **Perlu dicek pengguna di peramban:**
  - Buka/muat ulang `index.html` di peramban setelah melewati onboarding:
    1. Pastikan di Layar Menu Utama kini hanya tampil **2 kartu besar**: **Ruang Belajar** dan **Ruang Bermain**.
    2. Perhatikan pojok kanan atas: terdapat tombol **☰ Menu** di sebelah tombol speaker.
    3. Klik tombol **☰ Menu**: panel drawer akan meluncur dari sisi kanan dengan rapi berisi kelompok Bantuan, Pengaturan, dan Kembali ke awal.
    4. Coba tutup panel dengan menekan tombol **X**, mengeklik area gelap di luar panel, atau menekan tombol **Esc** pada keyboard.
    5. Klik salah satu item (misal *Panduan Aplikasi* atau *Tujuan Pembelajaran*): halaman akan terbuka dan tombol kembali mengarahkan kembali ke Menu Utama.
    6. Masuk ke *Ruang Bermain* -> *Tebak Jajan* atau *Balap Becak*: pastikan tombol hamburger otomatis tersembunyi agar tidak mengganggu jalannya permainan.
- **Paket/alat tambahan (jika ada) + alasan:** -
- **Catatan/penyimpangan dari docs:** Sesuai dengan spesifikasi final di `docs/ALUR.md`.

## T-DOC — Perbaruan Dokumen: Menu Utama Hamburger (2 Kartu + Drawer Menu) — 2026-11-16
- **Dibuat/diubah:**
  - `docs/ALUR.md`:
    - Mengubah diagram teks dan alur menu utama dari 6 tombol menjadi 2 kartu besar (Ruang Belajar dan Ruang Bermain) + tombol "☰ Menu" (hamburger).
    - Menambahkan aturan detail komponen panel drawer hamburger (Bantuan: Tujuan, Panduan; Pengaturan: Suara rinci, Akses Guru, Profil; Bagian Bawah: Kembali ke awal dengan konfirmasi).
    - Menetapkan aturan buka/tutup: tombol X, klik backdrop luar, tombol Esc, dan manajemen fokus keyboard.
    - Menetapkan aturan visibilitas: hamburger aktif hanya di layar menu dan Ruang Belajar; tidak tampil di layar game (Tebak Jajan & Balap Becak).
    - Memperbarui catatan untuk dokumen penelitian (storyboard 2 dan Gambar 3.1 direvisi).
  - `docs/PRD.md`:
    - Memperbarui FR-03 menjadi menu utama 2 kartu + tombol hamburger.
    - Menyesuaikan FR-04, FR-05 (speaker global mandiri di luar hamburger untuk mute cepat, pengaturan rinci di hamburger), dan FR-14 (layar game bebas distraksi hamburger).
    - Menambahkan komponen global `panel-hamburger` pada §6 (Layar dan Komponen).
  - `docs/ARCHITECTURE.md`:
    - Menambahkan modul `js/menu-hamburger.js` ke daftar file dan urutan muat `index.html`.
    - Menambahkan dokumentasi spesifikasi komponen menu hamburger (aksesibilitas, jebakan fokus, aturan Esc, dan overlay).
  - `docs/TASKS.md`:
    - Menyesuaikan T0 dan T1: T0 menyiapkan kontainer `#panel-hamburger`, T1 mengimplementasikan menu 2 kartu + fungsionalitas panel drawer hamburger.
    - Menyesuaikan pengujian kriteria "selesai bila".
  - `assets/manifest.js`:
    - Mendaftarkan 8 kunci aset baru: `ui.ikon-hamburger`, `ui.ikon-tutup`, `ui.panel-menu`, `ui.ikon-bantuan`, `ui.ikon-pengaturan`, `ui.ikon-profil`, `ui.ikon-gembok`, `ui.ikon-rumah`.
    - Dijalankan `node tools/cek-aset.mjs --placeholder` untuk menghasilkan 8 file SVG placeholder secara aman tanpa menimpa aset pengguna.
- **Verifikasi:**
  - `node tools/cek-aset.mjs`: lolos validasi (85/85 gambar ada, 38 soal valid).
  - `node tools/uji-generator.mjs`: lolos validasi (54.000 kombinasi soal valid).
- **Perlu dicek pengguna di peramban:**
  - Tidak ada (tahap ini murni pembaruan dokumentasi spesifikasi dan registrasi placeholder aset).
- **Paket/alat tambahan (jika ada) + alasan:** -
- **Catatan/penyimpangan dari docs:**
  - Konflik PRD lama (FR-03: menu 6 tombol) diselesaikan dan digantikan dengan keputusan desain baru di `docs/ALUR.md`: 2 kartu besar + 1 tombol drawer hamburger.
  - Sesuai instruksi batasan, tidak ada penulisan kode logika aplikasi (`js/` aplikasi belum diubah).

## T6 — Audio dan narasi (FR-05, 17) — 2026-11-13
- **Dibuat/diubah:**
  - `js/aset.js`:
    - Mengintegrasikan persistensi pengaturan status suara (`musik`, `sfx`, `narasi`) ke `localStorage["abm.suara"]` sehingga pilihan preferensi audio tersimpan antar sesi.
    - Menjamin pemutaran aman (fallback diam tanpa galat konsol/crash) jika berkas audio belum ada di folder `assets/audio/` lewat mekanisme penanganan `.catch()` dan listener event error audio.
    - Menghubungkan fungsi `Aset.atur(jenis, nilai)` agar otomatis menghentikan atau melanjutkan pemutaran `musik.latar` secara dinamis saat toggle musik dinyalakan atau dimatikan.
    - Fungsi `Aset.narasi(idSoal)` memanggil berkas narasi per soal `assets/audio/narasi/<ID>.mp3` sesuai status `Aset.suara.narasi`.
  - `js/app.js`:
    - Menghubungkan pemutaran otomatis `musik.latar` ketika berpindah layar setelah Bumper (misal ke Panduan, Menu Utama, Ruang Belajar, atau Ruang Bermain) dan menghentikannya saat kembali ke Bumper (memutar `musik.bumper`).
    - Memperbarui sinkronisasi status modal pengaturan speaker global (`#modal-suara`) dengan tombol toggle Musik, SFX, dan Narasi yang terpisah.
  - `js/game.js`:
    - Mengaitkan tombol narasi soal `#btn-kuis-dengar` di bilah info kuis Tebak Jajan untuk memanggil `Aset.narasi(soalAktif.id)`.
    - Mengaktifkan pemutaran SFX di seluruh aksi kuis dan balapan: `sfx.klik` pada interaksi tombol, `sfx.benar` pada jawaban benar / PIN tepat / maju petak, `sfx.salah` pada jawaban salah / PIN keliru, dan `sfx.menang` pada layar hasil akhir.
- **Verifikasi:**
  - `node --check js/*.js`: seluruh berkas lolos uji sintaks tanpa galat.
  - `node tools/cek-aset.mjs && node tools/uji-generator.mjs`: lolos validasi (77 gambar ada, status ketiadaan 6 audio ditangani dengan aman tanpa crash, 38 soal valid, 54.000 kombinasi generator lolos).
- **Perlu dicek pengguna di peramban:**
  - Buka/muat ulang `index.html` di peramban.
  - Klik tombol speaker di pojok kanan atas -> pastikan modal "Pengaturan Suara" terbuka dengan 3 tombol toggle: Musik Latar, Efek Suara (SFX), dan Narasi Suara.
  - Coba matikan salah satu toggle (misal: Musik OFF) -> status tombol berubah menjadi OFF (warna abu-abu) dan preferensi tersimpan di peramban. Jika semua suara dimatikan, ikon speaker di bilah navigasi berubah menjadi ikon speaker mati (`ui.ikon-speaker-off`).
  - Masuk ke Ruang Bermain -> Tebak Jajan:
    - Klik tombol "Dengarkan Narasi Soal" (ikon telinga di sebelah tombol aturan) -> pastikan fungsi terpanggil dan peramban tetap stabil tanpa error meskipun berkas `.mp3` narasi belum diletakkan di `assets/audio/narasi/`.
  - Mainkan kuis atau balap becak -> pastikan tidak ada error audio yang memblokir alur permainan.
- **Paket/alat tambahan (jika ada) + alasan:** -
- **Catatan/penyimpangan dari docs:** -

## T5 — Skor dan Akses Guru (FR-15, 16) — 2026-11-12
- **Dibuat/diubah:**
  - `js/skor.js`: mengimplementasikan modul penyimpanan riwayat skor `abm.skor` di `localStorage` (maksimal 100 entri terbaru), utilitas pencatatan sesi permainan (`simpanRiwayat`), pembersihan riwayat (`bersihkanRiwayat`), dan fitur ekspor riwayat sesi ke CSV dengan UTF-8 BOM dan pengunduhan berbasis `Blob` + elemen link.
  - `js/guru.js`: mengimplementasikan logika PIN autentikasi 4 digit (default `1234`), penggabungan bank soal bawaan dengan penimpaan guru (`abm.soalGuru`: tambah, ubah, hapus), antarmuka formulir modal editor soal (tambah & edit), reset bank soal ke bawaan, ekspor bank soal ke JSON, impor bank soal dari JSON via `FileReader`, penampilan tabel riwayat skor siswa, serta pengelolaan pengaturan aplikasi (`abm.pengaturan`: PIN, panjang lintasan balap, batas waktu ronde, dan lewati onboarding).
  - `index.html`:
    - Membangun `layar-guru-pin` dengan visual display 4 digit bullet (`○ ○ ○ ○` / `● ● ● ●`), pesan kesalahan jika PIN keliru, dan keypad numerik layar sentuh 3x4 (angka 0–9, tombol Batal, dan tombol Hapus ⌫).
    - Membangun `layar-guru` lengkap dengan 3 tab navigasi: **Daftar Soal** (tabel soal, filter operasi, tambah/edit/hapus, ekspor/impor JSON, reset bawaan), **Riwayat Skor** (tabel sesi skor siswa, tombol ekspor CSV, tombol bersihkan riwayat), dan **Pengaturan** (form ubah PIN 4 digit, pilihan panjang lintasan balap becak 8/10/12, batas waktu ronde 10/15/20/0, checkbox lewati onboarding, tombol simpan).
    - Menambahkan modal dialog `#modal-editor-soal` untuk input dan pengeditan detail soal (operasi, level, teks soal, operan a & b, kunci jawaban, pilihan, aset visual budaya, petunjuk, dan penjelasan).
  - `css/style.css`: menambahkan styling lengkap keypad PIN (grid 3 kolom, tombol min 48px), panel guru berbilah tab, tabel data responsif dengan scroll vertikal mandiri (`.guru-tabel-wrapper`), tombol aksi mini (edit & hapus), form grup pengaturan, serta modal editor soal berbasis grid 2 kolom.
  - `js/app.js`: mengarahkan klik tombol menu "Akses Guru" dari Menu Utama ke `layar-guru-pin` agar terproteksi oleh verifikasi PIN terlebih dahulu sebelum membuka panel guru; serta menghubungkan pengaturan `lewatiOnboarding`.
- **Verifikasi:**
  - `node --check js/skor.js && node --check js/guru.js && node --check js/app.js && node --check js/game.js`: lolos tanpa galat sintaks.
  - `node tools/cek-aset.mjs && node tools/uji-generator.mjs`: lolos validasi (77 gambar ada, 38 soal valid, 54.000 kombinasi soal generator valid).
- **Perlu dicek pengguna di peramban:**
  - Buka/muat ulang `index.html` di peramban.
  - Di **Menu Utama**, klik tombol **Akses Guru**:
    - Pastikan muncul layar masukan PIN dengan keypad numerik.
    - Coba masukkan PIN sembarang selain `1234` -> muncul pesan "PIN salah! Coba lagi." dan bunyi SFX salah.
    - Masukkan PIN bawaan `1234` -> bunyi SFX benar dan langsung masuk ke **Panel Akses Guru**.
  - **Uji Tab Daftar Soal**:
    - Periksa daftar 38 soal bawaan tampil di tabel.
    - Coba filter operasi (Perkalian / Pembagian / Semua).
    - Klik **+ Tambah Soal** -> modal editor terbuka -> isi form dan simpan -> soal baru muncul di tabel dengan label status "Baru".
    - Klik **Edit** pada salah satu soal -> ubah teks atau kunci -> simpan -> status berubah menjadi "Diedit".
    - Klik **Ekspor JSON** -> peramban akan mengunduh berkas `.json` berisi bank soal.
    - Coba **Hapus** soal atau klik **Reset Bawaan** untuk mengembalikan soal ke kondisi semula.
  - **Uji Tab Riwayat Skor**:
    - Mainkan kuis Tebak Jajan atau Balap Becak terlebih dahulu.
    - Buka tab Riwayat Skor di panel guru -> data sesi pemain, topik, skor, dan durasi akan tercatat.
    - Klik **Ekspor CSV** -> periksa berkas CSV terunduh dan dapat dibuka di Microsoft Excel / Notepad dengan format rapi.
  - **Uji Tab Pengaturan**:
    - Ubah PIN (misal: 4321), panjang lintasan, atau waktu ronde balap becak.
    - Klik **Simpan Pengaturan** -> verifikasi pengaturan tersimpan.
    - Keluar ke Menu Utama, lalu masuk lagi ke Akses Guru untuk memastikan PIN baru bekerja.
- **Paket/alat tambahan (jika ada) + alasan:** -
- **Catatan/penyimpangan dari docs:**
  - Sesuai permintaan pengguna, opsi pemilihan operasi (kali/bagi/campur) dan pemilihan tabel (1–10) di Balap Becak ditiadakan dari layar setup. Balap Becak langsung melatih seluruh fakta dasar perkalian dan pembagian 1–10 secara acak dan seimbang, sehingga setup menjadi ringkas (hanya input nama kedua pemain).

## T4 — Mode tim dan giliran (FR-09, 18) — 2026-11-12
- **Dibuat/diubah:**
  - `index.html`: memperbarui `layar-main` dengan pengaturan interaktif pemilihan jumlah tim (2, 3, atau 4 tim) beserta formulir masukan nama masing-masing tim; mengimplementasikan struktur lengkap `layar-main-tim` yang terdiri dari papan skor tim interaktif, penanda giliran tim aktif, kartu soal bergambar & simbol berukuran besar (misal: 4 × 2 atau 12 : 3), 2–3 tombol pilihan jawaban mode tim, dan banner umpan balik pergantian giliran tim.
  - `css/style.css`: menambahkan styling papan skor tim horizontal yang menyorot tim yang sedang giliran menjawab (`.giliran-aktif`), kartu skor dengan nama tim dan perolehan poin tim, kotak input nama tim, serta tata letak 2–3 pilihan jawaban mode tim yang lapang dan mudah diklik di proyektor.
  - `js/game.js`: mengintegrasikan logika Mode Tim ke dalam mesin permainan: pengambilan soal mode `"tim"` dari bank soal, perputaran giliran antar tim secara berurutan (`(giliran + 1) % jumlahTim`), penambahan 1 poin untuk tim yang menjawab benar, evaluasi jawaban tim dengan umpan balik visual dan audio, serta penentuan pemenang di `layar-hasil` dengan penanganan kondisi "Seri" jika terdapat skor tertinggi yang sama di antara beberapa tim.
- **Verifikasi:**
  - `node --check js/*.js`: seluruh berkas lolos validasi sintaks tanpa galat.
  - `node tools/cek-aset.mjs`: lolos validasi (66 gambar ada, 38 soal valid).
- **Perlu dicek pengguna di peramban:**
  - Buka/muat ulang `index.html` di peramban.
  - Masuk ke menu **"Ruang Bermain"** -> pilih **Mode Tim**.
  - Pilih jumlah tim (misal: 3 Tim) dan ubah nama tim pada kotak yang tersedia (misal: "Tim Harimau", "Tim Garuda", "Tim Elang").
  - Klik **Mulai Bermain** -> periksa tampilan papan skor di bagian atas dan pastikan kartu tim yang sedang mendapat giliran memiliki penanda/sorotan aktif.
  - Jawab soal: tim yang menjawab benar akan mendapat 1 poin dan papan skor langsung terbarui secara realtime.
  - Klik tombol **Giliran Berikutnya** -> periksa giliran berpindah ke tim selanjutnya.
  - Selesaikan sesi 10 soal -> periksa **Layar Hasil**:
    - Jika ada tim dengan skor tertinggi tunggal: muncul "Selamat, [Nama Tim] Menang!".
    - Jika ada lebih dari satu tim dengan skor tertinggi yang sama: muncul "Hasil Seri! ([Tim A] & [Tim B])".
    - Rekap skor seluruh tim tercatat di layar hasil dan tersimpan di `localStorage["abm.skor"]`.
- **Paket/alat tambahan (jika ada) + alasan:** -
- **Catatan/penyimpangan dari docs:**
  - Sesuai permintaan pengguna, opsi pemilihan operasi (kali/bagi/campur) dan pemilihan tabel (1–10) di Balap Becak ditiadakan dari layar setup. Balap Becak langsung melatih seluruh fakta dasar perkalian dan pembagian 1–10 secara acak dan seimbang, sehingga setup menjadi ringkas (hanya input nama kedua pemain).

---

## T4 — Ruang Bermain Baru: Tebak Jajan & Balap Becak (versi 2 - BALAP-BECAK.md) — 2026-11-12
- **Dibuat/diubah:**
  - `docs/BALAP-BECAK.md`: membaca dan mengimplementasikan seluruh ketentuan perombakan Ruang Bermain (Tebak Jajan & Balap Becak) menggantikan pembagian lama Individu/Tim.
  - `index.html`: menambahkan `<script src="js/generator-soal.js"></script>` di antara `js/soal.js` dan `js/funfact.js`; menyusun ulang seluruh `layar-main` (pilih Tebak Jajan / Balap Becak), `layar-main-cara` (pilih cara main Sendiri / Tim), `layar-main-tebak` (permainan kuis Tebak Jajan), `layar-main-balap-setup` (setup balap becak 2 pemain, pemilihan tabel 1–10 dan operasi), `layar-main-balap` (arena balapan 2 lajur becak dengan kontrol keyboard Z/X vs ./, timer ronde, HUD posisi, dan kotak jawaban 2 pilihan), serta memperbarui panduan aplikasi terkait kontrol keyboard balap becak.
  - `js/soal.js`: memperbarui seluruh 38 soal dengan skema baru `permainan: "tebak"`.
  - `docs/ARCHITECTURE.md`: memperbarui dokumentasi skema soal menjadi `permainan: "tebak"`.
  - `tools/cek-aset.mjs`: memperbarui validator soal (`s.permainan === "tebak"`, serta syarat 4 pilihan hanya untuk soal cerita).
  - `assets/manifest.js`: mendaftarkan 11 kunci aset baru (`balap.becak1`, `balap.becak2`, `balap.latar`, `balap.lajur`, `balap.start`, `balap.finis`, `ui.ikon-tebak`, `ui.ikon-balap`, `ui.ikon-sendiri`, `ui.ikon-tim`, `ui.tombol-kunci`).
  - `assets/img/balap/`: membuat direktori baru dengan `.gitkeep` dan membuat 11 berkas placeholder SVG melalui `node tools/cek-aset.mjs --placeholder`.
  - `js/belajar.js`: menghubungkan pembentukan tabel perkalian dan pembagian ke `GeneratorSoal.tabel(n, op)`.
  - `css/style.css`: menambahkan tata letak responsif untuk lintasan balap becak 2 lajur, animasi pergerakan becak (`transform` & `left`), kartu jawaban 2 pilihan besar dengan label tombol keyboard, HUD pemain, timer ronde, dan checkbox pilihan tabel.
  - `js/game.js`: mengimplementasikan mesin baru:
    1. **Tebak Jajan:** Main Sendiri (skor 3/2/1 + hint + penjelasan) dan Main Tim (papan skor tim, bergantian menjawab, 1 poin tim).
    2. **Balap Becak:** 2 pemain berebut via keyboard (P1: `KeyZ`/`KeyX`, P2: `Period`/`Slash`); soal simbol acak dari `GeneratorSoal.buat({ tabel, operasi, jumlahPilihan: 2 })`; aturan rebutan (benar maju 1 petak; salah terkunci ronde ini dan lawan dapat menjawab; kedua salah/waktu habis tidak maju); timer per ronde (15 detik); deteksi kemenangan saat mencapai target petak; pencatatan fakta yang sering salah; pencegahan default key `Slash` untuk Firefox; dan tombol `F` untuk layar penuh.
- **Verifikasi:**
  - `node tools/uji-generator.mjs`: 54.000 soal diuji dan semua valid (0 galat).
  - `node tools/cek-aset.mjs`: seluruh 77 gambar ada (termasuk 11 aset balap becak), 38 soal valid (0 galat).
  - `node --check js/*.js`: seluruh berkas JavaScript lolos cek sintaks.
- **Perlu dicek pengguna di peramban:**
  - Buka/muat ulang `index.html` di peramban.
  - Masuk ke **Ruang Bermain**:
    - Uji **Tebak Jajan** -> pilih Main Sendiri atau Main Tim -> permainan berjalan dengan soal cerita & bergambar dari `BANK_SOAL`.
    - Uji **Balap Becak**:
      - Pada layar setup, atur nama Pemain 1 & 2, pilih operasi (Perkalian / Pembagian / Campuran), dan centang tabel yang ingin dilatih.
      - Klik **Mulai Balapan!** -> masuk ke arena balap 2 lajur.
      - Pemain 1 menekan tombol **Z** (jawaban kiri) atau **X** (jawaban kanan).
      - Pemain 2 menekan tombol **.** (jawaban kiri) atau **/** (jawaban kanan).
      - Uji skenario rebutan: jawaban benar membuat becak maju 1 petak; jika salah, pemain terkunci dan lawan dapat menjawab; jika keduanya salah/waktu habis, kunci jawaban ditampilkan dan tidak ada yang maju.
      - Balapan selesai saat salah satu mencapai garis finis (10 petak) dan menampilkan layar hasil pemenang beserta fakta yang sering salah.
- **Paket/alat tambahan (jika ada) + alasan:** -
- **Catatan/penyimpangan dari docs:**
  - Sesuai permintaan pengguna, opsi pemilihan operasi (kali/bagi/campur) dan pemilihan tabel (1–10) di Balap Becak ditiadakan dari layar setup. Balap Becak langsung melatih seluruh fakta dasar perkalian dan pembagian 1–10 secara acak dan seimbang, sehingga setup menjadi ringkas (hanya input nama kedua pemain).

---

## T3 — Ruang Belajar (FR-06, 07) — 2026-11-12
- **Dibuat/diubah:**
  - `index.html`: memperbarui `layar-belajar` dengan 3 tombol menu (Tabel Perkalian, Tabel Pembagian, Peraga Visual); mengimplementasikan `layar-belajar-kali` dengan bilah tab angka (×1 s.d. ×10) dan wadah grid 10 kotak tabel perkalian; mengimplementasikan `layar-belajar-bagi` dengan bilah tab angka (÷1 s.d. ÷10) dan wadah grid 10 kotak tabel pembagian; mengimplementasikan `layar-peraga` dengan kontrol konsep (Perkalian / Pembagian), pilihan objek hitung budaya Jawa, stepper baris (kelompok) dan kolom (isi), area visualisasi peraga kelompok objek, serta panel representasi simbol, penjumlahan berulang, dan hubungan kebalikan; menambahkan `<script src="js/belajar.js"></script>` pada urutan skrip.
  - `css/style.css`: menambahkan styling responsif untuk bilah tab angka, kotak tabel perkalian/pembagian 10 kotak dengan penyorotan aktif (*highlight & auto-scroll*), panel kontrol peraga interaktif dengan stepper (+ / −), area visualisasi kelompok objek berbingkai putus-putus, serta teks simbol dan konsep penjumlahan berulang/kebalikan.
  - `js/belajar.js`: membuat modul mandiri untuk membangun 10 kotak tabel perkalian (1×1 s.d. 10×10), 10 kotak tabel pembagian (hasil bagi 1 s.d. 10), fungsi penyorotan tabel saat tab angka diklik, serta peraga visual interaktif dinamis yang menggambar kelompok objek via `Aset.img(objek)` secara aman, menghitung penjumlahan berulang (misal: 4 + 4 + 4 = 12), serta menyajikan konsep hubungan kebalikannya (12 ÷ 3 = 4).
- **Verifikasi:**
  - `node --check js/*.js`: seluruh berkas termasuk `js/belajar.js` lolos cek sintaks.
  - `node tools/cek-aset.mjs`: lolos validasi (66 gambar ada, 38 soal valid).
  - Validasi matematis: tabel perkalian $i \times n$ dan tabel pembagian $(j \times n) \div n = j$ untuk rentang $1 \le n, i, j \le 10$ terbukti benar dan konsisten.
- **Perlu dicek pengguna di peramban:**
  - Buka/muat ulang `index.html` di peramban dan masuk ke menu "Ruang Belajar".
  - Klik **Tabel Perkalian** -> periksa 10 kotak tabel perkalian (Tabel 1 s.d. 10). Klik salah satu tab (misal: ×5) untuk memastikan tabel 5 tersorot dan fokus.
  - Klik **Kembali**, lalu buka **Tabel Pembagian** -> periksa 10 kotak tabel pembagian (Bagi 1 s.d. 10). Klik tab (misal: ÷4) untuk memastikan tabel pembagian 4 tersorot.
  - Klik **Kembali**, lalu buka **Peraga Visual**:
    - Ganti objek (misal: Klepon, Bakpia, dsb.).
    - Ubah jumlah Baris/Kelompok dan Kolom/Isi menggunakan tombol (+) dan (−).
    - Amati perubahan visual susunan benda serta perubahan otomatis pada teks rumus, penjumlahan berulang, dan hubungan kebalikan.
    - Coba ganti mode konsep ke "Pembagian" untuk mengamati konsep "bagikan rata".
- **Paket/alat tambahan (jika ada) + alasan:** -
- **Catatan/penyimpangan dari docs:**
  - Sesuai permintaan pengguna, opsi pemilihan operasi (kali/bagi/campur) dan pemilihan tabel (1–10) di Balap Becak ditiadakan dari layar setup. Balap Becak langsung melatih seluruh fakta dasar perkalian dan pembagian 1–10 secara acak dan seimbang, sehingga setup menjadi ringkas (hanya input nama kedua pemain).

---

## Penyesuaian docs/ALUR.md — Alur Layar Baru (T0, T1, T2) — 2026-11-12
- **Dibuat/diubah:**
  - `docs/ALUR.md`: membaca dan mematuhi seluruh spesifikasi alur navigasi baru pengganti urutan lama PRD FR-01–04 & §6.
  - `js/layar.js`: menambahkan dukungan parameter `asal` (`"onboarding"` | `"menu"`), metode `Layar.ambilAsal()`, penegasan menu sebagai akar navigasi (membersihkan riwayat saat masuk menu dan mencegah kembali dari menu ke onboarding), serta implementasi `Layar.mulaiUlang()` untuk aksi Keluar (reset pemain, skor, riwayat layar, hentikan musik latar, dan kembali ke bumper).
  - `index.html`: memperbarui struktur layar `panduan`, `tujuan`, dan `nama` dengan tombol navigasi kontekstual (Kembali, Lewati, Lanjut/MULAI); menambahkan tombol **Keluar** (ikon rumah) di pojok kiri bawah menu utama; serta modal pop-up konfirmasi keluar ("Kembali ke awal?").
  - `css/style.css`: menambahkan tata letak dan gaya tombol Keluar di menu utama.
  - `js/app.js`: mengimplementasikan seluruh transisi onboarding sesuai tabel ALUR.md §2 (`bumper` → `panduan` → `tujuan` → `nama` → `menu`); penanganan dinamis layar `panduan` dan `tujuan` saat dibuka via onboarding vs via menu utama; tombol Lewati pada putaran onboarding kedua dan seterusnya serta dukungan pengaturan guru `abm.pengaturan.lewatiOnboarding`; serta penanganan aksi tombol Keluar + modal konfirmasi.
  - `js/game.js`: menambahkan listener event `mulaiulang` untuk mereset seluruh variabel sesi lokal kuis tanpa menghapus data riwayat skor tersimpan di `localStorage["abm.skor"]`.
- **Verifikasi:**
  - `node --check js/*.js`: seluruh berkas lolos validasi sintaks tanpa galat.
  - `node tools/cek-aset.mjs`: aset dan validasi 38 soal tetap lolos tanpa galat (0 galat).
- **Perlu dicek pengguna di peramban:**
  - Muat ulang `index.html` di peramban.
  - Klik **MULAI / START** di Bumper -> masuk ke **Panduan Aplikasi** (mode onboarding, ada tombol Lanjut dan Kembali ke Awal).
  - Klik **Lanjut** -> masuk ke **Tujuan Pembelajaran** (mode onboarding, ada tombol Lanjut dan Kembali).
  - Klik **Lanjut** -> masuk ke **Nama & Karakter** (ada tombol Kembali ke Tujuan dan tombol MULAI).
  - Ketik nama, pilih karakter, klik **MULAI** -> masuk ke **Menu Utama**.
  - Di Menu Utama: pastikan tidak ada tombol Kembali di pojok kiri atas (Menu adalah akar navigasi).
  - Dari Menu Utama, buka **Tujuan Pembelajaran** atau **Panduan Aplikasi** -> pastikan tombol yang muncul hanya "Kembali ke Menu", dan saat diklik kembali ke Menu Utama.
  - Di Menu Utama, klik tombol **🏠 Keluar** di kiri bawah -> muncul pop-up konfirmasi "Kembali ke awal?".
  - Klik **Ya, Keluar** -> kembali ke Bumper, musik bumper diputar ulang, nama pemain & state kuis tereset, namun riwayat skor di `localStorage` tetap utuh.
  - Klik **START** untuk putaran kedua -> tombol **Lewati** kini muncul di Panduan dan Tujuan sehingga dapat langsung melompat ke layar input Nama.
- **Paket/alat tambahan (jika ada) + alasan:** -
- **Catatan/penyimpangan dari docs:**
  - Sesuai permintaan pengguna, opsi pemilihan operasi (kali/bagi/campur) dan pemilihan tabel (1–10) di Balap Becak ditiadakan dari layar setup. Balap Becak langsung melatih seluruh fakta dasar perkalian dan pembagian 1–10 secara acak dan seimbang, sehingga setup menjadi ringkas (hanya input nama kedua pemain).

---

## T2 — Mesin kuis individu (FR-08, 10–14, 19) — 2026-11-12
- **Dibuat/diubah:**
  - `index.html`: memperbarui `layar-main` dengan kontrol pemilihan topik (kali, bagi, campur) dan tingkat level (1, 2, 3); melengkapi struktur `layar-main-individu` dengan bilah info (nomor soal, skor, tombol audio dengar, info aturan, dan fun fact), area kartu soal dengan susunan visual budaya, 4 opsi pilihan jawaban, dan banner umpan balik; menambahkan pop-up modal aturan penilaian (`i`) dan fun fact (`?`); serta melengkapi `layar-hasil` dengan piala, ringkasan skor/benar, daftar fakta yang masih sulit, dan tombol ulangi/menu.
  - `css/style.css`: menambahkan tata letak khusus untuk susunan objek kuis, bilah info kuis, 4 kartu pilihan jawaban responsif (hover/active/disabled), banner umpan balik dengan ikon centang/silang dan teks pembeda (tema benar/salah), kotak skor hasil akhir, serta chip daftar fakta yang sulit dipelajari.
  - `js/game.js`: mengimplementasikan mesin kuis individu lengkap: pengambilan soal terfilter dari `BANK_SOAL` (+ penimpaan guru), pengacakan urutan soal dan urutan 4 opsi jawaban dengan algoritma Fisher-Yates, render grid susunan ikon budaya melalui `Aset.susunan(objek, baris, kolom)`, aturan skor bertingkat (coba 1 = 3 poin, coba 2 = 2 poin, coba 3 = 1 poin, setelah itu 0 poin & tampil kunci + penjelasan), anti klik-ganda saat penilaian, pencatatan otomatis ke `localStorage["abm.skor"]`, serta integrasi pop-up Aturan dan Fun Fact.
- **Verifikasi:**
  - `node --check js/*.js`: lolos tanpa galat sintaks.
  - `node tools/cek-aset.mjs`: lolos validasi (66 gambar ada, 38 soal valid).
- **Perlu dicek pengguna di peramban:**
  - Buka/muat ulang `index.html` di peramban.
  - Masuk ke menu "Ruang Bermain" -> pilih topik (Perkalian / Pembagian / Campuran) dan level (1 / 2 / 3), lalu klik "Mulai Bermain".
  - Pastikan 10 soal ditampilkan secara bergantian dengan nomor soal dan skor yang terbarui.
  - Periksa susunan visual objek makanan/transportasi/busana yang muncul di kartu soal.
  - Uji tombol bantuan di kanan atas: ikon speaker narasi, ikon `i` (Aturan penilaian), dan ikon `?` (Fun fact seputar objek soal).
  - Uji jawaban benar: tombol berwarna hijau, bunyi SFX benar, poin bertambah sesuai percobaan, dan banner umpan balik muncul.
  - Uji jawaban salah: tombol dinonaktifkan, muncul petunjuk (hint), dan tombol berubah menjadi "Coba Lagi". Pada kesalahan ke-3, kunci jawaban beserta penjelasan ditampilkan.
  - Setelah 10 soal selesai, pastikan layar hasil menampilkan total skor, jumlah benar, piala, dan daftar fakta sulit jika ada soal yang salah.
- **Paket/alat tambahan (jika ada) + alasan:** -
- **Catatan/penyimpangan dari docs:**
  - Sesuai permintaan pengguna, opsi pemilihan operasi (kali/bagi/campur) dan pemilihan tabel (1–10) di Balap Becak ditiadakan dari layar setup. Balap Becak langsung melatih seluruh fakta dasar perkalian dan pembagian 1–10 secara acak dan seimbang, sehingga setup menjadi ringkas (hanya input nama kedua pemain).

---

## T1 — Layar statis dan navigasi (FR-01–05, FR-22) — 2026-11-12
- **Dibuat/diubah:**
  - `css/style.css`: menambahkan tata letak penuh untuk bumper, form input nama dan karakter, menu 6 tombol kartu, kontainer statis, navigasi bilah global (Kembali & Menu), modal pengaturan audio, serta tab 2 halaman profil pengembang. Semua ukuran teks >= 28px (atau judul >= 36-56px), target klik >= 48px, dan hanya memakai CSS variable dari `css/tema.css`.
  - `index.html`: memperbarui struktur HTML untuk layar Bumper (judul/logo, 3 ikon makanan, tombol START), Layar Nama & Karakter (input teks & grid 4 karakter), Menu Utama (6 tombol kartu), Tujuan Pembelajaran (kutipan tujuan sesuai PRD), Panduan Aplikasi (4 butir alur), Ruang Belajar & Ruang Bermain navigasi sub-menu, Akses Guru, Profil Pengembang 2 halaman, tombol navigasi Kembali & Menu, serta modal pengaturan audio global.
  - `js/app.js`: inisialisasi pemanggilan aset gambar secara dinamis melalui `Aset.img(kunci)` tanpa hardcode path lokal; pengaturan interaksi START yang memicu SFX klik & pemutaran musik bumper; penyimpanan nama & karakter aktif ke `localStorage["abm.pemainAktif"]`; manajemen tombol riwayat Kembali (`Layar.kembali()`) dan Ke Menu (`Layar.keMenu()`); modal kontrol audio terpisah (musik, sfx, narasi); serta pergantian tab halaman 1 dan 2 profil pengembang.
- **Verifikasi:**
  - `node --check js/*.js`: lolos tanpa galat sintaks.
  - `node tools/cek-aset.mjs`: lolos validasi (66 gambar ada, 38 soal valid).
- **Perlu dicek pengguna di peramban:**
  - Muat ulang `index.html` di peramban.
  - Verifikasi tampilan Layar Bumper (Logo, 3 makanan Jawa: klepon, getuk, cenil, dan tombol START).
  - Klik tombol "MULAI / START" -> menuju Layar Nama & Karakter.
  - Ketik nama dan pilih salah satu karakter (1–4), lalu klik "Lanjut ke Menu" -> menuju Menu Utama.
  - Uji keenam tombol Menu Utama (Tujuan Pembelajaran, Panduan Aplikasi, Ruang Belajar, Ruang Bermain, Akses Guru, Profil Pengembang).
  - Uji tombol "Kembali" dan "Menu" di pojok kiri atas untuk memastikan kembali ke layar sebelumnya atau langsung ke Menu Utama.
  - Buka layar "Profil Pengembang", uji tombol "Halaman 1" dan "Halaman 2".
  - Uji tombol ikon speaker di pojok kanan atas -> modal suara muncul dengan toggle Musik Latar, SFX, dan Narasi Suara yang dapat diaktif-matikan.
- **Paket/alat tambahan (jika ada) + alasan:** -
- **Catatan/penyimpangan dari docs:**
  - Sesuai permintaan pengguna, opsi pemilihan operasi (kali/bagi/campur) dan pemilihan tabel (1–10) di Balap Becak ditiadakan dari layar setup. Balap Becak langsung melatih seluruh fakta dasar perkalian dan pembagian 1–10 secara acak dan seimbang, sehingga setup menjadi ringkas (hanya input nama kedua pemain).

---

## T0 — Fondasi — 2026-11-12
- **Dibuat/diubah:**
  - `index.html`: melengkapi seluruh 16 `<section class="layar" id="layar-NAMA" hidden>` sesuai PRD §6 (`bumper`, `nama`, `menu`, `tujuan`, `panduan`, `belajar`, `belajar-kali`, `belajar-bagi`, `peraga`, `main`, `main-individu`, `main-tim`, `hasil`, `guru-pin`, `guru`, `profil`).
  - `js/util.js`: fungsi `$`, `$$`, `acak` (Fisher-Yates), serta `simpan`, `baca`, `hapusStorage` dengan penanganan `try/catch`.
  - `js/layar.js`: router layar (`Layar.tampil`, `Layar.kembali`, `Layar.keMenu`, `Layar.aktif`), serta penskalaan panggung 1366×768 berbasis rasio jendela (`Layar.sesuaikanSkala`, `Layar.init`).
  - `js/app.js`: inisialisasi awal saat DOM siap, memanggil `Layar.init()` dan menampilkan layar awal (`bumper`).
  - `js/skor.js`: kerangka modul skor awal (`Skor.ambilRiwayat`, `Skor.simpanRiwayat`).
  - `js/game.js`: kerangka modul game awal (`Game`).
  - `js/guru.js`: kerangka modul guru awal (`Guru.cekPin`).
  - `AGENTS.md`: penyesuaian nama distro WSL dari `Ubuntu 24.04.3 LTS` menjadi `Ubuntu` sesuai registri WSL di sistem.
- **Verifikasi:**
  - `node --check js/*.js`: seluruh berkas JavaScript lolos validasi sintaks tanpa galat.
  - `node tools/cek-aset.mjs --placeholder`: seluruh 66 gambar SVG terverifikasi lengkap/ada.
  - `node tools/cek-aset.mjs`: aset dan validasi 38 soal lolos (0 galat).
- **Perlu dicek pengguna di peramban:**
  - Buka [index.html](file://wsl.localhost/Ubuntu/var/www/html/ayo-belajar-matematika/index.html) di peramban.
  - Pastikan elemen `#panggung` berada tepat di tengah layar dengan penskalaan proporsional 1366×768.
  - Di konsol peramban (F12), coba jalankan `Layar.tampil("menu")` atau `Layar.tampil("profil")` untuk memastikan fungsi router berjalan mulus tanpa galat.
- **Paket/alat tambahan (jika ada) + alasan:** -
- **Catatan/penyimpangan dari docs:**
  - Sesuai permintaan pengguna, opsi pemilihan operasi (kali/bagi/campur) dan pemilihan tabel (1–10) di Balap Becak ditiadakan dari layar setup. Balap Becak langsung melatih seluruh fakta dasar perkalian dan pembagian 1–10 secara acak dan seimbang, sehingga setup menjadi ringkas (hanya input nama kedua pemain).

---

---

## Perbaikan & Perubahan — Akses Menu Hamburger & Navigasi Ikon Profil — 2026-11-25
- **Dibuat/diubah:**
  - `assets/manifest.js`: mendaftarkan `ui.ikon-kiri` (`assets/img/ui/ikon-kiri.webp`) dan `ui.ikon-kanan` (`assets/img/ui/ikon-kanan.webp`), menaikkan versi cache aset menjadi 14.
  - `index.html`:
    - Mengaktifkan menu hamburger di semua halaman (menghapus atribut `hidden` bawaan pada `#bilah-suara-global` dan `#btn-hamburger`).
    - Mengubah tombol navigasi "Halaman 1" dan "Halaman 2" di layar profil pengembang menjadi tombol ikon navigasi kiri (`#btn-profil-kiri`) dan kanan (`#btn-profil-kanan`).
  - `css/style.css`: menambahkan kelas gaya `.tombol-profil-nav` dengan target klik minimum 48px, efek hover, feedback active, serta status `disabled` (opacity dan cursor) untuk navigasi halaman profil.
  - `js/menu-hamburger.js`: memperbarui fungsi `perbaruiVisibilitas()` agar tombol hamburger tetap aktif dan dapat dibuka di semua halaman/layar.
  - `js/app.js`:
    - Memasang gambar `ui.ikon-kiri` dan `ui.ikon-kanan` pada wadah ikon tombol navigasi profil.
    - Menghubungkan logika navigasi halaman profil 1 dan 2 menggunakan tombol panah kiri dan kanan (status disabled otomatis di halaman awal/akhir dan reset ke halaman 1 saat layar profil dibuka).
    - Memastikan bilah kontrol pojok kanan atas (`#bilah-suara-global`) selalu aktif di semua layar.
- **Verifikasi:**
  - `node -c js/*.js`: seluruh berkas JavaScript lolos pemeriksaan sintaks tanpa galat.
  - `node tools/cek-aset.mjs`: gambar 98/98 terdaftar dan ada, 38 soal valid.
- **Perlu dicek pengguna di peramban:**
  - Buka `index.html` di peramban.
  - Periksa tombol hamburger di pojok kanan atas: pastikan tampil dan dapat dibuka di semua layar (layar judul/bumper, onboarding, menu utama, ruang belajar, tabel materi, ruang bermain, balap becak, hingga profil).
  - Buka layar "Profil Pengembang": pastikan tombol "Halaman 1" dan "Halaman 2" sudah berganti menjadi ikon panah kiri dan kanan (`assets/img/ui/ikon-kiri.webp` dan `assets/img/ui/ikon-kanan.webp`).
  - Uji klik tombol panah kanan untuk berpindah ke profil halaman 2, dan klik tombol panah kiri untuk kembali ke halaman 1.
- **Paket/alat tambahan (jika ada) + alasan:** -
- **Catatan/penyimpangan dari docs:** -

---

## Perubahan Konten & Tata Letak Layar Panduan Aplikasi — 2026-11-25
- **Dibuat/diubah:**
  - `index.html`: memperbarui teks dan struktur layar `#layar-panduan` sesuai format permintaan pengguna:
    - Salam pembuka: "Selamat Datang!" dan pengenalan dua menu utama ("Ruang Bermain" dan "Ruang Belajar").
    - Deskripsi rincian Ruang Belajar (tabel perkalian & pembagian 1–10) dan Ruang Bermain (Hitung Jajan & Balap Becak).
    - Grid 4 petunjuk ikon: kembali (`ui.ikon-kembali`), menu hamburger (`ui.ikon-humberger`), info funfact (`ui.ikon-funfact`), dan bantuan aturan (`ui.ikon-bantuan`).
  - `css/style.css`: menambahkan styling untuk `.panduan-konten`, `.panduan-salam`, `.panduan-deskripsi`, `.panduan-menu-info`, dan grid 2 kolom `.panduan-ikon-grid` beserta kotaknya agar proporsional di panggung 1366×768.
  - `js/app.js`: menambahkan pemuatan gambar ikon panduan via `window.Aset.img(...)` pada `initAsetLayar()`.
- **Verifikasi:**
  - `node -c js/*.js`: lolos validasi sintaks.
  - `node tools/cek-aset.mjs`: gambar 98/98 ada, soal valid.
- **Perlu dicek pengguna di peramban:**
  - Buka `index.html` di peramban.
  - Masuk ke layar "Panduan Aplikasi" (baik dari alur awal atau melalui tombol hamburger -> Panduan Aplikasi).
  - Pastikan teks tersusun rapi: salam pembuka, rincian menu belajar & bermain, serta 4 kartu petunjuk ikon dengan gambarnya masing-masing.
- **Paket/alat tambahan (jika ada) + alasan:** -
- **Catatan/penyimpangan dari docs:** -

---

## Penambahan Logo UNY pada Layar Bumper — 2026-11-25
- **Dibuat/diubah:**
  - `assets/img/ui/logo-uny.png`: menyalin berkas logo resmi Universitas Negeri Yogyakarta (UNY) dari unggahan pengguna.
  - `assets/manifest.js`: mendaftarkan entri `ui.logo-uny` (`ui/logo-uny.png`), menaikkan versi cache aset menjadi 15.
  - `index.html`: menambahkan elemen `.bumper-logo-instansi` (`#wadah-bumper-logo-instansi`) pada `#layar-bumper` di pojok kiri atas.
  - `css/style.css`: menambahkan aturan gaya `.bumper-logo-instansi` dengan posisi absolut (`top: 20px; left: 25px;`), wadah putih bundar (`border-radius: 50%`, `background: var(--teks-terang)`), bayangan lembut (`box-shadow`), serta penataan logo di tengah lingkaran.
  - `js/app.js`: memuat gambar `ui.logo-uny` melalui `window.Aset.img()` pada `initAsetLayar()`.
- **Verifikasi:**
  - `node -c js/*.js`: seluruh skrip lolos uji sintaks (0 galat).
  - `node tools/cek-aset.mjs`: gambar 99/99 terdaftar dan tersedia lengkap.
- **Perlu dicek pengguna di peramban:**
  - Buka `index.html` di peramban.
  - Periksa layar bumper (halaman awal): pastikan logo UNY tampil di pojok kiri atas dalam wadah lingkaran putih dengan bayangan (shadow) yang rapi dan elegan.
- **Paket/alat tambahan (jika ada) + alasan:** -
- **Catatan/penyimpangan dari docs:** -

---

## Perbaikan & Perubahan Permainan Balap Becak — 2026-11-25
- **Dibuat/diubah:**
  - `css/style.css`:
    - Mengubah tampilan lintasan balap becak menjadi jalan raya beraspal realistis (`background: #333230;`) dengan marka garis putih putus-putus (`- - - - -`) di tengah lajur menggunakan `repeating-linear-gradient`.
    - Menghilangkan garis pembatas balok/langkah vertikal (`.petak-lintasan-wadah { display: none; }`).
    - Menambahkan pop-up notifikasi "Waktu Habis!" di tengah layar (`.status-ronde-balap.pop-up-tengah`) dengan animasi pop dan warna tegas (`--terakota`).
    - Menambahkan styling `.teks-selamat-balap` (`font-size: 52px; font-family: var(--font-judul);`) untuk memperbesar ucapan selamat pemenang.
  - `index.html`:
    - Mengubah tampilan awal teks simbol soal balapan menjadi `7 × 8 = ?`.
    - Menambahkan `id="hasil-ringkasan-grid"` pada kontainer ringkasan hasil permainan.
  - `js/game.js`:
    - Menambahkan format ` = ?` pada setiap teks soal operasi matematika balap becak (contoh: `5 × 4 = ?`).
    - Menghapus pembuatan elemen garis balok/petak vertikal di `renderLintasanBalap()`.
    - Memperbarui `waktuHabisRonde()` agar pop-up "⏰ Waktu Habis!" muncul tepat di tengah layar dengan durasi singkat (700 ms).
    - Memperbarui `selesaiBalapBecak()`: memunculkan ikon piala (`ui.piala`) di atas teks selamat, memperbesar teks selamat pemenang via kelas `.teks-selamat-balap`, serta menyembunyikan kotak Total Skor dan Pencapaian/Rekap di layar kemenangan balap becak.
  - `js/app.js`: menambahkan inisialisasi awal aset piala (`ui.piala`) pada `#wadah-piala-hasil`.
- **Verifikasi:**
  - `node -c js/*.js`: lolos uji sintaks (0 galat).
  - `node tools/cek-aset.mjs`: gambar 99/99 ada dan soal valid.
- **Perlu dicek pengguna di peramban:**
  - Buka `index.html` dan mainkan mode **Balap Becak**:
    1. Pastikan lintasan balap becak tampil selayaknya jalan raya aspal dengan marka garis putih putus-putus tanpa sekat kotak/balok langkah.
    2. Periksa soal balapan di kotak tengah: pastikan operasi disertai ` = ?` (contoh: `5 × 4 = ?`).
    3. Biarkan waktu habis: pastikan pop-up "⏰ Waktu Habis!" muncul di tengah layar dan berganti ronde secara singkat (700ms).
    4. Selesaikan balapan sampai ada yang finis: pastikan di layar kemenangan tampil ikon piala di atas teks ucapan selamat juara 1 yang berukuran besar, serta kotak total skor dan pencapaian/rekap sudah dihilangkan.
- **Paket/alat tambahan (jika ada) + alasan:** -
- **Catatan/penyimpangan dari docs:** -
