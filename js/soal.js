/* BANK SOAL — 38 soal (Hitung Jajan). Edit di sini atau lewat Akses Guru (penimpaan di localStorage).
   Skema (lihat docs/ARCHITECTURE.md & docs/BALAP-BECAK.md):
   - permainan       : "tebak"
   - ilustrasi       : nama berkas ilustrasi di assets/ilustrasi-soal/ (null = tanpa gambar)
   - operan          : [a, b]  kali: a×b  |  bagi: a÷b  (dipakai validator tools/cek-aset.mjs)
   - kunci           : jawaban benar; urutan pilihan diacak saat permainan
   - pilihan         : 3 pilihan jawaban (1 kunci + 2 distraktor)
   Jalankan:  node tools/cek-aset.mjs   untuk memvalidasi soal setelah mengedit. */
window.BANK_SOAL = [
  {
    "id": "J-01",
    "permainan": "tebak",
    "operasi": "kali",
    "level": 1,
    "ilustrasi": "J-01.png",
    "label": "klepon",
    "operan": [
      3,
      4
    ],
    "teks": "Mbak Tika membeli 3 bungkus klepon di Pasar Beringharjo, Yogyakarta. Tiap bungkus berisi 4 klepon. Berapa klepon yang ia beli seluruhnya?",
    "pilihan": [
      7,
      12,
      16
    ],
    "kunci": 12,
    "hint": "4 + 4 + 4 = ...",
    "penjelasan": "3 × 4 = 12"
  },
  {
    "id": "J-02",
    "permainan": "tebak",
    "operasi": "kali",
    "level": 1,
    "ilustrasi": "J-02.png",
    "label": "apem",
    "operan": [
      5,
      2
    ],
    "teks": "Bu Sri menata 5 piring apem untuk selamatan. Tiap piring berisi 2 apem. Berapa apem seluruhnya?",
    "pilihan": [
      7,
      10,
      12
    ],
    "kunci": 10,
    "hint": "2 + 2 + 2 + 2 + 2 = ...",
    "penjelasan": "5 × 2 = 10"
  },
  {
    "id": "J-03",
    "permainan": "tebak",
    "operasi": "bagi",
    "level": 1,
    "ilustrasi": "J-03.png",
    "label": "getuk",
    "operan": [
      12,
      3
    ],
    "teks": "Pak Joko membawa 12 potong getuk khas Magelang. Getuk itu dibagi sama banyak ke 3 piring. Berapa potong getuk di tiap piring?",
    "pilihan": [
      3,
      4,
      15
    ],
    "kunci": 4,
    "hint": "12 : 3 = ...",
    "penjelasan": "12 : 3 = 4"
  },
  {
    "id": "J-04",
    "permainan": "tebak",
    "operasi": "kali",
    "level": 1,
    "ilustrasi": "J-04.png",
    "label": "serabi",
    "operan": [
      4,
      5
    ],
    "teks": "Penjual serabi di Solo menata serabi dalam 4 baris. Tiap baris ada 5 serabi. Berapa serabi seluruhnya?",
    "pilihan": [
      9,
      20,
      25
    ],
    "kunci": 20,
    "hint": "4 baris, tiap baris 5",
    "penjelasan": "4 × 5 = 20"
  },
  {
    "id": "J-05",
    "permainan": "tebak",
    "operasi": "bagi",
    "level": 1,
    "ilustrasi": "J-05.png",
    "label": "wajik",
    "operan": [
      18,
      3
    ],
    "teks": "Mbah Karto punya 18 potong wajik. Ia membungkusnya, tiap bungkus berisi 3 potong. Berapa bungkus yang ia dapat?",
    "pilihan": [
      5,
      6,
      15
    ],
    "kunci": 6,
    "hint": "Berapa kali 3 untuk mencapai 18?",
    "penjelasan": "18 : 3 = 6"
  },
  {
    "id": "J-06",
    "permainan": "tebak",
    "operasi": "kali",
    "level": 1,
    "ilustrasi": "J-06.png",
    "label": "cenil",
    "operan": [
      3,
      10
    ],
    "teks": "Bu Yuni menjual cenil dalam 3 wadah. Tiap wadah berisi 10 cenil. Berapa cenil seluruhnya?",
    "pilihan": [
      13,
      30,
      40
    ],
    "kunci": 30,
    "hint": "10 + 10 + 10 = ...",
    "penjelasan": "3 × 10 = 30"
  },
  {
    "id": "J-07",
    "permainan": "tebak",
    "operasi": "bagi",
    "level": 1,
    "ilustrasi": "J-07.png",
    "label": "lemper",
    "operan": [
      16,
      4
    ],
    "teks": "Ada 16 lemper dibagi rata kepada 4 anak. Berapa lemper yang diterima tiap anak?",
    "pilihan": [
      4,
      12,
      20
    ],
    "kunci": 4,
    "hint": "4 × ... = 16",
    "penjelasan": "16 : 4 = 4"
  },
  {
    "id": "J-08",
    "permainan": "tebak",
    "operasi": "kali",
    "level": 1,
    "ilustrasi": "J-08.png",
    "label": "geplak",
    "operan": [
      2,
      8
    ],
    "teks": "Dik Rani membeli 2 bungkus geplak dari Bantul. Tiap bungkus berisi 8 geplak. Berapa geplak yang ia beli?",
    "pilihan": [
      10,
      16,
      18
    ],
    "kunci": 16,
    "hint": "8 + 8 = ...",
    "penjelasan": "2 × 8 = 16"
  },
  {
    "id": "J-09",
    "permainan": "tebak",
    "operasi": "bagi",
    "level": 1,
    "ilustrasi": "J-09.png",
    "label": "bakpia",
    "operan": [
      30,
      5
    ],
    "teks": "Toko oleh-oleh memasukkan 30 bakpia ke dalam kotak. Tiap kotak berisi 5 bakpia. Berapa kotak yang dibutuhkan?",
    "pilihan": [
      5,
      6,
      35
    ],
    "kunci": 6,
    "hint": "5 × ... = 30",
    "penjelasan": "30 : 5 = 6"
  },
  {
    "id": "J-10",
    "permainan": "tebak",
    "operasi": "kali",
    "level": 1,
    "ilustrasi": "J-10.png",
    "label": "jadah tempe",
    "operan": [
      5,
      5
    ],
    "teks": "Di Kaliurang ada 5 piring jadah tempe. Tiap piring berisi 5 potong. Berapa potong jadah tempe seluruhnya?",
    "pilihan": [
      10,
      25,
      30
    ],
    "kunci": 25,
    "hint": "5 + 5 + 5 + 5 + 5 = ...",
    "penjelasan": "5 × 5 = 25"
  },
  {
    "id": "J-11",
    "permainan": "tebak",
    "operasi": "kali",
    "level": 2,
    "ilustrasi": "J-11.webp",
    "label": "bakpia",
    "operan": [
      6,
      8
    ],
    "teks": "Toko oleh-oleh di Yogyakarta menata bakpia dalam 6 baris. Tiap baris ada 8 kotak. Berapa kotak bakpia seluruhnya?",
    "pilihan": [
      14,
      48,
      56
    ],
    "kunci": 48,
    "hint": "6 baris, tiap baris 8",
    "penjelasan": "6 × 8 = 48"
  },
  {
    "id": "J-12",
    "permainan": "tebak",
    "operasi": "bagi",
    "level": 2,
    "ilustrasi": "J-12.webp",
    "label": "yangko",
    "operan": [
      35,
      7
    ],
    "teks": "Pedagang di Kotagede mempunyai 35 yangko. Yangko itu dibagi rata ke 7 toples. Berapa yangko di tiap toples?",
    "pilihan": [
      4,
      5,
      42
    ],
    "kunci": 5,
    "hint": "7 × ... = 35",
    "penjelasan": "35 : 7 = 5"
  },
  {
    "id": "J-13",
    "permainan": "tebak",
    "operasi": "kali",
    "level": 2,
    "ilustrasi": "J-13.webp",
    "label": "serabi",
    "operan": [
      7,
      6
    ],
    "teks": "Penjual serabi membuat 7 loyang. Tiap loyang berisi 6 serabi. Berapa serabi yang dibuatnya?",
    "pilihan": [
      13,
      42,
      48
    ],
    "kunci": 42,
    "hint": "6 × 7, lihat tabel perkalian 6",
    "penjelasan": "7 × 6 = 42"
  },
  {
    "id": "J-14",
    "permainan": "tebak",
    "operasi": "bagi",
    "level": 2,
    "ilustrasi": "J-14.webp",
    "label": "apem",
    "operan": [
      48,
      6
    ],
    "teks": "Bu Nur punya 48 apem. Apem itu dimasukkan ke dalam dus, tiap dus 6 apem. Berapa dus yang terisi?",
    "pilihan": [
      7,
      8,
      42
    ],
    "kunci": 8,
    "hint": "6 × ... = 48",
    "penjelasan": "48 : 6 = 8"
  },
  {
    "id": "J-15",
    "permainan": "tebak",
    "operasi": "kali",
    "level": 2,
    "ilustrasi": "J-15.webp",
    "label": "klepon",
    "operan": [
      8,
      5
    ],
    "teks": "Pak Joko menyusun klepon di 8 nampan. Tiap nampan berisi 5 klepon. Berapa klepon seluruhnya?",
    "pilihan": [
      13,
      40,
      45
    ],
    "kunci": 40,
    "hint": "5 × 8",
    "penjelasan": "8 × 5 = 40"
  },
  {
    "id": "J-16",
    "permainan": "tebak",
    "operasi": "bagi",
    "level": 2,
    "ilustrasi": "J-16.webp",
    "label": "getuk",
    "operan": [
      54,
      9
    ],
    "teks": "Bu Yuni membagi 54 potong getuk sama banyak ke 9 kotak. Berapa potong getuk di tiap kotak?",
    "pilihan": [
      5,
      6,
      45
    ],
    "kunci": 6,
    "hint": "9 × ... = 54",
    "penjelasan": "54 : 9 = 6"
  },
  {
    "id": "J-17",
    "permainan": "tebak",
    "operasi": "kali",
    "level": 2,
    "ilustrasi": "J-17.webp",
    "label": "wajik",
    "operan": [
      6,
      9
    ],
    "teks": "Mbak Ayu membeli 6 bungkus wajik di Pasar Gede, Solo. Tiap bungkus berisi 9 potong. Berapa potong wajik yang ia beli?",
    "pilihan": [
      15,
      54,
      63
    ],
    "kunci": 54,
    "hint": "9 × 6",
    "penjelasan": "6 × 9 = 54"
  },
  {
    "id": "J-18",
    "permainan": "tebak",
    "operasi": "bagi",
    "level": 2,
    "ilustrasi": "J-18.webp",
    "label": "lemper",
    "operan": [
      40,
      8
    ],
    "teks": "Ada 40 lemper untuk 8 tamu. Tiap tamu mendapat lemper sama banyak. Berapa lemper untuk tiap tamu?",
    "pilihan": [
      4,
      5,
      32
    ],
    "kunci": 5,
    "hint": "8 × ... = 40",
    "penjelasan": "40 : 8 = 5"
  },
  {
    "id": "J-19",
    "permainan": "tebak",
    "operasi": "kali",
    "level": 2,
    "ilustrasi": "J-19.webp",
    "label": "cenil",
    "operan": [
      10,
      7
    ],
    "teks": "Pedagang menata 10 kotak cenil. Tiap kotak berisi 7 cenil. Berapa cenil seluruhnya?",
    "pilihan": [
      17,
      70,
      77
    ],
    "kunci": 70,
    "hint": "7 × 10",
    "penjelasan": "10 × 7 = 70"
  },
  {
    "id": "J-20",
    "permainan": "tebak",
    "operasi": "bagi",
    "level": 2,
    "ilustrasi": "J-20.webp",
    "label": "geplak",
    "operan": [
      63,
      7
    ],
    "teks": "Sebanyak 63 geplak dimasukkan ke 7 bungkus dengan jumlah sama. Berapa geplak di tiap bungkus?",
    "pilihan": [
      8,
      9,
      56
    ],
    "kunci": 9,
    "hint": "7 × ... = 63",
    "penjelasan": "63 : 7 = 9"
  },
  {
    "id": "J-21",
    "permainan": "tebak",
    "operasi": "kali",
    "level": 3,
    "ilustrasi": "J-21.png",
    "label": "jadah tempe",
    "operan": [
      8,
      7
    ],
    "teks": "Rombongan wisatawan di Kaliurang membeli 8 piring jadah tempe. Tiap piring berisi 7 potong. Berapa potong jadah tempe yang mereka beli?",
    "pilihan": [
      15,
      56,
      64
    ],
    "kunci": 56,
    "hint": "7 × 8",
    "penjelasan": "8 × 7 = 56"
  },
  {
    "id": "J-22",
    "permainan": "tebak",
    "operasi": "bagi",
    "level": 3,
    "ilustrasi": "J-22.png",
    "label": "bakpia",
    "operan": [
      72,
      8
    ],
    "teks": "Sebuah toko mengirim 72 bakpia ke 8 warung. Tiap warung menerima bakpia sama banyak. Berapa bakpia yang diterima tiap warung?",
    "pilihan": [
      8,
      9,
      64
    ],
    "kunci": 9,
    "hint": "8 × ... = 72",
    "penjelasan": "72 : 8 = 9"
  },
  {
    "id": "J-23",
    "permainan": "tebak",
    "operasi": "kali",
    "level": 3,
    "ilustrasi": "J-23.png",
    "label": "geplak",
    "operan": [
      9,
      9
    ],
    "teks": "Bu Narti menata geplak dalam 9 baris. Tiap baris berisi 9 geplak. Berapa geplak yang ia tata seluruhnya?",
    "pilihan": [
      18,
      72,
      81
    ],
    "kunci": 81,
    "hint": "9 × 9",
    "penjelasan": "9 × 9 = 81"
  },
  {
    "id": "J-24",
    "permainan": "tebak",
    "operasi": "bagi",
    "level": 3,
    "ilustrasi": "J-24.png",
    "label": "getuk",
    "operan": [
      56,
      8
    ],
    "teks": "Pak Eko memotong getuk menjadi 56 potong. Potongan itu ditaruh di 8 piring sama banyak. Berapa potong getuk di tiap piring?",
    "pilihan": [
      6,
      7,
      48
    ],
    "kunci": 7,
    "hint": "8 × ... = 56",
    "penjelasan": "56 : 8 = 7"
  },
  {
    "id": "J-25",
    "permainan": "tebak",
    "operasi": "kali",
    "level": 3,
    "ilustrasi": "J-25.png",
    "label": "serabi",
    "operan": [
      9,
      7
    ],
    "teks": "Di Pasar Johar, Semarang, seorang pedagang menjual 9 piring serabi. Tiap piring berisi 7 serabi. Berapa serabi yang ia jual?",
    "pilihan": [
      16,
      56,
      63
    ],
    "kunci": 63,
    "hint": "7 × 9",
    "penjelasan": "9 × 7 = 63"
  },
  {
    "id": "J-26",
    "permainan": "tebak",
    "operasi": "bagi",
    "level": 3,
    "ilustrasi": "J-26.png",
    "label": "apem",
    "operan": [
      42,
      6
    ],
    "teks": "Bu Endang punya 42 apem untuk hajatan. Tiap kotak diisi 6 apem. Berapa kotak yang ia butuhkan?",
    "pilihan": [
      6,
      7,
      36
    ],
    "kunci": 7,
    "hint": "6 × ... = 42",
    "penjelasan": "42 : 6 = 7"
  },
  {
    "id": "J-27",
    "permainan": "tebak",
    "operasi": "kali",
    "level": 3,
    "ilustrasi": "J-27.png",
    "label": "lemper",
    "operan": [
      8,
      8
    ],
    "teks": "Sanggar tari menyiapkan 8 baki lemper. Tiap baki berisi 8 lemper. Berapa lemper yang disiapkan seluruhnya?",
    "pilihan": [
      16,
      64,
      72
    ],
    "kunci": 64,
    "hint": "8 × 8",
    "penjelasan": "8 × 8 = 64"
  },
  {
    "id": "J-28",
    "permainan": "tebak",
    "operasi": "bagi",
    "level": 3,
    "ilustrasi": "J-28.png",
    "label": "klepon",
    "operan": [
      63,
      7
    ],
    "teks": "Mbak Sinta menghitung 63 klepon. Klepon itu dibagi sama banyak untuk 7 pedagang. Berapa klepon untuk tiap pedagang?",
    "pilihan": [
      7,
      9,
      56
    ],
    "kunci": 9,
    "hint": "7 × ... = 63. Ingat 7 × 9",
    "penjelasan": "63 : 7 = 9"
  },
  {
    "id": "J-29",
    "permainan": "tebak",
    "operasi": "bagi",
    "level": 3,
    "ilustrasi": "J-29.png",
    "label": "jadah tempe",
    "operan": [
      90,
      10
    ],
    "teks": "Mbah Karto membagi 90 potong jadah tempe kepada 10 anak. Tiap anak mendapat sama banyak. Berapa potong untuk tiap anak?",
    "pilihan": [
      8,
      9,
      80
    ],
    "kunci": 9,
    "hint": "10 × ... = 90",
    "penjelasan": "90 : 10 = 9"
  },
  {
    "id": "J-30",
    "permainan": "tebak",
    "operasi": "kali",
    "level": 3,
    "ilustrasi": "J-30.png",
    "label": "bakpia",
    "operan": [
      9,
      8
    ],
    "teks": "Pemesan hajatan di Yogyakarta memesan 9 dus bakpia. Tiap dus berisi 8 bakpia. Berapa bakpia yang dipesan?",
    "pilihan": [
      17,
      72,
      81
    ],
    "kunci": 72,
    "hint": "8 × 9",
    "penjelasan": "9 × 8 = 72"
  }
];

/* Pesan umpan balik (dipilih acak) */
window.PESAN = {
  benar: ["Selamat jawabanmu benar!", "Hebat! Kamu pintar menghitung!", "Mantap, lanjut ya!"],
  salah: ["Tetap semangat dan ulangi lagi", "Hampir! Coba hitung per kelompok.", "Tetap semangat, lebih teliti lagi yuk"],
  semangat: ["Ini jawabannya. Mari lanjut!"]
};
