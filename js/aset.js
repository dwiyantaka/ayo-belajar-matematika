/* Pemuat aset. Memakai kunci dari assets/manifest.js.
   Berkas yang belum ada otomatis diganti placeholder (gambar) atau diam (audio).
   Tidak perlu diubah saat mengganti aset. */
(function () {
  "use strict";
  var M = window.ASET_MANIFEST || { versi: 1, gambar: {}, audio: {}, narasiFolder: "" };
  var daftarHilang = {};
  var audioCache = {};

  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function ver(url) { return url + "?v=" + M.versi; }

  /* Gambar pengganti bila berkas belum ada */
  function placeholder(label, kunci) {
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">' +
      '<rect x="6" y="6" width="244" height="244" rx="28" fill="#F0CD66" stroke="#6B3F1D" stroke-width="6" stroke-dasharray="14 8"/>' +
      '<text x="128" y="124" font-family="sans-serif" font-size="24" font-weight="700" text-anchor="middle" fill="#6B3F1D">' + esc(label) + '</text>' +
      '<text x="128" y="156" font-family="sans-serif" font-size="14" text-anchor="middle" fill="#6B3F1D">' + esc(kunci) + '</text></svg>';
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  /* Ambil status audio dari localStorage jika ada */
  var suaraAwal = { musik: true, sfx: true };
  try {
    var tersimpan = localStorage.getItem("abm.suara");
    if (tersimpan) {
      var parsed = JSON.parse(tersimpan);
      if (parsed && typeof parsed === "object") {
        suaraAwal.musik = parsed.musik !== undefined ? !!parsed.musik : true;
        suaraAwal.sfx = parsed.sfx !== undefined ? !!parsed.sfx : true;
      }
    }
  } catch (err) {}

  var Aset = {
    suara: suaraAwal,

    url: function (kunci) {
      var e = M.gambar[kunci];
      return e ? ver(e.file) : placeholder(kunci, kunci);
    },

    /* <img> dengan fallback placeholder otomatis */
    img: function (kunci, kelas) {
      var e = M.gambar[kunci];
      var el = new Image();
      el.alt = e ? e.label : kunci;
      el.draggable = false;
      if (kelas) el.className = kelas;
      if (!e) { daftarHilang[kunci] = true; el.src = placeholder(kunci, kunci); return el; }
      el.onerror = function () {
        el.onerror = null;
        daftarHilang[kunci] = true;
        el.dataset.hilang = "1";
        el.src = placeholder(e.label, kunci);
      };
      el.src = ver(e.file);
      return el;
    },

    /* Ilustrasi Soal: memuat berkas gambar dari assets/ilustrasi-soal/ */
    ilustrasi: function (namaFile, kelas) {
      if (!namaFile) return null;
      var el = new Image();
      el.alt = "Ilustrasi Soal";
      el.draggable = false;
      el.className = kelas || "img-ilustrasi-soal";

      // Jika namaFile merupakan kunci manifest lama (mis. "makanan.klepon"), gunakan Aset.img fallback
      if (M.gambar[namaFile]) {
        return Aset.img(namaFile, kelas || "img-ilustrasi-soal");
      }

      var path = namaFile;
      if (!path.startsWith("assets/") && !path.startsWith("/") && !path.startsWith("http")) {
        path = "assets/ilustrasi-soal/" + namaFile;
      }

      el.src = ver(path);
      el.onerror = function () {
        el.onerror = null;
        el.dataset.hilang = "1";
        el.src = placeholder("Ilustrasi: " + namaFile, namaFile);
      };
      return el;
    },

    /* Susunan objek: baris = jumlah kelompok, kolom = isi tiap kelompok */
    susunan: function (kunciObjek, baris, kolom) {
      var wadah = document.createElement("div");
      wadah.className = "susunan";
      wadah.style.display = "grid";
      wadah.style.gridTemplateColumns = "repeat(" + kolom + ", 1fr)";
      for (var i = 0; i < baris * kolom; i++) {
        var im = Aset.img(kunciObjek, "susunan-ikon");
        wadah.appendChild(im);
      }
      return wadah;
    },

    /* Audio: aman bila berkas tidak ada */
    _ambil: function (kunci, file, ulang) {
      if (audioCache[kunci]) return audioCache[kunci];
      var au = new Audio();
      au.preload = "auto";
      au.loop = !!ulang;
      au.addEventListener("error", function () { au._rusak = true; });
      au.src = ver(file);
      audioCache[kunci] = au;
      return au;
    },
    _jenis: function (kunci) { return kunci.indexOf("musik.") === 0 ? "musik" : "sfx"; },
    putar: function (kunci) {
      var e = M.audio[kunci];
      if (!e || !Aset.suara[Aset._jenis(kunci)]) return;
      var au = Aset._ambil(kunci, e.file, e.ulang);
      if (au._rusak) return;
      // Jangan setel ulang au.currentTime bila audio yang sedang diputar sudah berjalan (misal musik latar saat ganti layar)
      if (Aset._jenis(kunci) === "musik" && !au.paused && au.currentTime > 0) {
        return;
      }
      try {
        if (Aset._jenis(kunci) !== "musik") {
          au.currentTime = 0;
        }
        var p = au.play();
        if (p && p.catch) p.catch(function () {});
      } catch (x) {}
    },
    henti: function (kunci) {
      var au = audioCache[kunci];
      if (au) { try { au.pause(); au.currentTime = 0; } catch (x) {} }
    },
    narasi: function () {},
    atur: function (jenis, nilai) {
      Aset.suara[jenis] = !!nilai;
      if (jenis === "musik") {
        if (!nilai) Aset.henti("musik.latar");
        else if (window.Layar && window.Layar.aktif && window.Layar.aktif() !== "bumper") Aset.putar("musik.latar");
      }
      try {
        localStorage.setItem("abm.suara", JSON.stringify(Aset.suara));
      } catch (err) {}
    },
    hilang: function () { return Object.keys(daftarHilang); },
    manifest: M
  };

  window.Aset = Aset;
})();
