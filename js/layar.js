/* js/layar.js — Router layar dan penskalaan panggung 1366x768
   Mendukung docs/ALUR.md:
   - parameter asal ("onboarding" | "menu") untuk layar yang dipakai berulang (panduan, tujuan)
   - Layar.mulaiUlang() untuk aksi Keluar (reset sesi, tumpukan riwayat, kembali ke bumper)
   - Menu sebagai akar navigasi (Layar.kembali() tidak menyeberang dari menu ke onboarding)
*/
(function () {
  "use strict";

  var tumpukanRiwayat = [];
  var layarSekarang = null;
  var parameterAsal = {}; // namaLayar -> "onboarding" | "menu"

  var Layar = {
    /* Menampilkan layar berdasarkan nama ID: "menu", "bumper", dsb. */
    tampil: function (nama, simpanRiwayat, asal) {
      if (simpanRiwayat === undefined) simpanRiwayat = true;

      var target = document.getElementById("layar-" + nama);
      if (!target) {
        console.warn("Layar tidak ditemukan: layar-" + nama);
        return;
      }

      function gantiLayarLangsung() {
        // Jika ada parameter asal, simpan
        if (asal) {
          parameterAsal[nama] = asal;
        }

        // Menu adalah akar navigasi (ALUR.md §2 & §3): bersihkan riwayat saat masuk menu
        if (nama === "menu") {
          tumpukanRiwayat = [];
        }

        var semuaLayar = document.querySelectorAll(".layar");
        for (var i = 0; i < semuaLayar.length; i++) {
          semuaLayar[i].hidden = true;
        }

        if (simpanRiwayat && layarSekarang && layarSekarang !== nama) {
          // Jangan simpan transisi ke menu di riwayat jika itu akan membalikkan ke onboarding
          tumpukanRiwayat.push(layarSekarang);
        }

        target.hidden = false;
        layarSekarang = nama;

        var asalAktif = parameterAsal[nama] || "menu";
        var isViaBumper = (asalAktif === "onboarding" || asalAktif === "bumper");

        /* Event kustom saat layar berganti */
        var detailEvent = {
          nama: nama,
          asal: asalAktif,
          viaBumper: isViaBumper
        };
        var ev = new CustomEvent("gantilayar", { detail: detailEvent });
        window.dispatchEvent(ev);
      }

      gantiLayarLangsung();
    },

    /* Mendapatkan mode asal dari layar saat ini */
    ambilAsal: function (nama) {
      return parameterAsal[nama || layarSekarang] || "menu";
    },

    /* Mengecek apakah layar diakses melalui alur bumper (onboarding) */
    isAksesBumper: function (nama) {
      var asal = parameterAsal[nama || layarSekarang];
      return (asal === "onboarding" || asal === "bumper");
    },

    /* Kembali ke layar sebelumnya di riwayat */
    kembali: function () {
      if (layarSekarang === "menu") {
        // Sesuai ALUR.md §2: tidak ada tombol kembali dari menu (menu adalah akar)
        return;
      }

      if (tumpukanRiwayat.length > 0) {
        var sebelumnya = tumpukanRiwayat.pop();
        Layar.tampil(sebelumnya, false);
      } else {
        Layar.tampil("menu", false);
      }
    },

    /* Langsung ke menu utama dan bersihkan riwayat */
    keMenu: function () {
      tumpukanRiwayat = [];
      Layar.tampil("menu", false);
    },

    /* Reset total untuk aksi Keluar (ALUR.md §2 no. 3) */
    mulaiUlang: function () {
      tumpukanRiwayat = [];
      parameterAsal = {};

      // Reset data pemain aktif dan skor sesi yang sedang berjalan
      if (window.PemainAktif) {
        window.PemainAktif.nama = "Siswa";
        window.PemainAktif.karakter = "anak1";
      }

      // Hentikan musik latar jika ada, mainkan bumper
      if (window.Aset) {
        window.Aset.henti("musik.latar");
        window.Aset.putar("musik.bumper");
      }

      // Pindahkan kembali ke bumper tanpa riwayat
      Layar.tampil("bumper", false);

      // Picu event kustom mulaiUlang agar modul game & app mereset state lokal sesi
      var ev = new CustomEvent("mulaiulang");
      window.dispatchEvent(ev);
    },

    /* Mengembalikan nama layar yang sedang aktif */
    aktif: function () {
      return layarSekarang;
    },

    /* Penskalaan panggung 1366x768 letterbox / tepat di tengah */
    sesuaikanSkala: function () {
      var panggung = document.getElementById("panggung");
      if (!panggung) return;

      var lebarDasar = 1366;
      var tinggiDasar = 768;
      var lebarJendela = window.innerWidth;
      var tinggiJendela = window.innerHeight;

      var skala = Math.min(lebarJendela / lebarDasar, tinggiJendela / tinggiDasar);
      panggung.style.transform = "translate(-50%, -50%) scale(" + skala + ")";
    },

    /* Inisialisasi pendengar event resize */
    init: function () {
      window.addEventListener("resize", Layar.sesuaikanSkala);
      window.addEventListener("orientationchange", function () {
        setTimeout(Layar.sesuaikanSkala, 100);
      });
      Layar.sesuaikanSkala();
    }
  };

  // Jalankan penskalaan seawal mungkin agar panggung langsung responsif
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", Layar.sesuaikanSkala);
  } else {
    Layar.sesuaikanSkala();
  }

  window.Layar = Layar;
})();
