# UJI-FUNGSI.md — Checklist Uji Fungsi Aplikasi (Black-Box Testing)

> Dokumen pengujian fungsi menyeluruh (black-box) sistem **"Ayo Belajar Matematika"** untuk memastikan pemenuhan seluruh kebutuhan fungsional (PRD FR-01 s.d. FR-22), integrasi CTML, dan arsitektur luring (*offline file://*).

## 1. Lingkungan Uji
- **Perangkat Sasaran:** Laptop standar (1366×768) + Proyektor.
- **Protokol:** Buka langsung berkas `index.html` via `file://` tanpa server lokal dan tanpa koneksi internet.
- **Peramban Diuji:** Google Chrome / Microsoft Edge / Mozilla Firefox.

---

## 2. Tabel 3.8 — Checklist Uji Fungsi Aplikasi

| ID Fitur | Skenario Pengujian | Prosedur Uji | Hasil yang Diharapkan | Status |
|---|---|---|---|---|
| **FR-01** | Bumper / Layar Pembuka | Buka `index.html`. Klik tombol MULAI. | Judul, 3 makanan Jawa, dan tombol MULAI tampil tanpa tombol lain yang bocor. Autoplay diizinkan setelah klik. | **[✓] Lolos** |
| **FR-02** | Input Nama & Pilihan Karakter | Masukkan nama siswa (maks. 15 huruf) dan pilih 1 dari 4 karakter khas Jawa. Klik MULAI. | Karakter terpilih tersorot, nama tersimpan di sesi `PemainAktif`, lanjut ke Menu Utama. | **[✓] Lolos** |
| **FR-03** | Menu Utama 2 Kartu & Hamburger | Buka Menu Utama. Periksa tata letak panggung dan klik tombol "☰ Menu". | Menu utama bersih hanya berisi 2 kartu besar (Ruang Belajar & Ruang Bermain). Panel drawer hamburger meluncur mulus. | **[✓] Lolos** |
| **FR-04** | Navigasi & Router Layar | Tekan tombol Kembali di setiap sub-layar. Coba tekan tombol Menu. | Tombol kembali membalikkan tumpukan riwayat dengan tepat; menu utama selalu bertindak sebagai akar navigasi. | **[✓] Lolos** |
| **FR-05** | Kontrol Suara Global & Rinci | Klik speaker pojok kanan atas; klik menu Suara di panel hamburger. Ubah toggle Musik/SFX/Narasi. | Speaker luar menjadi tombol bisu cepat (mute toggle). Pengaturan rinci dapat mengontrol musik, SFX, dan narasi secara independen. Preferensi tersimpan di storage. | **[✓] Lolos** |
| **FR-06** | Ruang Belajar: Tabel Perkalian & Pembagian | Pilih menu Ruang Belajar -> Tabel Perkalian / Tabel Pembagian 1–10. Klik angka 1–10. | Tabel 10 kotak tampil presisi, angka fakta dasar akurat secara matematis. | **[✓] Lolos** |
| **FR-07** | Peraga Visual Budaya | Buka Peraga Visual. Tambah/kurang baris dan kolom (1–10), ganti objek budaya Jawa. | Visual susunan grid makanan/busana/transportasi Jawa ter-render dinamis disertai kalimat penjumlahan berulang dan kebalikan. | **[✓] Lolos** |
| **FR-08** | Tebak Jajan: Mode Sendiri | Mainkan 10 soal cerita Tebak Jajan. Jawab benar/salah. | Soal dan pilihan diacak; susunan objek budaya tampil; sistem skor 3/2/1 poin berfungsi; tombol terkunci saat dinilai (anti klik ganda). | **[✓] Lolos** |
| **FR-09** | Tebak Jajan: Mode Tim | Pilih Mode Tim (2–4 tim). Siswa menjawab bergantian. | Papan skor tim terbarui otomatis; tim giliran disorot; tim perolehan benar terbanyak dinobatkan sebagai pemenang. | **[✓] Lolos** |
| **FR-09B** | Balap Becak: 2 Pemain Keyboard | Masuk ke Balap Becak. Pemain 1 gunakan Z/X, Pemain 2 gunakan ./slash. | Kedua pemain berebut menjawab; jawaban benar memajukan becak 1 petak ke garis finis; salah terkunci ronde ini; keyboard responsif tanpa jeda. | **[✓] Lolos** |
| **FR-10** | Umpan Balik Edukatif (CTML) | Amati respons banner setelah memilih jawaban kuis. | Jawaban benar menampilkan centang hijau + pesan semangat; jawaban salah menampilkan silang merah + teks petunjuk (hint) yang memotivasi. | **[✓] Lolos** |
| **FR-11** | Skor Bertingkat & Penjelasan | Lakukan 3 kali percobaan salah pada soal kuis. | Percobaan 1 bernilai 3 poin, percobaan 2 bernilai 2 poin, percobaan 3 bernilai 1 poin. Setelah 3 kali gagal, penjelasan kunci jawaban ditampilkan sebelum lanjut. | **[✓] Lolos** |
| **FR-12** | Layar Hasil Permainan | Selesaikan permainan kuis atau balap becak sampai tuntas. | Menampilkan perolehan total skor, rasio benar, piala penghargaan, serta daftar fakta dasar yang masih sulit/sering salah. | **[✓] Lolos** |
| **FR-13** | Pengacakan Soal & Pilihan | Muat ulang permainan kuis beberapa kali. | Urutan kemunculan soal cerita dan urutan pilihan tombol (A, B, C, D) teracak dinamis lewat algoritma Fisher-Yates. | **[✓] Lolos** |
| **FR-14** | Pop-up Aturan & Fun Fact | Klik ikon **i** (aturan) dan ikon **?** (fun fact) di bilah kuis. Periksa ketiadaan hamburger saat main game. | Modal pop-up budaya dan petunjuk poin terbuka rapi; layar game bebas dari tombol hamburger sehingga fokus ke kuis/balapan. | **[✓] Lolos** |
| **FR-15** | Akses Guru: Proteksi PIN | Buka Akses Guru via hamburger -> masukkan PIN bawaan "1234". Coba ubah PIN. | Terproteksi keypad numerik 4 digit bullet; PIN baru tersimpan aman di `localStorage`; panel guru terbuka hanya jika PIN benar. | **[✓] Lolos** |
| **FR-15B** | Editor Soal Guru | Di Panel Guru, lakukan Tambah Soal baru, Edit soal lama, dan Hapus soal. | Data penimpaan tersimpan di storage; soal gubahan guru langsung muncul di kuis siswa; tersedia tombol reset ke bank soal bawaan. | **[✓] Lolos** |
| **FR-16** | Ekspor CSV & Ekspor/Impor JSON | Klik tombol "Ekspor CSV" pada riwayat, dan "Ekspor JSON" / "Impor JSON" pada soal. | Berkas `.csv` riwayat dan `.json` bank soal terunduh otomatis via Blob luring tanpa koneksi internet. Berkas JSON dapat diimpor kembali dengan validasi format. | **[✓] Lolos** |
| **FR-17** | Narasi Audio Edukatif | Klik tombol ikon dengar narasi di bilah kuis. | Memanggil pemutaran berkas narasi suara per ID soal; aplikasi tetap stabil dan diam tanpa crash jika berkas MP3 narasi belum diisi. | **[✓] Lolos** |
| **FR-18** | Mode Giliran Proyektor Kelas | Jalankan kuis tim atau balap becak di proyektor sekolah. | Pergantian giliran jelas, indikator visual besar, mudah disaksikan bersama oleh seluruh siswa di kelas MI. | **[✓] Lolos** |
| **FR-19** | Pengaturan Waktu & Lintasan | Di tab Pengaturan Guru, ubah panjang lintasan (8/10/12) dan waktu ronde (10/15/20/tanpa batas). | Parameter arena Balap Becak mengikuti konfigurasi guru secara real-time. | **[✓] Lolos** |
| **FR-22** | Profil Pengembang | Buka Profil Pengembang dari menu hamburger. Beralih halaman 1 & 2. | Foto profil 4 pengembang, identitas NIM, nama lengkap, dan dosen pengampu tampil terstruktur dalam 2 halaman navigasi. | **[✓] Lolos** |
| **Polesan** | Animasi Transisi Tirai Jawa | Berpindah antar layar dengan opsi transisi aktif/nonaktif. | Tirai motif wayang/batik menutup dan membuka halus dari sisi kiri dan kanan panggung; animasi dapat dimatikan via menu Pengaturan Guru. | **[✓] Lolos** |
| **Polesan** | Skala Panggung & Letterbox | Ubah ukuran jendela peramban atau gunakan resolusi proyektor berbeda. | Panggung terkunci pada rasio 16:9 basis 1366×768 piksel, terskala di tengah layar (*letterbox* hijau tua) tanpa merusak proporsi UI. | **[✓] Lolos** |

---

## 3. Kesimpulan Verifikasi QA
Seluruh fitur pada instrumen pengujian fungsi memenuhi kriteria *Definisi Selesai*. Sistem bebas dari dependensi daring, aman dari galat *file://*, dan siap digunakan untuk pengujian lapangan di madrasah/sekolah.
