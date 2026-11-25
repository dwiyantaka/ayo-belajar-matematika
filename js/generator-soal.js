/* GENERATOR SOAL — sumber tunggal tabel perkalian/pembagian 1–10.
   Dipakai oleh: (1) Ruang Belajar (GeneratorSoal.tabel) dan (2) Balap Becak (GeneratorSoal.buat).
   Jadi soal balapan selalu sama dengan isi tabel di Ruang Belajar. Tanpa dependensi, tanpa fetch. */
(function () {
  "use strict";
  var riwayat = [];                       /* teks soal terakhir, agar tidak berulang beruntun */

  function acakInt(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function ambil(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function kocok(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  /* Pengecoh dari kesalahan umum siswa */
  function pengecoh(op, x, y, kunci, n) {
    var kand = [];
    if (op === "kali") {                  /* x × y */
      kand = [x * (y + 1), x * (y - 1), (x + 1) * y, (x - 1) * y, x + y, kunci + 10, kunci - 10];
    } else {                              /* x : y  (hasil = kunci) */
      kand = [kunci + 1, kunci - 1, kunci + 2, y, x - y, kunci + 3];
    }
    var pilih = [];
    kocok(kand).forEach(function (v) {
      if (v >= 1 && v <= 100 && v !== kunci && pilih.indexOf(v) < 0) pilih.push(v);
    });
    var jaga = 0;                         /* pengisi bila kurang (jarang) */
    while (pilih.length < n && jaga++ < 200) {
      var v2 = kunci + acakInt(-5, 5);
      if (v2 >= 1 && v2 <= 100 && v2 !== kunci && pilih.indexOf(v2) < 0) pilih.push(v2);
    }
    return pilih.slice(0, n);
  }

  function satu(tabel, operasi, jumlahPilihan, acakUrutan) {
    var op = operasi === "campur" ? (Math.random() < 0.5 ? "kali" : "bagi") : operasi;
    var n = ambil(tabel);                 /* angka tabel yang dilatih */
    var k = acakInt(1, 10);
    var x, y, kunci, teks;
    if (op === "kali") {
      x = k; y = n;                       /* mengikuti tabel: k × n */
      if (acakUrutan && Math.random() < 0.5) { x = n; y = k; }
      kunci = x * y;
      teks = x + " × " + y;
    } else {
      x = n * k; y = n; kunci = k;        /* mengikuti tabel pembagian: (n×k) : n */
      teks = x + " : " + y;
    }
    var pil = kocok([kunci].concat(pengecoh(op, x, y, kunci, jumlahPilihan - 1)));
    return {
      permainan: "balap", operasi: op, tabel: n, operan: [x, y],
      teks: teks, pilihan: pil, kunci: kunci,
      hint: op === "kali" ? "Lihat tabel perkalian " + n : y + " × ... = " + x,
      penjelasan: teks + " = " + kunci
    };
  }

  window.GeneratorSoal = {
    tabelDefault: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],

    /* opsi: { tabel:[...angka 1–10], operasi:"kali"|"bagi"|"campur", jumlahPilihan:3|4, acakUrutan:true }
       Soal tidak sama dengan 5 soal terakhir (bila memungkinkan). */
    buat: function (opsi) {
      opsi = opsi || {};
      var tabel = (opsi.tabel && opsi.tabel.length) ? opsi.tabel : this.tabelDefault;
      var op = opsi.operasi || "campur";
      var jp = opsi.jumlahPilihan || 3;
      var au = opsi.acakUrutan !== false;
      var s, coba = 0;
      do { s = satu(tabel, op, jp, au); coba++; } while (riwayat.indexOf(s.teks) >= 0 && coba < 30);
      riwayat.push(s.teks); if (riwayat.length > 5) riwayat.shift();
      return s;
    },
    ulangiRiwayat: function () { riwayat = []; },

    /* Isi tabel untuk Ruang Belajar: n = 1..10. Kembalikan 10 baris {teks, hasil}. */
    tabel: function (n, operasi) {
      var baris = [];
      for (var k = 1; k <= 10; k++) {
        baris.push(operasi === "kali"
          ? { teks: k + " × " + n + " = " + (k * n), hasil: k * n }
          : { teks: (n * k) + " : " + n + " = " + k, hasil: k });
      }
      return baris;
    }
  };
})();
