# ASSETS — Cara Menyimpan dan Mengganti Aset

Semua aset dikelola lewat **kunci** di `assets/manifest.js`. Kode game hanya memakai kunci (mis. `makanan.klepon`), tidak pernah path berkas. Jadi mengganti gambar tidak menyentuh kode.

## Peta folder
| Folder | Isi | Format / ukuran saran |
|---|---|---|
| `assets/img/ui/` | logo, latar bumper/menu, ikon benar/salah/speaker/kembali/lanjut/info/fun fact, piala | SVG atau PNG transparan; ikon 128×128 |
| `assets/img/ornamen/` | border atas/bawah, pola latar, bingkai gunungan, tirai | SVG/PNG; border 1366×120; pola 256×256 (ubin) |
| `assets/img/makanan/` | klepon, getuk, cenil, bakpia, geplak, yangko, jadah-tempe, apem, wajik, lemper, serabi, wedang-uwuh, gudeg | **1 ikon per objek**, 256×256, latar transparan, tampak atas/samping jelas, 1 buah per gambar |
| `assets/img/transportasi/` | becak, andong, sepeda-onthel, bus-transjogja | 256×256 transparan |
| `assets/img/busana/` | blangkon, batik-jarik, surjan, kebaya, selendang | 256×256 transparan |
| `assets/img/karakter/` | 4 karakter × (netral, senang, semangat) | 400×600 transparan |
| `assets/img/profil/` | foto pengembang 1–4 | 400×400 |
| `assets/audio/musik/` | gamelan bumper, musik latar (loop) | MP3 128 kbps, musik < 3 MB |
| `assets/audio/sfx/` | klik, benar, salah, menang | MP3/OGG pendek (< 3 detik) |
| `assets/audio/narasi/` | `<ID-soal>.mp3` (mis. `P-03.mp3`) | MP3 mono 96 kbps; opsional |
| `assets/fonts/` | `judul.woff2`, `isi.woff2` | WOFF2 |

Karena soal digambar sebagai **susunan berulang** dari satu ikon (`Aset.susunan`), kamu cukup menyiapkan **satu ikon per objek**, bukan satu gambar per soal.

## Tiga cara mengganti / menambah
1. **Ganti isi (paling mudah):** timpa berkas dengan **nama dan ekstensi yang sama** (mis. `assets/img/makanan/klepon.svg`). Lalu naikkan `versi` di `assets/manifest.js` (angka 1 → 2) agar peramban tidak memakai cache lama.
2. **Ganti format/nama:** taruh berkas baru (mis. `klepon.png`), ubah **satu baris** di `assets/manifest.js`:
   `g("makanan.klepon", "makanan/klepon.png", "Klepon", "256x256");`
3. **Tambah aset baru:** tambah satu baris `g(...)` di manifest (dan, bila objek hitung baru, tambah fun fact di `js/funfact.js`). Setelah itu bisa dipakai di soal lewat `objek: "makanan.namabaru"`.

Warna dan font: ubah variabel di `css/tema.css`; ganti `assets/fonts/judul.woff2` / `isi.woff2` (nama font diatur di `css/fonts.css`).

## Cek hasil
- **Peramban:** buka `galeri-aset.html` → tiap aset ditampilkan dengan status **OK** atau **BELUM ADA (placeholder)**. Audio punya tombol putar.
- **Terminal (WSL):** `node tools/cek-aset.mjs` → daftar aset hilang, berkas tak terdaftar, berkas terlalu besar, validasi soal.
- `node tools/cek-aset.mjs --placeholder` → membuat placeholder SVG hanya untuk gambar `.svg` yang belum ada (tidak menimpa apa pun).
- `node tools/cek-aset.mjs --daftar` → menulis `docs/DAFTAR-ASET.md` (checklist aset yang harus kamu siapkan).

## Sebelum aset asli siap
Aplikasi tetap jalan: gambar yang belum ada otomatis tampil sebagai kotak placeholder berlabel; audio yang belum ada diam. Jadi pengembangan kode tidak menunggu aset.

## Lisensi dan keamanan
Pakai gambar/audio buatan sendiri atau berlisensi bebas (catat sumbernya di `assets/SUMBER-ASET.md` bila ada). Fun fact dan istilah Jawa diperiksa ahli budaya/bahasa sebelum validasi.
