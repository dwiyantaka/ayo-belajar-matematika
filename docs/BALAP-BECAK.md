# BALAP-BECAK.md — Ruang Bermain Baru dan Balap Becak (versi 2)

> Dokumen ini MENGGANTIKAN pembagian "Individu / Tim" di PRD (FR-08, FR-09, FR-19) dan skema `mode` di ARCHITECTURE. Bagian lain tetap berlaku (termasuk `docs/ALUR.md`). Konsep balapan diadaptasi dari referensi (2 becak berebut jawaban lewat keyboard), disederhanakan: 2 pilihan jawaban, 2 pemain.

## 1. Struktur Ruang Bermain

```
Ruang Bermain
 ├─ Tebak Jajan  → pilih cara main: Sendiri | Tim   (pilihan ganda, BANK_SOAL)
 └─ Balap Becak  → langsung 2 pemain, berebut lewat keyboard
```
"Sendiri/Tim" hanya berlaku untuk Tebak Jajan. Balap Becak selalu 2 pemain (tanpa lawan komputer).

## 2. Tebak Jajan
- Memakai `BANK_SOAL` (38 soal). Ganti field `mode:"individu"|"tim"` menjadi `permainan:"tebak"` pada semua soal.
- Soal cerita dan soal bergambar `T-xx` dimainkan di sini. Sendiri: skor 3/2/1 + hint (PRD FR-10/11). Tim: tim bergantian, benar = 1 poin tim.

## 3. Balap Becak

**Soal:** dibuat acak oleh `js/generator-soal.js` dari tabel perkalian dan pembagian 1–10, sumber yang sama dengan Ruang Belajar. Tidak memakai `BANK_SOAL`.
- Panggil `GeneratorSoal.buat({ tabel, operasi, jumlahPilihan: 2 })`.
- Soal berupa simbol pendek (mis. `7 × 8`, `42 : 7`), tidak bergantung kemampuan membaca.
- Sebelum main (layar `main-balap-setup`): pilih tabel yang dilatih (centang 1–10, default semua) dan operasi (kali / bagi / campur).

**Tampilan:** dua lajur; becak 1 (atas) dan becak 2 (bawah) bergerak ke kanan menuju garis finis; di tengah soal besar; dua tombol jawaban kiri dan kanan. HUD tiap pemain: nama, posisi `n/10`, dan label tombol.

**Kontrol keyboard (dua pemain, satu laptop):**

