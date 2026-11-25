/* js/app.js — Inisialisasi antarmuka, aset statis, dan alur navigasi (ALUR.md) */
(function () {
  "use strict";

  /* Status Pengguna & Karakter */
  var pemainAktif = {
    nama: "Siswa",
    karakter: "anak1"
  };

  /* Status Putaran Onboarding (ALUR.md §2 no. 4) */
  var putaranOnboarding = 0; // 0 = pertama kali, >=1 = setelah tombol Keluar

  /* Inisialisasi Elemen & Aset Statis */
  function pasangAsetStatis() {
    // 1. Ornamen Batik Atas & Bawah
    var elBorderAtas = document.getElementById("border-atas");
    if (elBorderAtas && !elBorderAtas.firstChild) {
      elBorderAtas.appendChild(window.Aset.img("ornamen.border-atas"));
    }
    var elBorderBawah = document.getElementById("border-bawah");
    if (elBorderBawah && !elBorderBawah.firstChild) {
      elBorderBawah.appendChild(window.Aset.img("ornamen.border-bawah"));
    }

    // Tirai Transisi Kiri & Kanan (T7)
    var elTiraiKiri = document.getElementById("tirai-kiri");
    if (elTiraiKiri && !elTiraiKiri.firstChild) {
      elTiraiKiri.appendChild(window.Aset.img("ornamen.tirai-kiri"));
    }
    var elTiraiKanan = document.getElementById("tirai-kanan");
    if (elTiraiKanan && !elTiraiKanan.firstChild) {
      elTiraiKanan.appendChild(window.Aset.img("ornamen.tirai-kanan"));
    }

    // 2. Ikon Navigasi (Kembali & Speaker)
    var wadahKembali = document.getElementById("ikon-wadah-kembali");
    if (wadahKembali && !wadahKembali.firstChild) {
      wadahKembali.appendChild(window.Aset.img("ui.ikon-kembali"));
    }
    perbaruiIkonSpeaker();

    // 3. Layar Bumper: Latar Bumper & 3 Makanan Jawa
    var wadahLatarBumper = document.getElementById("wadah-bumper-latar");
    if (wadahLatarBumper && !wadahLatarBumper.firstChild) {
      wadahLatarBumper.appendChild(window.Aset.img("ui.latar-bumper"));
    }
    var wadahMakanan = document.getElementById("wadah-bumper-makanan");
    if (wadahMakanan && !wadahMakanan.firstChild) {
      wadahMakanan.appendChild(window.Aset.img("makanan.klepon"));
      wadahMakanan.appendChild(window.Aset.img("makanan.getuk"));
      wadahMakanan.appendChild(window.Aset.img("makanan.cenil"));
    }

    // 4. Layar Nama: 4 Pilihan Karakter
    var wadahKarakter = document.getElementById("wadah-pilihan-karakter");
    if (wadahKarakter && !wadahKarakter.firstChild) {
      var daftarAnak = [
        { id: "anak1", label: "Karakter 1" },
        { id: "anak2", label: "Karakter 2" },
        { id: "anak3", label: "Karakter 3" },
        { id: "anak4", label: "Karakter 4" }
      ];
      daftarAnak.forEach(function (k) {
        var kartu = document.createElement("div");
        kartu.className = "kartu-karakter" + (k.id === pemainAktif.karakter ? " terpilih" : "");
        kartu.dataset.karakter = k.id;
        kartu.appendChild(window.Aset.img("karakter." + k.id));
        var label = document.createElement("div");
        label.className = "nama-karakter";
        label.textContent = k.label;
        kartu.appendChild(label);

        kartu.addEventListener("click", function () {
          var semua = wadahKarakter.querySelectorAll(".kartu-karakter");
          for (var j = 0; j < semua.length; j++) {
            semua[j].classList.remove("terpilih");
          }
          kartu.classList.add("terpilih");
          pemainAktif.karakter = k.id;
        });

        wadahKarakter.appendChild(kartu);
      });
    }

    // 5. Layar Profil Pengembang: Foto Profil 1–4
    for (var i = 1; i <= 4; i++) {
      var wadahProf = document.getElementById("wadah-profil-" + i);
      if (wadahProf && !wadahProf.firstChild) {
        wadahProf.appendChild(window.Aset.img("profil." + i));
      }
    }

    // 6. Kartu Menu Ruang Belajar: Gambar Perkalian & Pembagian
    var wImgKali = document.getElementById("wadah-img-belajar-kali");
    if (wImgKali && !wImgKali.firstChild && window.Aset) {
      wImgKali.appendChild(window.Aset.img("ui.perkalian"));
    }
    var wImgBagi = document.getElementById("wadah-img-belajar-bagi");
    if (wImgBagi && !wImgBagi.firstChild && window.Aset) {
      wImgBagi.appendChild(window.Aset.img("ui.pembagian"));
    }
  }

  /* Perbarui Tampilan Ikon Speaker Global */
  function perbaruiIkonSpeaker() {
    var wadah = document.getElementById("ikon-wadah-speaker");
    if (!wadah) return;
    while (wadah.firstChild) {
      wadah.removeChild(wadah.firstChild);
    }
    var suaraAktif = window.Aset.suara.musik || window.Aset.suara.sfx;
    var kunciIkon = suaraAktif ? "ui.ikon-speaker-on" : "ui.ikon-speaker-off";
    wadah.appendChild(window.Aset.img(kunciIkon));
  }

  /* Pasang Event Listener Interaksi Navigasi (Sesuai ALUR.md) */
  function pasangNavigasi() {
    // 1. START pada Bumper -> minta izin audio, lanjut ke panduan (onboarding)
    var btnStart = document.getElementById("btn-start");
    if (btnStart) {
      btnStart.addEventListener("click", function () {
        window.Aset.putar("sfx.klik");
        window.Aset.putar("musik.bumper");

        // Cek pengaturan guru: lewatiOnboarding
        var pengGuru = window.baca ? window.baca("abm.pengaturan", {}) : {};
        if (putaranOnboarding > 0 && pengGuru.lewatiOnboarding) {
          window.Layar.tampil("menu", true, "onboarding");
        } else {
          window.Layar.tampil("panduan", true, "onboarding");
        }
      });
    }

    // 2. Layar Panduan
    var btnPanduanKembali = document.getElementById("btn-panduan-kembali");
    if (btnPanduanKembali) {
      btnPanduanKembali.addEventListener("click", function () {
        window.Aset.putar("sfx.klik");
        var asal = window.Layar.ambilAsal("panduan");
        if (asal === "onboarding") {
          window.Layar.tampil("bumper", false);
        } else {
          window.Layar.tampil("menu", false);
        }
      });
    }

    var btnPanduanLanjut = document.getElementById("btn-panduan-lanjut");
    if (btnPanduanLanjut) {
      btnPanduanLanjut.addEventListener("click", function () {
        window.Aset.putar("sfx.klik");
        var asal = window.Layar.ambilAsal("panduan");
        if (asal === "onboarding") {
          window.Layar.tampil("tujuan", true, "onboarding");
        } else {
          window.Layar.tampil("menu", false);
        }
      });
    }

    var btnPanduanLewati = document.getElementById("btn-panduan-lewati");
    if (btnPanduanLewati) {
      btnPanduanLewati.addEventListener("click", function () {
        window.Aset.putar("sfx.klik");
        window.Layar.tampil("menu", true, "onboarding");
      });
    }

    // 3. Layar Tujuan Pembelajaran
    var btnTujuanKembali = document.getElementById("btn-tujuan-kembali");
    if (btnTujuanKembali) {
      btnTujuanKembali.addEventListener("click", function () {
        window.Aset.putar("sfx.klik");
        var asal = window.Layar.ambilAsal("tujuan");
        if (asal === "onboarding") {
          window.Layar.tampil("panduan", true, "onboarding");
        } else {
          window.Layar.tampil("menu", false);
        }
      });
    }

    var btnTujuanLanjut = document.getElementById("btn-tujuan-lanjut");
    if (btnTujuanLanjut) {
      btnTujuanLanjut.addEventListener("click", function () {
        window.Aset.putar("sfx.klik");
        var asal = window.Layar.ambilAsal("tujuan");
        if (asal === "onboarding") {
          // Langsung ke menu utama (layar nama & karakter ditiadakan)
          window.Layar.tampil("menu", true, "onboarding");
        } else {
          window.Layar.tampil("menu", false);
        }
      });
    }

    var btnTujuanLewati = document.getElementById("btn-tujuan-lewati");
    if (btnTujuanLewati) {
      btnTujuanLewati.addEventListener("click", function () {
        window.Aset.putar("sfx.klik");
        window.Layar.tampil("menu", true, "onboarding");
      });
    }

    // 4. Layar Nama: Tombol Kembali ke Tujuan & Tombol MULAI ke Menu
    var btnNamaKembali = document.getElementById("btn-nama-kembali");
    if (btnNamaKembali) {
      btnNamaKembali.addEventListener("click", function () {
        window.Aset.putar("sfx.klik");
        window.Layar.tampil("tujuan", true, "onboarding");
      });
    }

    var btnLanjutNama = document.getElementById("btn-lanjut-nama");
    var inputNama = document.getElementById("input-nama-pemain");
    if (btnLanjutNama) {
      btnLanjutNama.addEventListener("click", function () {
        window.Aset.putar("sfx.klik");
        var val = (inputNama && inputNama.value.trim()) || "Siswa";
        pemainAktif.nama = val;
        if (window.simpan) {
          window.simpan("abm.pemainAktif", pemainAktif);
        }
        window.Layar.tampil("menu");
      });
    }

    // 5. Tombol Navigasi Global (Kembali & Ke Menu) di Pojok Kiri Atas
    var btnKembali = document.getElementById("btn-kembali");
    if (btnKembali) {
      btnKembali.addEventListener("click", function () {
        window.Aset.putar("sfx.klik");
        window.Layar.kembali();
      });
    }

    var btnKeMenu = document.getElementById("btn-ke-menu");
    if (btnKeMenu) {
      btnKeMenu.addEventListener("click", function () {
        window.Aset.putar("sfx.klik");
        window.Layar.keMenu();
      });
    }

    // 6. Tombol Menu Utama (2 Kartu Besar: Ruang Belajar & Ruang Bermain)
    var btnMenuBelajar = document.getElementById("menu-btn-belajar");
    if (btnMenuBelajar) {
      btnMenuBelajar.addEventListener("click", function () {
        window.Aset.putar("sfx.klik");
        window.Layar.tampil("belajar");
      });
    }

    var btnMenuMain = document.getElementById("menu-btn-main");
    if (btnMenuMain) {
      btnMenuMain.addEventListener("click", function () {
        window.Aset.putar("sfx.klik");
        window.Layar.tampil("main");
      });
    }

    // 7. Modal Konfirmasi Keluar / Kembali ke Awal (ALUR.md §2 no. 3 & no. 5)
    var modalKeluar = document.getElementById("modal-konfirmasi-keluar");
    var btnKeluarTidak = document.getElementById("btn-keluar-tidak");
    var btnKeluarYa = document.getElementById("btn-keluar-ya");

    if (btnKeluarTidak && modalKeluar) {
      btnKeluarTidak.addEventListener("click", function () {
        window.Aset.putar("sfx.klik");
        modalKeluar.hidden = true;
      });
    }

    if (btnKeluarYa && modalKeluar) {
      btnKeluarYa.addEventListener("click", function () {
        window.Aset.putar("sfx.klik");
        modalKeluar.hidden = true;
        putaranOnboarding++;
        // Bersihkan input nama pemain
        if (inputNama) inputNama.value = "";
        // Panggil Layar.mulaiUlang()
        window.Layar.mulaiUlang();
      });
    }

    // Sub-tombol di Ruang Belajar & Ruang Bermain
    var tautanLain = [
      { id: "btn-ke-belajar-kali", layar: "belajar-kali" },
      { id: "btn-ke-belajar-bagi", layar: "belajar-bagi" }
    ];
    tautanLain.forEach(function (t) {
      var btn = document.getElementById(t.id);
      if (btn) {
        btn.addEventListener("click", function () {
          window.Aset.putar("sfx.klik");
          window.Layar.tampil(t.layar);
        });
      }
    });

    // Profil: Tab Halaman 1 dan 2
    var hal1 = document.getElementById("profil-hal-1");
    var hal2 = document.getElementById("profil-hal-2");
    var btnHal1 = document.getElementById("btn-profil-hal-1");
    var btnHal2 = document.getElementById("btn-profil-hal-2");

    if (btnHal1 && btnHal2 && hal1 && hal2) {
      btnHal1.addEventListener("click", function () {
        window.Aset.putar("sfx.klik");
        hal1.hidden = false;
        hal2.hidden = true;
        btnHal1.style.background = "var(--terakota)";
        btnHal2.style.background = "var(--soga)";
      });
      btnHal2.addEventListener("click", function () {
        window.Aset.putar("sfx.klik");
        hal1.hidden = true;
        hal2.hidden = false;
        btnHal1.style.background = "var(--soga)";
        btnHal2.style.background = "var(--terakota)";
      });
    }

    // Modal Speaker & Pengaturan Suara
    var modalSuara = document.getElementById("modal-suara");
    var btnSpeaker = document.getElementById("btn-speaker");
    var btnTutupSuara = document.getElementById("btn-tutup-suara");
    var toggleMusik = document.getElementById("toggle-musik");
    var toggleSfx = document.getElementById("toggle-sfx");

    function sinkronkanTombolToggle() {
      if (toggleMusik) {
        toggleMusik.textContent = window.Aset.suara.musik ? "ON" : "OFF";
        toggleMusik.className = "tombol-toggle" + (window.Aset.suara.musik ? "" : " mati");
      }
      if (toggleSfx) {
        toggleSfx.textContent = window.Aset.suara.sfx ? "ON" : "OFF";
        toggleSfx.className = "tombol-toggle" + (window.Aset.suara.sfx ? "" : " mati");
      }
      perbaruiIkonSpeaker();
    }

    if (btnSpeaker) {
      btnSpeaker.addEventListener("click", function () {
        // Toggle Bisu Cepat (Mute / Unmute Global)
        var semuaMati = !window.Aset.suara.musik && !window.Aset.suara.sfx;
        if (semuaMati) {
          window.Aset.atur("musik", true);
          window.Aset.atur("sfx", true);
          window.Aset.putar("sfx.klik");
        } else {
          window.Aset.putar("sfx.klik");
          window.Aset.atur("musik", false);
          window.Aset.atur("sfx", false);
        }
        sinkronkanTombolToggle();
      });
    }

    if (btnTutupSuara && modalSuara) {
      btnTutupSuara.addEventListener("click", function () {
        window.Aset.putar("sfx.klik");
        modalSuara.hidden = true;
      });
    }

    if (toggleMusik) {
      toggleMusik.addEventListener("click", function () {
        window.Aset.atur("musik", !window.Aset.suara.musik);
        sinkronkanTombolToggle();
      });
    }

    if (toggleSfx) {
      toggleSfx.addEventListener("click", function () {
        window.Aset.atur("sfx", !window.Aset.suara.sfx);
        sinkronkanTombolToggle();
      });
    }
  }

  /* Sesuaikan Tampilan Layar Sesuai Alur Dinamis (ALUR.md) */
  function sesuaikanLayarDinamis(namaLayar, asal) {
    var navGlobal = document.getElementById("nav-global");

    // Layar Panduan
    if (namaLayar === "panduan") {
      var btnPanduanKembali = document.getElementById("btn-panduan-kembali");
      var btnPanduanLanjut = document.getElementById("btn-panduan-lanjut");
      var btnPanduanLewati = document.getElementById("btn-panduan-lewati");

      if (asal === "onboarding") {
        if (btnPanduanKembali) btnPanduanKembali.textContent = "Kembali ke Awal";
        if (btnPanduanLanjut) btnPanduanLanjut.hidden = false;
        if (btnPanduanLewati) btnPanduanLewati.hidden = (putaranOnboarding === 0);
      } else {
        // Mode menu: tombol kembali langsung ke menu, sembunyikan lanjut & lewati
        if (btnPanduanKembali) btnPanduanKembali.textContent = "Kembali ke Menu";
        if (btnPanduanLanjut) btnPanduanLanjut.hidden = true;
        if (btnPanduanLewati) btnPanduanLewati.hidden = true;
      }
    }

    // Layar Tujuan
    if (namaLayar === "tujuan") {
      var btnTujuanKembali = document.getElementById("btn-tujuan-kembali");
      var btnTujuanLanjut = document.getElementById("btn-tujuan-lanjut");
      var btnTujuanLewati = document.getElementById("btn-tujuan-lewati");

      if (asal === "onboarding") {
        if (btnTujuanKembali) btnTujuanKembali.textContent = "Kembali";
        if (btnTujuanLanjut) {
          btnTujuanLanjut.textContent = "Mulai Belajar";
          btnTujuanLanjut.hidden = false;
        }
        if (btnTujuanLewati) btnTujuanLewati.hidden = (putaranOnboarding === 0);
      } else {
        // Mode menu: tombol kembali langsung ke menu, sembunyikan lanjut & lewati
        if (btnTujuanKembali) btnTujuanKembali.textContent = "Kembali ke Menu";
        if (btnTujuanLanjut) btnTujuanLanjut.hidden = true;
        if (btnTujuanLewati) btnTujuanLewati.hidden = true;
      }
    }

    // Visibilitas Bilah Navigasi Global (Pojok Kiri Atas), Speaker Global (Pojok Kanan Atas), dan Border Batik
    // Sesuai permintaan: di layar bumper, HANYA tombol MULAI yang tampil.
    var bilahSuara = document.getElementById("bilah-suara-global");
    if (bilahSuara) {
      bilahSuara.hidden = (namaLayar === "bumper");
    }

    var elBorderAtas = document.getElementById("border-atas");
    if (elBorderAtas) elBorderAtas.hidden = (namaLayar === "bumper");
    var elBorderBawah = document.getElementById("border-bawah");
    if (elBorderBawah) elBorderBawah.hidden = (namaLayar === "bumper");

    if (!navGlobal) return;
    if (namaLayar === "bumper" || namaLayar === "nama" || namaLayar === "menu" || asal === "onboarding") {
      navGlobal.hidden = true;
    } else {
      navGlobal.hidden = false;
      var btnKeMenu = document.getElementById("btn-ke-menu");
      if (btnKeMenu) {
        btnKeMenu.hidden = false;
      }
    }
  }

  /* Titik Masuk Utama Aplikasi */
  function mulai() {
    if (window.Layar) {
      window.Layar.init();
      pasangAsetStatis();
      pasangNavigasi();

      window.addEventListener("gantilayar", function (e) {
        sesuaikanLayarDinamis(e.detail.nama, e.detail.asal);

        // Putar musik latar lembut setelah melewati bumper (misal di panduan, menu, bermain, dll)
        if (e.detail.nama !== "bumper") {
          window.Aset.putar("musik.latar");
        } else {
          window.Aset.henti("musik.latar");
        }
      });

      // Tampilkan layar awal bumper
      window.Layar.tampil("bumper", false);
      sesuaikanLayarDinamis("bumper", "onboarding");
    }
  }

  window.PemainAktif = pemainAktif;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mulai);
  } else {
    mulai();
  }
})();
