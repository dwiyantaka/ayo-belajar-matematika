/* js/belajar.js — Modul Ruang Belajar (Task T3)
   - Tabel perkalian 1–10 (10 kotak/tabel) & tab sorot
   - Tabel pembagian 1–10 (10 kotak/tabel) & tab sorot
   - Peraga visual interaktif baris × kolom & bagikan rata
   - Penjumlahan berulang dan representasi hubungan kebalikan
*/
(function () {
  "use strict";

  /* Status Peraga Visual */
  var statusPeraga = {
    mode: "kali", // "kali" | "bagi"
    objek: "makanan.klepon",
    baris: 3,
    kolom: 4
  };

  /* Daftar objek hitung budaya untuk peraga */
  var daftarObjekPeraga = [
    { kunci: "makanan.klepon", label: "Klepon" },
    { kunci: "makanan.getuk", label: "Getuk" },
    { kunci: "makanan.cenil", label: "Cenil" },
    { kunci: "makanan.bakpia", label: "Bakpia" },
    { kunci: "makanan.geplak", label: "Geplak" },
    { kunci: "makanan.yangko", label: "Yangko" },
    { kunci: "makanan.jadah-tempe", label: "Jadah Tempe" },
    { kunci: "makanan.apem", label: "Apem" },
    { kunci: "makanan.wajik", label: "Wajik" },
    { kunci: "makanan.lemper", label: "Lemper" },
    { kunci: "makanan.serabi", label: "Serabi" },
    { kunci: "makanan.wedang-uwuh", label: "Wedang Uwuh" },
    { kunci: "transportasi.becak", label: "Becak" },
    { kunci: "transportasi.andong", label: "Andong" },
    { kunci: "busana.blangkon", label: "Blangkon" },
    { kunci: "busana.surjan", label: "Surjan" }
  ];

  /* 1. Bangun 10 Kotak Tabel Perkalian (1 s.d. 10) */
  function bangunTabelPerkalian() {
    var wadahGrid = document.getElementById("wadah-grid-tabel-kali");
    if (!wadahGrid) return;

    while (wadahGrid.firstChild) wadahGrid.removeChild(wadahGrid.firstChild);

    for (var n = 1; n <= 10; n++) {
      // Kotak tabel perkalian angka n
      var kotak = document.createElement("div");
      kotak.className = "kotak-tabel-angka";
      kotak.id = "tabel-kali-" + n;

      var judul = document.createElement("div");
      judul.className = "judul-kotak-tabel";
      judul.textContent = "Tabel " + n;
      kotak.appendChild(judul);

      var barisDaftar = window.GeneratorSoal
        ? window.GeneratorSoal.tabel(n, "kali")
        : [];
      if (barisDaftar.length === 0) {
        for (var i = 1; i <= 10; i++) barisDaftar.push({ teks: i + " × " + n + " = " + (i * n) });
      }

      for (var i = 0; i < barisDaftar.length; i++) {
        var baris = document.createElement("div");
        baris.className = "baris-rumus-tabel";
        baris.textContent = barisDaftar[i].teks;
        kotak.appendChild(baris);
      }

      wadahGrid.appendChild(kotak);
    }
  }

  /* 2. Bangun 10 Kotak Tabel Pembagian (1 s.d. 10) */
  function bangunTabelPembagian() {
    var wadahGrid = document.getElementById("wadah-grid-tabel-bagi");
    if (!wadahGrid) return;

    while (wadahGrid.firstChild) wadahGrid.removeChild(wadahGrid.firstChild);

    for (var n = 1; n <= 10; n++) {
      // Kotak tabel pembagian angka n (hasil bagi 1..10)
      var kotak = document.createElement("div");
      kotak.className = "kotak-tabel-angka";
      kotak.id = "tabel-bagi-" + n;

      var judul = document.createElement("div");
      judul.className = "judul-kotak-tabel";
      judul.textContent = "Bagi " + n;
      kotak.appendChild(judul);

      var barisDaftarBagi = window.GeneratorSoal
        ? window.GeneratorSoal.tabel(n, "bagi")
        : [];
      if (barisDaftarBagi.length === 0) {
        for (var j = 1; j <= 10; j++) barisDaftarBagi.push({ teks: (j * n) + " : " + n + " = " + j });
      }

      for (var j = 0; j < barisDaftarBagi.length; j++) {
        var baris = document.createElement("div");
        baris.className = "baris-rumus-tabel";
        baris.textContent = barisDaftarBagi[j].teks;
        kotak.appendChild(baris);
      }

      wadahGrid.appendChild(kotak);
    }
  }

  /* Sorot kotak tabel tertentu saat tab diklik */
  function sorotTabel(jenis, angka) {
    var prefix = (jenis === "kali") ? "tabel-kali-" : "tabel-bagi-";
    var wadahTab = (jenis === "kali") ? document.getElementById("tab-angka-kali") : document.getElementById("tab-angka-bagi");

    if (wadahTab) {
      var semuaTab = wadahTab.querySelectorAll(".btn-tab-angka");
      for (var i = 0; i < semuaTab.length; i++) {
        if (Number(semuaTab[i].dataset.angka) === Number(angka)) {
          semuaTab[i].classList.add("aktif");
        } else {
          semuaTab[i].classList.remove("aktif");
        }
      }
    }

    for (var k = 1; k <= 10; k++) {
      var elKotak = document.getElementById(prefix + k);
      if (elKotak) {
        if (k === Number(angka)) {
          elKotak.classList.add("sorot");
          elKotak.scrollIntoView({ behavior: "smooth", block: "nearest" });
        } else {
          elKotak.classList.remove("sorot");
        }
      }
    }
  }

  /* 3. Peraga Visual Interaktif (FR-07) */
  function renderPeragaVisual() {
    var wadah = document.getElementById("peraga-wadah-objek");
    var elSimbol = document.getElementById("peraga-simbol-utama");
    var elUlang = document.getElementById("peraga-penjumlahan-ulang");
    var elKebalikan = document.getElementById("peraga-hubungan-kebalikan");

    if (!wadah) return;
    while (wadah.firstChild) wadah.removeChild(wadah.firstChild);

    var b = statusPeraga.baris;
    var k = statusPeraga.kolom;
    var total = b * k;
    var obj = statusPeraga.objek;

    // Gambar kelompok baris dan kolom isi
    for (var bar = 0; bar < b; bar++) {
      var wadahBaris = document.createElement("div");
      wadahBaris.className = "baris-wadah-kelompok";
      wadahBaris.title = "Kelompok " + (bar + 1) + " (isi: " + k + ")";

      for (var kol = 0; kol < k; kol++) {
        var img = window.Aset.img(obj);
        wadahBaris.appendChild(img);
      }
      wadah.appendChild(wadahBaris);
    }

    // Penjelasan teks matematis
    if (statusPeraga.mode === "kali") {
      if (elSimbol) elSimbol.textContent = b + " × " + k + " = " + total;
      
      var bagianUlang = [];
      for (var u = 0; u < b; u++) bagianUlang.push(k);
      if (elUlang) {
        elUlang.textContent = "Penjumlahan berulang: " + bagianUlang.join(" + ") + " = " + total;
      }

      if (elKebalikan) {
        elKebalikan.textContent = "Hubungan kebalikan: " + total + " ÷ " + b + " = " + k + "  atau  " + total + " ÷ " + k + " = " + b;
      }
    } else {
      // Mode Pembagian: total benda dibagi rata ke b kelompok, masing-masing k
      if (elSimbol) elSimbol.textContent = total + " ÷ " + b + " = " + k;
      if (elUlang) {
        elUlang.textContent = "Bagikan rata: " + total + " benda dibagi ke " + b + " kelompok = " + k + " per kelompok";
      }
      if (elKebalikan) {
        elKebalikan.textContent = "Hubungan kebalikan: " + b + " × " + k + " = " + total + "  atau  " + k + " × " + b + " = " + total;
      }
    }
  }

  /* Inisialisasi Kontrol Peraga */
  function initKontrolPeraga() {
    var selectObjek = document.getElementById("peraga-pilih-objek");
    if (selectObjek && !selectObjek.firstChild) {
      daftarObjekPeraga.forEach(function (item) {
        var opt = document.createElement("option");
        opt.value = item.kunci;
        opt.textContent = item.label;
        selectObjek.appendChild(opt);
      });

      selectObjek.value = statusPeraga.objek;
      selectObjek.addEventListener("change", function () {
        statusPeraga.objek = selectObjek.value;
        renderPeragaVisual();
      });
    }

    // Toggle Mode Perkalian / Pembagian
    var btnModeKali = document.getElementById("peraga-mode-kali");
    var btnModeBagi = document.getElementById("peraga-mode-bagi");
    var lblBaris = document.getElementById("label-peraga-baris");
    var lblKolom = document.getElementById("label-peraga-kolom");

    if (btnModeKali && btnModeBagi) {
      btnModeKali.addEventListener("click", function () {
        window.Aset.putar("sfx.klik");
        statusPeraga.mode = "kali";
        btnModeKali.classList.remove("mati");
        btnModeBagi.classList.add("mati");
        if (lblBaris) lblBaris.textContent = "Baris / Kelompok:";
        if (lblKolom) lblKolom.textContent = "Kolom / Isi:";
        renderPeragaVisual();
      });

      btnModeBagi.addEventListener("click", function () {
        window.Aset.putar("sfx.klik");
        statusPeraga.mode = "bagi";
        btnModeBagi.classList.remove("mati");
        btnModeKali.classList.add("mati");
        if (lblBaris) lblBaris.textContent = "Jumlah Kelompok:";
        if (lblKolom) lblKolom.textContent = "Isi Tiap Kelompok:";
        renderPeragaVisual();
      });
    }

    // Stepper Baris (1 s.d. 10)
    var btnKurangBaris = document.getElementById("btn-kurang-baris");
    var btnTambahBaris = document.getElementById("btn-tambah-baris");
    var elNilaiBaris = document.getElementById("nilai-peraga-baris");

    if (btnKurangBaris && btnTambahBaris && elNilaiBaris) {
      btnKurangBaris.addEventListener("click", function () {
        if (statusPeraga.baris > 1) {
          window.Aset.putar("sfx.klik");
          statusPeraga.baris--;
          elNilaiBaris.textContent = statusPeraga.baris;
          renderPeragaVisual();
        }
      });
      btnTambahBaris.addEventListener("click", function () {
        if (statusPeraga.baris < 10) {
          window.Aset.putar("sfx.klik");
          statusPeraga.baris++;
          elNilaiBaris.textContent = statusPeraga.baris;
          renderPeragaVisual();
        }
      });
    }

    // Stepper Kolom (1 s.d. 10)
    var btnKurangKolom = document.getElementById("btn-kurang-kolom");
    var btnTambahKolom = document.getElementById("btn-tambah-kolom");
    var elNilaiKolom = document.getElementById("nilai-peraga-kolom");

    if (btnKurangKolom && btnTambahKolom && elNilaiKolom) {
      btnKurangKolom.addEventListener("click", function () {
        if (statusPeraga.kolom > 1) {
          window.Aset.putar("sfx.klik");
          statusPeraga.kolom--;
          elNilaiKolom.textContent = statusPeraga.kolom;
          renderPeragaVisual();
        }
      });
      btnTambahKolom.addEventListener("click", function () {
        if (statusPeraga.kolom < 10) {
          window.Aset.putar("sfx.klik");
          statusPeraga.kolom++;
          elNilaiKolom.textContent = statusPeraga.kolom;
          renderPeragaVisual();
        }
      });
    }
  }

  /* Inisialisasi Modul Belajar */
  function initBelajar() {
    bangunTabelPerkalian();
    bangunTabelPembagian();
    initKontrolPeraga();
    renderPeragaVisual();
  }

  var Belajar = {
    init: initBelajar,
    renderPeraga: renderPeragaVisual,
    sorotTabel: sorotTabel
  };

  window.Belajar = Belajar;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBelajar);
  } else {
    initBelajar();
  }
})();