| | Jawaban kiri | Jawaban kanan |
|---|---|---|
| Pemain 1 (becak atas) | **Z** | **X** |
| Pemain 2 (becak bawah) | **.** (titik) | **/** (garis miring) |

Label tombol ditampilkan jelas pada tiap pemain (kotak `Z` `X` dan `.` `/`) dan pada dua tombol jawaban (kiri/kanan). Pemetaan memakai `event.code`: `KeyZ`, `KeyX`, `Period`, `Slash`, supaya tidak terpengaruh layout/CapsLock. Abaikan `event.repeat`. Panggil `preventDefault()` untuk `Slash` saat balapan agar Firefox tidak membuka "quick find". Layar penuh dengan tombol **F**; Esc/tombol Menu untuk keluar.

**Aturan ronde (rebutan, dua pilihan):**
1. Muncul soal dengan 2 pilihan (urutan kiri/kanan diacak, kunci tidak selalu di kiri).
2. Pemain pertama yang menekan tombolnya "mengunci" jawabannya.
   - **Benar:** becak maju 1 petak, jawaban benar disorot, ronde berikutnya.
   - **Salah:** pemain itu **terkunci pada ronde ini**; lawan masih boleh menjawab. Lawan yang menjawab benar maju 1 petak.
3. Bila **kedua pemain salah**, atau **waktu ronde habis**, tidak ada yang maju; tampilkan jawaban benar + `penjelasan` (mis. `7 × 8 = 56`), lanjut ronde berikutnya.
4. Pertama mencapai **10 petak** (pengaturan guru: 8/10/12) menang. Layar akhir: pemenang, jumlah benar tiap pemain, **fakta yang sering salah**, tombol Main Lagi / Menu.
5. **Waktu ronde:** default 15 detik; pengaturan guru 10/15/20 detik atau **Tanpa batas**. Bila "Tanpa batas", ronde baru berakhir setelah ada jawaban benar atau keduanya salah.
6. Setelah jawaban diberikan, input dikunci ±0,8 detik untuk animasi dan umpan balik (ikon + teks + bunyi), agar tidak ada tekan ganda.

Catatan desain: dengan 2 pilihan peluang menebak 50%, tetapi menebak salah justru memberi lawan jawaban pasti (kunci jadi jelas), sehingga menebak asal tidak menguntungkan. Soal singkat dan tabel yang bisa dipilih menjaga fokus ke fakta dasar.

**Lawan komputer, mode tim, dan klik mouse tidak ada di Balap Becak.** (Bisa ditambahkan nanti.)

## 4. Perubahan kode (Task T4)
1. Salin `js/generator-soal.js` dan `tools/uji-generator.mjs` ke proyek. Tambahkan `<script src="js/generator-soal.js"></script>` di `index.html` setelah `js/soal.js` dan sebelum `js/util.js`. Jalankan `node tools/uji-generator.mjs` (harus "Semua valid.").
2. `js/soal.js`: ganti `"mode":"individu"` dan `"mode":"tim"` menjadi `"permainan":"tebak"`. Perbarui skema di `docs/ARCHITECTURE.md` dan `tools/cek-aset.mjs` (hitungan `s.mode` → `s.permainan`; syarat 4 pilihan hanya untuk soal cerita, bukan `T-xx`).
3. `assets/manifest.js`: tambahkan sebelum `return`, lalu `node tools/cek-aset.mjs --placeholder`:
```js
/* ---- BALAP BECAK ---- */
g("balap.becak1",   "balap/becak1.svg",   "Becak pemain 1 (merah)",  "256x160");
g("balap.becak2",   "balap/becak2.svg",   "Becak pemain 2 (biru)",   "256x160");
g("balap.latar",    "balap/latar.svg",    "Latar balapan (jalan/Malioboro)", "1366x768");
g("balap.lajur",    "balap/lajur.svg",    "Ubin lajur",              "136x120");
g("balap.start",    "balap/start.svg",    "Garis start",             "136x120");
g("balap.finis",    "balap/finis.svg",    "Garis finis",             "136x120");
g("ui.ikon-tebak",  "ui/ikon-tebak.svg",  "Ikon kartu Tebak Jajan",  "256x256");
g("ui.ikon-balap",  "ui/ikon-balap.svg",  "Ikon kartu Balap Becak",  "256x256");
g("ui.ikon-sendiri","ui/ikon-sendiri.svg","Ikon cara main Sendiri",  "256x256");
g("ui.ikon-tim",    "ui/ikon-tim.svg",    "Ikon cara main Tim",      "256x256");
g("ui.tombol-kunci","ui/tombol-kunci.svg","Kotak label tombol keyboard","96x96");
```
   Buat folder `assets/img/balap/` (dengan `.gitkeep`).
4. Layar baru (tambahan PRD §6): `main` (pilih Tebak Jajan / Balap Becak), `main-cara` (Sendiri/Tim, hanya Tebak Jajan), `main-tebak`, `main-balap-setup`, `main-balap`, `hasil`/`hasil-balap`.
5. Ruang Belajar (T3): tabel digambar dari `GeneratorSoal.tabel(n, "kali"|"bagi")`.
6. Pengaturan guru (T5): panjang lintasan, waktu ronde (10/15/20/Tanpa batas).
7. Panduan Aplikasi: tambahkan penjelasan tombol Balap Becak (Z X / . /).
8. Riwayat skor: catat sesi balap dengan `permainan:"balap"`, pemenang, jumlah benar tiap pemain.

## 5. Selesai bila
- `node tools/uji-generator.mjs` dan `node tools/cek-aset.mjs` lolos.
- Dua pemain bisa berebut: Z/X dan ./ bekerja, kunci ronde bagi pemain yang salah, kedua salah/waktu habis tidak ada yang maju, finis dan layar akhir benar.
- Tidak ada ketergantungan internet; aset `balap.*` yang belum ada tampil sebagai placeholder.

## 6. Catatan untuk dokumen penelitian
Spesifikasi produk, storyboard 7–8, dan Tabel 3.3 perlu direvisi: dua permainan (Tebak Jajan, Balap Becak); Balap Becak dicatat sebagai drill and practice fakta dasar dengan soal acak dari tabel di Ruang Belajar, dimainkan 2 pemain via keyboard. Karena ada rebutan dan batas waktu, jelaskan alasan pedagogisnya (motivasi, umpan balik segera) dan bahwa waktu ronde bisa diatur atau dimatikan guru.
