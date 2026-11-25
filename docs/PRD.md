# PRD — Kebutuhan dan Fitur

Prioritas: **M** wajib · **S** sebaiknya · **C** opsional. Kerjakan M dulu.

## 1. Batasan produk
- Materi: perkalian dan pembagian bilangan cacah, fakta dasar 1–10, hasil sampai 100 (CP Matematika Fase B).
- Konteks budaya Jawa (makanan, transportasi, busana) sebagai **objek hitung** yang digambar sebagai susunan baris × kolom.
- Perangkat: satu laptop (i3, 4 GB, 1366×768) + satu proyektor; guru sebagai fasilitator, siswa bergantian/berkelompok.
- Offline penuh dari `file://`; tanpa instalasi; Chrome/Edge/Firefox.
- Produk ini **drill and practice + game**; tidak mengklaim efektivitas.

## 2. Kebutuhan fungsional

| ID | Kebutuhan | P |
|---|---|---|
| FR-01 | Bumper/intro: judul, 3 gambar makanan, tombol START (juga membuka izin audio) | M |
| FR-02 | Input nama pemain + pilih karakter | M |
| FR-03 | Menu utama terfokus: 2 kartu besar (Ruang Belajar, Ruang Bermain) + tombol hamburger "☰ Menu" (berisi Bantuan [Tujuan, Panduan], Pengaturan [Suara rinci, Akses Guru, Profil Pengembang], dan Kembali ke awal) | M |
| FR-04 | Navigasi terstruktur: tombol kembali di tiap layar anak; menu utama sebagai akar navigasi; hamburger aktif di menu utama dan Ruang Belajar, nonaktif di layar game | M |
| FR-05 | Tombol speaker global mandiri di luar hamburger (bisu cepat/mute toggle di semua layar; pengaturan rinci audio diakses dari menu hamburger) | M |
| FR-06 | Ruang Belajar: tabel perkalian 1–10 dan tabel pembagian 1–10 (10 kotak/tabel) | M |
| FR-07 | Peraga visual: pilih objek, atur baris × kolom, tampil penjumlahan berulang dan simbol; pembagian = bagikan rata; hubungan kebalikan | S |
| FR-08 | Tebak Jajan (Sendiri): kuis pilihan ganda 10 soal acak, susunan visual budaya Jawa, skor 3/2/1 + hint | M |
| FR-09 | Tebak Jajan (Tim) & Balap Becak (2 pemain): kompetisi adu cepat 2 pemain/tim dengan keyboard (Z/X dan ./slash) | M |
| FR-10 | Umpan balik: centang + pesan semangat; silang + pesan motivasi + visual hint | M |
| FR-11 | Aturan skor Tebak Jajan: percobaan 1 = 3 poin, 2 = 2, 3 = 1; setelah itu tampil jawaban + penjelasan | M |
| FR-12 | Layar hasil: skor, jumlah benar, fakta yang masih sulit, tombol ulangi/menu | M |
| FR-13 | Acak urutan soal dan urutan pilihan jawaban | M |
| FR-14 | Ikon **i** (aturan) dan **?** (fun fact) pada layar game (bebas distraksi, tanpa tombol hamburger) | M |
| FR-15 | Akses Guru dengan PIN 4 digit: ubah soal (tambah/edit/hapus), pengaturan game, dan riwayat skor | M |
| FR-16 | Ekspor skor CSV; ekspor/impor soal JSON | S |
| FR-17 | Narasi audio per soal (untuk siswa belum lancar membaca) | S |
| FR-18 | Mode giliran / kompetisi lokal pada satu laptop untuk proyektor kelas | S |
| FR-19 | Pengaturan topik dan batas waktu/ronde di Akses Guru | S |
| FR-20 | Kamus Mini Jawa (siji–sepuluh) | C |
| FR-21 | Lencana/stiker makanan Jawa sebagai hadiah | C |
| FR-22 | Profil Pengembang (2 halaman, foto + nama + NIM + dosen pengampu) | M |

## 3. Kebutuhan non-fungsional
- Offline penuh, tanpa CDN/font online. Folder < 50 MB, muat < 5 detik.
- Basis 1366×768, diskalakan; teks isi ≥ 28 px; target klik ≥ 48 px; mouse dan keyboard.
- Tombol dikunci sesaat setelah memilih jawaban (anti klik ganda). Tidak crash saat klik cepat.
- Data skor hanya di perangkat (tanpa kirim ke luar).
- Soal terpisah dari kode; aset terpisah dari kode (lihat ASSETS.md).
- Panel hamburger: mudah dijangkau, menutup dengan tombol X, klik luar, atau Esc; manajemen fokus keyboard yang ramah pengguna.

## 4. Aturan permainan
- **Tebak Jajan (Sendiri / Tim):** 10 soal sesuai bank soal / generator. Sendiri: salah → hint → coba lagi (maks. 3 percobaan) lalu jawaban + penjelasan. Tim: tim bergantian menjawab fakta dasar.
- **Balap Becak:** 2 pemain berebut menjawab fakta dasar melalui kontrol keyboard (Z, X dan ., /). Menjawab benar memajukan becak 1 petak hingga garis finis 10 petak.
- Pesan umpan balik acak dari daftar aman (lihat `js/soal.js` → `PESAN`).

## 5. Konteks budaya (ringkas)
- Objek hitung: klepon, getuk, cenil, bakpia, geplak, yangko, jadah tempe, apem, wajik, lemper, serabi, wedang uwuh, gudeg; becak, andong, sepeda onthel, bus Trans Jogja; blangkon, batik/jarik, surjan, kebaya, selendang.
- Dekorasi: border batik (kawung/parang) atas-bawah, pola latar halus, bingkai gunungan, tombol bergelombang, transisi tirai (bisa dimatikan).
- Fun fact (`js/funfact.js`) berstatus **perlu verifikasi ahli budaya**; jangan menambah klaim baru.
- Semua aset visual berupa **placeholder** atau aset resmi terdaftar di `assets/manifest.js`.

## 6. Layar dan Komponen (kode nama)
- **Layar:** `bumper`, `nama`, `menu`, `tujuan`, `panduan`, `belajar`, `belajar-kali`, `belajar-bagi`, `peraga`, `main`, `main-tebak`, `main-balap-setup`, `main-balap`, `hasil`, `guru-pin`, `guru`, `profil`.
- **Komponen Global / Overlay:**
  - `panel-hamburger` (overlay drawer menu bantuan, pengaturan suara/guru/profil, dan tombol kembali ke awal)
  - `bilah-suara-global` (tombol speaker bisu cepat di luar hamburger)
  - `modal-suara` (pengaturan rinci musik, efek suara, narasi)
  - `nav-global` (tombol navigasi kembali & menu)

Tujuan pembelajaran (teks layar `tujuan`): *"Setelah bermain, aku dapat menyelesaikan perkalian dan pembagian dengan fakta dasar 1–10 (hasil sampai 100) menggunakan gambar dan simbol."*
