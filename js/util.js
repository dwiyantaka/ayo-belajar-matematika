/* js/util.js — Fungsi utilitas umum
   - Selektor elemen ($ dan $$)
   - Acak array atau rentang
   - Akses localStorage aman (try/catch)
*/
(function () {
  "use strict";

  /* Selektor DOM */
  function $(selektor, konteks) {
    return (konteks || document).querySelector(selektor);
  }

  function $$(selektor, konteks) {
    return Array.prototype.slice.call((konteks || document).querySelectorAll(selektor));
  }

  /* Pengacakan (Fisher-Yates) */
  function acak(daftar) {
    if (!Array.isArray(daftar)) return [];
    var salinan = daftar.slice();
    for (var i = salinan.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = salinan[i];
      salinan[i] = salinan[j];
      salinan[j] = temp;
    }
    return salinan;
  }

  /* Penyimpanan lokal aman */
  function simpan(kunci, nilai) {
    try {
      localStorage.setItem(kunci, JSON.stringify(nilai));
      return true;
    } catch (e) {
      console.warn("Gagal menyimpan ke localStorage:", kunci, e);
      return false;
    }
  }

  function baca(kunci, nilaiBawaan) {
    try {
      var item = localStorage.getItem(kunci);
      if (item === null || item === undefined) return nilaiBawaan;
      return JSON.parse(item);
    } catch (e) {
      console.warn("Gagal membaca dari localStorage:", kunci, e);
      return nilaiBawaan;
    }
  }

  function hapus(kunci) {
    try {
      localStorage.removeItem(kunci);
      return true;
    } catch (e) {
      console.warn("Gagal menghapus dari localStorage:", kunci, e);
      return false;
    }
  }

  /* Animasi Confetti Layar Penuh (Perayaan Menang/Selesai) */
  var animasiConfettiId = null;
  var partikelConfetti = [];

  function mulaiConfetti() {
    var canvas = document.getElementById("kanvas-confetti");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (animasiConfettiId) {
      cancelAnimationFrame(animasiConfettiId);
      animasiConfettiId = null;
    }

    var lebar = canvas.width = 1366;
    var tinggi = canvas.height = 768;

    // Palet warna perayaan kontras & meriah
    var warnaPilihan = [
      "#E5A93C", "#FFD700", "#C85A32", "#E06D43",
      "#2E6B3E", "#4CAF50", "#2B6CB0", "#4299E1",
      "#E53E3E", "#ED8936", "#9F7AEA", "#FFFFFF"
    ];

    partikelConfetti = [];
    var jumlahPartikel = 130;

    for (var i = 0; i < jumlahPartikel; i++) {
      partikelConfetti.push({
        x: Math.random() * lebar,
        y: (Math.random() * -tinggi * 1.2) - 10,
        w: 9 + Math.random() * 10,
        h: 12 + Math.random() * 14,
        warna: warnaPilihan[Math.floor(Math.random() * warnaPilihan.length)],
        kecepatanY: 2.2 + Math.random() * 4.2,
        kecepatanX: (Math.random() - 0.5) * 3.5,
        rotasi: Math.random() * 360,
        kecepatanRotasi: (Math.random() - 0.5) * 9,
        sudutOsilasi: Math.random() * Math.PI * 2,
        kecepatanOsilasi: 0.04 + Math.random() * 0.06,
        tipe: Math.random() > 0.35 ? "kotak" : "lingkaran"
      });
    }

    function render() {
      ctx.clearRect(0, 0, lebar, tinggi);

      for (var i = 0; i < partikelConfetti.length; i++) {
        var p = partikelConfetti[i];
        p.y += p.kecepatanY;
        p.sudutOsilasi += p.kecepatanOsilasi;
        p.x += p.kecepatanX + Math.sin(p.sudutOsilasi) * 2;
        p.rotasi += p.kecepatanRotasi;

        // Daur ulang partikel yang keluar dari batas bawah
        if (p.y > tinggi + 20) {
          p.y = -20 - Math.random() * 40;
          p.x = Math.random() * lebar;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotasi * Math.PI) / 180);
        ctx.fillStyle = p.warna;

        if (p.tipe === "lingkaran") {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }

        ctx.restore();
      }

      animasiConfettiId = requestAnimationFrame(render);
    }

    render();
  }

  function hentiConfetti() {
    if (animasiConfettiId) {
      cancelAnimationFrame(animasiConfettiId);
      animasiConfettiId = null;
    }
    var canvas = document.getElementById("kanvas-confetti");
    if (canvas) {
      var ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    partikelConfetti = [];
  }

  window.$ = $;
  window.$$ = $$;
  window.acak = acak;
  window.simpan = simpan;
  window.baca = baca;
  window.hapusStorage = hapus;
  window.Confetti = {
    mulai: mulaiConfetti,
    henti: hentiConfetti
  };
})();

