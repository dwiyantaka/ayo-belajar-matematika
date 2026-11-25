/* js/menu-hamburger.js — Pengontrol Drawer Panel Hamburger
   Sesuai ALUR.md & PRD (FR-03, FR-04):
   - Menu Utama hanya 2 kartu (Ruang Belajar & Ruang Bermain)
   - Tombol hamburger "☰ Menu" aktif di layar 'menu' dan 'belajar'
   - Panel overlay berisi Bantuan (Tujuan, Panduan), Pengaturan (Suara, Akses Guru, Profil), dan Kembali ke awal
   - Aksesibilitas: buka/tutup via tombol X, klik backdrop luar, tombol Esc, dan manajemen fokus keyboard
*/
(function () {
  "use strict";

  var panelModal = null;
  var btnTrigger = null;
  var btnTutup = null;
  var elemenFokusSebelumnya = null;

  var timeoutTutup = null;

  function bukaPanel() {
    if (!panelModal) return;
    if (timeoutTutup) { clearTimeout(timeoutTutup); timeoutTutup = null; }
    if (window.Aset) window.Aset.putar("sfx.klik");
    elemenFokusSebelumnya = document.activeElement;
    panelModal.hidden = false;
    // Force layout / reflow agar transisi dari translateX(100%) berjalan sempurna
    void panelModal.offsetWidth;
    panelModal.classList.add("terbuka");

    // Pindahkan fokus ke tombol tutup X atau item pertama
    if (btnTutup) {
      btnTutup.focus();
    }
  }

  function tutupPanel() {
    if (!panelModal || panelModal.hidden) return;
    panelModal.classList.remove("terbuka");
    if (timeoutTutup) clearTimeout(timeoutTutup);
    timeoutTutup = setTimeout(function () {
      panelModal.hidden = true;
      timeoutTutup = null;
    }, 450);

    // Kembalikan fokus ke tombol hamburger
    if (btnTrigger) {
      try { btnTrigger.focus(); } catch (e) { }
    } else if (elemenFokusSebelumnya) {
      try { elemenFokusSebelumnya.focus(); } catch (e) { }
    }
  }

  function perbaruiVisibilitas(namaLayar) {
    if (!btnTrigger) return;
    // Hamburger HANYA aktif di menu utama dan Ruang Belajar (ALUR.md §2 no. 3)
    if (namaLayar === "menu" || namaLayar === "belajar") {
      btnTrigger.hidden = false;
    } else {
      btnTrigger.hidden = true;
      tutupPanel(); // Tutup panel jika layar berpindah ke tempat lain
    }
  }

  function init() {
    panelModal = document.getElementById("panel-hamburger");
    btnTrigger = document.getElementById("btn-hamburger");
    btnTutup = document.getElementById("btn-tutup-hamburger");

    // Pasang ikon hamburger & tutup jika wadah ada
    var wadahIkonHb = document.getElementById("ikon-wadah-hamburger");
    if (wadahIkonHb && !wadahIkonHb.firstChild && window.Aset) {
      wadahIkonHb.appendChild(window.Aset.img("ui.ikon-humberger"));
    }
    var wadahIkonTutup = document.getElementById("ikon-wadah-tutup-hamburger");
    if (wadahIkonTutup && !wadahIkonTutup.firstChild && window.Aset) {
      wadahIkonTutup.appendChild(window.Aset.img("ui.ikon-close"));
    }

    // Pasang ikon-ikon item di panel
    var petaIkonItem = [
      { id: "ikon-hb-tujuan", kunci: "ui.ikon-tujuan" },
      { id: "ikon-hb-panduan", kunci: "ui.ikon-bantuan" },
      { id: "ikon-hb-suara", kunci: "ui.ikon-pengaturan" },
      { id: "ikon-hb-guru", kunci: "ui.ikon-gembok" },
      { id: "ikon-hb-profil", kunci: "ui.ikon-profil" },
      { id: "ikon-hb-keluar", kunci: "ui.ikon-keluar" }
    ];
    petaIkonItem.forEach(function (item) {
      var el = document.getElementById(item.id);
      if (el && !el.firstChild && window.Aset) {
        el.appendChild(window.Aset.img(item.kunci));
      }
    });

    if (btnTrigger) {
      btnTrigger.addEventListener("click", function (e) {
        e.stopPropagation();
        if (panelModal && !panelModal.hidden) {
          tutupPanel();
        } else {
          bukaPanel();
        }
      });
    }

    if (btnTutup) {
      btnTutup.addEventListener("click", function () {
        if (window.Aset) window.Aset.putar("sfx.klik");
        tutupPanel();
      });
    }

    // Klik di area backdrop luar panel untuk menutup
    if (panelModal) {
      panelModal.addEventListener("click", function (e) {
        if (e.target === panelModal) {
          if (window.Aset) window.Aset.putar("sfx.klik");
          tutupPanel();
        }
      });
    }

    // Tombol Esc menutup panel
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" || e.keyCode === 27) {
        if (panelModal && !panelModal.hidden) {
          tutupPanel();
        }
      }
    });

    // Event pergantian layar
    window.addEventListener("gantilayar", function (e) {
      perbaruiVisibilitas(e.detail.nama);
    });

    // Pemasangan aksi tombol-tombol di dalam panel hamburger
    var aksiMenu = [
      {
        id: "btn-hb-tujuan",
        aksi: function () {
          window.Layar.tampil("tujuan", true, "menu");
        }
      },
      {
        id: "btn-hb-panduan",
        aksi: function () {
          window.Layar.tampil("panduan", true, "menu");
        }
      },
      {
        id: "btn-hb-suara",
        aksi: function () {
          // Buka modal pengaturan suara rinci
          var modalSuara = document.getElementById("modal-suara");
          if (modalSuara) {
            modalSuara.hidden = false;
            // Sinkronkan tampilan toggle
            var tm = document.getElementById("toggle-musik");
            var ts = document.getElementById("toggle-sfx");
            if (tm && window.Aset) {
              tm.textContent = window.Aset.suara.musik ? "ON" : "OFF";
              tm.className = "tombol-toggle" + (window.Aset.suara.musik ? "" : " mati");
            }
            if (ts && window.Aset) {
              ts.textContent = window.Aset.suara.sfx ? "ON" : "OFF";
              ts.className = "tombol-toggle" + (window.Aset.suara.sfx ? "" : " mati");
            }
          }
        }
      },
      {
        id: "btn-hb-guru",
        aksi: function () {
          window.Layar.tampil("guru-pin", true, "menu");
        }
      },
      {
        id: "btn-hb-profil",
        aksi: function () {
          window.Layar.tampil("profil", true, "menu");
        }
      },
      {
        id: "btn-hb-kembali-awal",
        aksi: function () {
          // Tampilkan modal konfirmasi kembali ke awal
          var modalKeluar = document.getElementById("modal-konfirmasi-keluar");
          if (modalKeluar) modalKeluar.hidden = false;
        }
      },
      {
        id: "btn-hb-keluar",
        aksi: function () {
          // Tampilkan modal konfirmasi keluar / kembali ke awal
          var modalKeluar = document.getElementById("modal-konfirmasi-keluar");
          if (modalKeluar) modalKeluar.hidden = false;
        }
      }
    ];

    aksiMenu.forEach(function (m) {
      var b = document.getElementById(m.id);
      if (b) {
        b.addEventListener("click", function () {
          if (window.Aset) window.Aset.putar("sfx.klik");
          tutupPanel();
          m.aksi();
        });
      }
    });
  }

  window.MenuHamburger = {
    init: init,
    buka: bukaPanel,
    tutup: tutupPanel,
    perbaruiVisibilitas: perbaruiVisibilitas
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
