/* js/game.js — Mesin Ruang Bermain: Tebak Jajan & Balap Becak (versi 2 - docs/BALAP-BECAK.md)
   1. Tebak Jajan:
      - Sendiri (skor 3/2/1 + hint) / Tim (bergantian, 1 poin tim)
      - Memakai BANK_SOAL (permainan:"tebak", 38 soal)
   2. Balap Becak:
      - 2 Pemain langsung lewat keyboard (Z/X vs ./);
      - Soal acak simbol dari GeneratorSoal.buat({ tabel, operasi, jumlahPilihan: 2 })
      - Sistem rebutan: benar maju 1 petak; salah terkunci ronde ini; kedua salah/waktu habis tidak maju
      - Pertama mencapai n petak (default 10) menang; batas waktu ronde (default 15 detik / tanpa batas)
*/
(function () {
  "use strict";

  /* =========================================================================
     STATE APLIKASI
     ========================================================================= */
  var state = {
    permainan: "tebak", // "tebak" | "balap"
    tebak: {
      cara: "sendiri",  // "sendiri" | "tim"
      topik: "kali",    // "kali" | "bagi" | "campur"
      level: 1,         // 1 | 2 | 3
      daftarSoal: [],
      indeksSoal: 0,
      soalAktif: null,
      percobaan: 0,
      skorTotal: 0,
      jumlahBenar: 0,
      faktaSulit: [],
      sedangMenilai: false,
      waktuMulai: null,
      // Khusus Tebak Jajan Mode Tim
      jumlahTim: 2,
      daftarTim: [
        { id: 1, nama: "Tim 1", skor: 0 },
        { id: 2, nama: "Tim 2", skor: 0 }
      ],
      giliranTim: 0
    },
    balap: {
      namaP1: "Pemain 1",
      namaP2: "Pemain 2",
      operasi: "campur", // default acak perkalian & pembagian fakta dasar
      tabelPilihan: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // semua tabel 1-10
      targetPetak: 10,  // default 10 (guru bisa ubah 8/10/12)
      waktuRonde: 15,   // detik (default 15, bisa 10/15/20/0 tanpa batas)
      posisiP1: 0,
      posisiP2: 0,
      benarP1: 0,
      benarP2: 0,
      faktaSalah: [],
      soalAktif: null,
      pilihanKiri: null,
      pilihanKanan: null,
      terkunciP1: false,
      terkunciP2: false,
      sedangTransisi: false,
      timerId: null,
      sisaWaktu: 15,
      waktuMulai: null
    }
  };

  /* Helper ambil BANK_SOAL */
  function ambilBankSoalTebak() {
    var dasar = (window.BANK_SOAL && Array.isArray(window.BANK_SOAL)) ? window.BANK_SOAL : [];
    var soalGuru = window.baca ? window.baca("abm.soalGuru", null) : null;
    if (!soalGuru) return dasar;

    var hasil = [];
    var petaUbah = soalGuru.ubah || {};
    var daftarHapus = new Set(soalGuru.hapus || []);

    dasar.forEach(function (s) {
      if (daftarHapus.has(s.id)) return;
      if (petaUbah[s.id]) hasil.push(petaUbah[s.id]);
      else hasil.push(s);
    });

    if (Array.isArray(soalGuru.tambah)) {
      soalGuru.tambah.forEach(function (s) { hasil.push(s); });
    }
    return hasil;
  }

  function pesanAcak(kategori) {
    var daftar = (window.PESAN && window.PESAN[kategori]) ? window.PESAN[kategori] : [];
    if (!daftar.length) {
      if (kategori === "benar") return "Selamat jawabanmu benar!";
      if (kategori === "salah") return "Tetap semangat dan ulangi lagi";
      return "Mari lanjut!";
    }
    return daftar[Math.floor(Math.random() * daftar.length)];
  }

  /* =========================================================================
     1. TEBAK JAJAN (SENDIRI / LEVEL-BASED)
     ========================================================================= */
  function siapkanSoalTebak() {
    var semua = ambilBankSoalTebak();
    var peng = (window.baca && window.baca("abm.pengaturan", {})) || {};
    var targetJml = Number(peng.jumlahSoal) || 10;

    // Saring berdasarkan level yang dipilih (mencakup perkalian dan pembagian)
    var tersaring = semua.filter(function (s) {
      return s.level === state.tebak.level;
    });

    if (tersaring.length < targetJml) {
      // Jika soal kurang dari target pada level tersebut, lengkapi dengan soal level lain
      var sisa = semua.filter(function (s) {
        return s.level !== state.tebak.level;
      });
      var acakSisa = window.acak ? window.acak(sisa) : sisa.slice();
      tersaring = tersaring.concat(acakSisa);
    }

    var acakUrutan = window.acak ? window.acak(tersaring) : tersaring.slice();
    state.tebak.cara = "sendiri"; // Mode tetap bermain sendiri
    state.tebak.daftarSoal = acakUrutan.slice(0, targetJml);
    state.tebak.indeksSoal = 0;
    state.tebak.skorTotal = 0;
    state.tebak.jumlahBenar = 0;
    state.tebak.faktaSulit = [];
    state.tebak.waktuMulai = Date.now();
  }

  function muatSoalTebak() {
    state.tebak.percobaan = 1;
    state.tebak.sedangMenilai = false;
    state.tebak.soalAktif = state.tebak.daftarSoal[state.tebak.indeksSoal];

    if (!state.tebak.soalAktif) {
      selesaiTebakJajan();
      return;
    }

    var banner = document.getElementById("kuis-banner-umpan-balik");
    if (banner) banner.hidden = true;

    // Nomor Soal & Skor
    var elNomor = document.getElementById("kuis-nomor-soal");
    if (elNomor) elNomor.textContent = "Soal " + (state.tebak.indeksSoal + 1) + " / " + state.tebak.daftarSoal.length;

    var elSkor = document.getElementById("kuis-skor-saat-ini");
    var elGiliran = document.getElementById("tebak-giliran-tim");
    var wadahPapanTim = document.getElementById("wadah-papan-skor-tebak-tim");

    if (state.tebak.cara === "sendiri") {
      if (elSkor) { elSkor.style.display = "block"; elSkor.textContent = "Skor: " + state.tebak.skorTotal; }
      if (elGiliran) elGiliran.style.display = "none";
      if (wadahPapanTim) wadahPapanTim.style.display = "none";
    } else {
      if (elSkor) elSkor.style.display = "none";
      if (elGiliran) {
        elGiliran.style.display = "block";
        var tAktif = state.tebak.daftarTim[state.tebak.giliranTim];
        elGiliran.textContent = "Giliran: " + (tAktif ? tAktif.nama : "Tim");
      }
      if (wadahPapanTim) {
        wadahPapanTim.style.display = "block";
        renderPapanSkorTebakTim();
      }
    }

    // Teks Soal & Visual
    var elTeks = document.getElementById("kuis-teks-soal");
    if (elTeks) elTeks.textContent = state.tebak.soalAktif.teks;

    var wadahVisual = document.getElementById("kuis-visual-soal");
    if (wadahVisual) {
      while (wadahVisual.firstChild) wadahVisual.removeChild(wadahVisual.firstChild);
      var namaIlustrasi = state.tebak.soalAktif.ilustrasi || state.tebak.soalAktif.objek;
      if (namaIlustrasi && window.Aset && window.Aset.ilustrasi) {
        var elImg = window.Aset.ilustrasi(namaIlustrasi);
        if (elImg) {
          wadahVisual.appendChild(elImg);
          wadahVisual.style.display = "flex";
        } else {
          wadahVisual.style.display = "none";
        }
      } else if (state.tebak.soalAktif.objek && state.tebak.soalAktif.susunan) {
        var grid = window.Aset.susunan(
          state.tebak.soalAktif.objek,
          state.tebak.soalAktif.susunan.baris,
          state.tebak.soalAktif.susunan.kolom
        );
        wadahVisual.appendChild(grid);
        wadahVisual.style.display = "flex";
      } else {
        wadahVisual.style.display = "none";
      }
    }

    // Pilihan Jawaban
    var wadahPilihan = document.getElementById("kuis-pilihan-jawaban");
    if (wadahPilihan) {
      while (wadahPilihan.firstChild) wadahPilihan.removeChild(wadahPilihan.firstChild);
      var pilAcak = window.acak ? window.acak(state.tebak.soalAktif.pilihan) : state.tebak.soalAktif.pilihan.slice();
      pilAcak.forEach(function (val) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "tombol-pilihan";
        btn.textContent = val;
        btn.addEventListener("click", function () {
          evaluasiJawabanTebak(val, btn);
        });
        wadahPilihan.appendChild(btn);
      });
    }
  }

  function renderPapanSkorTebakTim() {
    var wadah = document.getElementById("wadah-kartu-papan-skor");
    if (!wadah) return;
    while (wadah.firstChild) wadah.removeChild(wadah.firstChild);

    state.tebak.daftarTim.forEach(function (tim, idx) {
      var kartu = document.createElement("div");
      kartu.className = "kartu-tim-skor" + (idx === state.tebak.giliranTim ? " giliran-aktif" : "");
      var nama = document.createElement("span");
      nama.className = "nama-tim";
      nama.textContent = tim.nama;
      var nilai = document.createElement("span");
      nilai.className = "nilai-tim";
      nilai.textContent = tim.skor + " Poin";
      kartu.appendChild(nama);
      kartu.appendChild(nilai);
      wadah.appendChild(kartu);
    });
  }

  function evaluasiJawabanTebak(jawaban, btnEl) {
    if (state.tebak.sedangMenilai) return;
    state.tebak.sedangMenilai = true;

    var s = state.tebak.soalAktif;
    var benar = (Number(jawaban) === Number(s.kunci));
    var banner = document.getElementById("kuis-banner-umpan-balik");
    var popup = document.getElementById("kuis-popup-konten");
    var ikonWadah = document.getElementById("kuis-ikon-status");
    var teksUtama = document.getElementById("kuis-teks-status");
    var teksBantuan = document.getElementById("kuis-teks-bantuan");
    var btnLanjut = document.getElementById("btn-kuis-lanjut");

    if (ikonWadah) while (ikonWadah.firstChild) ikonWadah.removeChild(ikonWadah.firstChild);

    if (state.tebak.cara === "sendiri") {
      // Main Sendiri: skor bertingkat 3/2/1 + hint
      if (benar) {
        window.Aset.putar("sfx.benar");
        btnEl.classList.add("status-benar");
        var poin = (state.tebak.percobaan === 1) ? 3 : (state.tebak.percobaan === 2) ? 2 : 1;
        state.tebak.skorTotal += poin;
        state.tebak.jumlahBenar++;

        var elSkor = document.getElementById("kuis-skor-saat-ini");
        if (elSkor) elSkor.textContent = "Skor: " + state.tebak.skorTotal;

        if (popup) popup.className = "popup-umpan-balik tema-benar";
        if (banner) banner.hidden = false;
        if (ikonWadah) ikonWadah.appendChild(window.Aset.img("ui.ikon-benar"));
        if (teksUtama) teksUtama.textContent = "Horee, jawaban kamu benar!";
        if (teksBantuan) teksBantuan.textContent = "(+" + poin + " Poin) " + (s.penjelasan || "");

        kunciPilihanTebak(true);
        if (btnLanjut) {
          btnLanjut.textContent = "Lanjut soal";
          btnLanjut.onclick = function () {
            if (banner) banner.hidden = true;
            state.tebak.indeksSoal++;
            muatSoalTebak();
          };
        }
      } else {
        window.Aset.putar("sfx.salah");
        btnEl.classList.add("status-salah");
        btnEl.disabled = true;

        if (state.tebak.percobaan < 3) {
          state.tebak.percobaan++;
          state.tebak.sedangMenilai = false;
          if (popup) popup.className = "popup-umpan-balik tema-salah";
          if (banner) banner.hidden = false;
          if (ikonWadah) ikonWadah.appendChild(window.Aset.img("ui.ikon-salah"));
          if (teksUtama) teksUtama.textContent = "Yahh, jawaban kamu salah nih";
          if (teksBantuan) teksBantuan.textContent = "Petunjuk: " + (s.hint || "Hitung kembali per kelompok.");

          if (btnLanjut) {
            btnLanjut.textContent = "Coba lagi";
            btnLanjut.onclick = function () {
              if (banner) banner.hidden = true;
            };
          }
        } else {
          var fakta = s.penjelasan || (s.operan[0] + (s.operasi === "kali" ? " × " : " : ") + s.operan[1] + " = " + s.kunci);
          state.tebak.faktaSulit.push(fakta);
          kunciPilihanTebak(true);

          if (popup) popup.className = "popup-umpan-balik tema-salah";
          if (banner) banner.hidden = false;
          if (ikonWadah) ikonWadah.appendChild(window.Aset.img("ui.ikon-salah"));
          if (teksUtama) teksUtama.textContent = "Yahh, jawaban kamu salah nih";
          if (teksBantuan) teksBantuan.textContent = "Jawaban yang benar adalah " + s.kunci + " (" + (s.penjelasan || fakta) + ")";

          if (btnLanjut) {
            btnLanjut.textContent = "Lanjut soal";
            btnLanjut.onclick = function () {
              if (banner) banner.hidden = true;
              state.tebak.indeksSoal++;
              muatSoalTebak();
            };
          }
        }
      }
    } else {
      // Main Tim: tim bergantian, benar = 1 poin tim
      var tAktif = state.tebak.daftarTim[state.tebak.giliranTim];
      kunciPilihanTebak(true);

      if (benar) {
        window.Aset.putar("sfx.benar");
        btnEl.classList.add("status-benar");
        if (tAktif) tAktif.skor += 1;
        renderPapanSkorTebakTim();

        if (popup) popup.className = "popup-umpan-balik tema-benar";
        if (banner) banner.hidden = false;
        if (ikonWadah) ikonWadah.appendChild(window.Aset.img("ui.ikon-benar"));
        if (teksUtama) teksUtama.textContent = "Horee, jawaban kamu benar!";
        if (teksBantuan) teksBantuan.textContent = (tAktif ? tAktif.nama : "Tim") + " (+1 Poin) - " + (s.penjelasan || "");
      } else {
        window.Aset.putar("sfx.salah");
        btnEl.classList.add("status-salah");
        if (popup) popup.className = "popup-umpan-balik tema-salah";
        if (banner) banner.hidden = false;
        if (ikonWadah) ikonWadah.appendChild(window.Aset.img("ui.ikon-salah"));
        if (teksUtama) teksUtama.textContent = "Yahh, jawaban kamu salah nih";
        if (teksBantuan) teksBantuan.textContent = "Kunci jawaban: " + s.kunci + " (" + (s.penjelasan || "") + ")";
      }

      if (btnLanjut) {
        btnLanjut.textContent = "Lanjut soal";
        btnLanjut.onclick = function () {
          if (banner) banner.hidden = true;
          state.tebak.giliranTim = (state.tebak.giliranTim + 1) % state.tebak.jumlahTim;
          state.tebak.indeksSoal++;
          muatSoalTebak();
        };
      }
    }
  }

  function kunciPilihanTebak(kunci) {
    var btns = document.querySelectorAll("#kuis-pilihan-jawaban .tombol-pilihan");
    for (var i = 0; i < btns.length; i++) btns[i].disabled = kunci;
  }

  function selesaiTebakJajan() {
    window.Aset.putar("sfx.menang");
    var durasi = Math.round((Date.now() - (state.tebak.waktuMulai || Date.now())) / 1000);
    var elNama = document.getElementById("hasil-selamat-nama");
    var elTotal = document.getElementById("hasil-total-skor");
    var elRekap = document.getElementById("hasil-jumlah-benar");
    var wadahSulit = document.getElementById("hasil-wadah-sulit");
    var daftarSulit = document.getElementById("hasil-daftar-sulit");

    if (state.tebak.cara === "sendiri") {
      var namaPemain = (window.PemainAktif && window.PemainAktif.nama) || "Siswa";
      if (elNama) elNama.textContent = "Hebat, " + namaPemain + "!";
      if (elTotal) elTotal.textContent = state.tebak.skorTotal;
      if (elRekap) elRekap.textContent = state.tebak.jumlahBenar + " / " + state.tebak.daftarSoal.length;

      var entri = {
        pemain: namaPemain,
        kelompok: null,
        permainan: "tebak",
        mode: "sendiri",
        topik: state.tebak.topik,
        level: state.tebak.level,
        tanggal: new Date().toISOString(),
        benar: state.tebak.jumlahBenar,
        total: state.tebak.daftarSoal.length,
        skor: state.tebak.skorTotal,
        durasiDetik: durasi
      };
      if (window.Skor && window.Skor.simpanRiwayat) window.Skor.simpanRiwayat(entri);

      if (wadahSulit && daftarSulit) {
        while (daftarSulit.firstChild) daftarSulit.removeChild(daftarSulit.firstChild);
        if (state.tebak.faktaSulit.length > 0) {
          wadahSulit.hidden = false;
          state.tebak.faktaSulit.forEach(function (f) {
            var chip = document.createElement("div");
            chip.className = "chip-fakta";
            chip.textContent = f;
            daftarSulit.appendChild(chip);
          });
        } else {
          wadahSulit.hidden = true;
        }
      }
    } else {
      // Main Tim
      if (wadahSulit) wadahSulit.hidden = true;
      var urut = state.tebak.daftarTim.slice().sort(function (a, b) { return b.skor - a.skor; });
      var max = urut[0].skor;
      var top = urut.filter(function (t) { return t.skor === max; });
      var teks = (top.length > 1)
        ? "Hasil Seri! (" + top.map(function (t) { return t.nama; }).join(" & ") + ")"
        : "Selamat, " + top[0].nama + " Menang!";

      if (elNama) elNama.textContent = teks;
      if (elTotal) elTotal.textContent = max + " Poin";
      var rekapTim = state.tebak.daftarTim.map(function (t) { return t.nama + ": " + t.skor; }).join(" | ");
      if (elRekap) elRekap.textContent = rekapTim;

      var entriTim = {
        pemain: teks,
        kelompok: rekapTim,
        permainan: "tebak",
        mode: "tim",
        topik: state.tebak.topik,
        level: state.tebak.level,
        tanggal: new Date().toISOString(),
        benar: max,
        total: state.tebak.daftarSoal.length,
        skor: max,
        durasiDetik: durasi
      };
      if (window.Skor && window.Skor.simpanRiwayat) window.Skor.simpanRiwayat(entriTim);
    }

    var elGrid = document.getElementById("hasil-ringkasan-grid");
    if (elGrid) elGrid.hidden = false;
    var elJudul = document.getElementById("hasil-judul-utama");
    if (elJudul) elJudul.textContent = "Hasil Permainan";
    var elNama = document.getElementById("hasil-selamat-nama");
    if (elNama) elNama.classList.remove("teks-selamat-balap");
    var wadahPiala = document.getElementById("wadah-piala-hasil");
    if (wadahPiala) {
      wadahPiala.hidden = false;
      if (!wadahPiala.firstChild && window.Aset) {
        wadahPiala.appendChild(window.Aset.img("ui.piala"));
      }
    }

    state.permainan = "tebak";
    window.Layar.tampil("hasil");
  }

  /* =========================================================================
     2. BALAP BECAK (2 PEMAIN KEYBOARD)
     ========================================================================= */
  function renderLintasanBalap() {
    var p1Wadah = document.getElementById("petak-wadah-p1");
    var p2Wadah = document.getElementById("petak-wadah-p2");
    if (p1Wadah) {
      while (p1Wadah.firstChild) p1Wadah.removeChild(p1Wadah.firstChild);
    }
    if (p2Wadah) {
      while (p2Wadah.firstChild) p2Wadah.removeChild(p2Wadah.firstChild);
    }

    var becak1 = document.getElementById("becak-img-p1") || document.getElementById("becak-p1");
    if (becak1 && !becak1.firstChild) becak1.appendChild(window.Aset.img("balap.becak1"));

    var becak2 = document.getElementById("becak-img-p2") || document.getElementById("becak-p2");
    if (becak2 && !becak2.firstChild) becak2.appendChild(window.Aset.img("balap.becak2"));

    perbaruiPosisiBecakVisual();
  }

  function perbaruiPosisiBecakVisual() {
    var b1 = document.getElementById("becak-p1");
    var b2 = document.getElementById("becak-p2");
    var elPos1 = document.getElementById("balap-hud-posisi-p1");
    var elPos2 = document.getElementById("balap-hud-posisi-p2");

    if (elPos1) elPos1.textContent = state.balap.posisiP1 + " / " + state.balap.targetPetak;
    if (elPos2) elPos2.textContent = state.balap.posisiP2 + " / " + state.balap.targetPetak;

    // Hitung offset posisi (lebar lajur: 1192px, start: 70px, finis: 70px)
    // Posisi awal becak di 75px, maju hingga finis
    var startLeft = 75;
    var maxOffset = 840;
    var fraction1 = Math.min(1, state.balap.posisiP1 / state.balap.targetPetak);
    var fraction2 = Math.min(1, state.balap.posisiP2 / state.balap.targetPetak);

    if (b1) b1.style.left = (startLeft + (fraction1 * maxOffset)) + "px";
    if (b2) b2.style.left = (startLeft + (fraction2 * maxOffset)) + "px";
  }

  function mulaiBalapBecak() {
    state.balap.posisiP1 = 0;
    state.balap.posisiP2 = 0;
    state.balap.benarP1 = 0;
    state.balap.benarP2 = 0;
    state.balap.faktaSalah = [];
    state.balap.waktuMulai = Date.now();
    state.balap.sedangTransisi = false;

    // Ambil pengaturan guru bila ada (T5)
    var peng = window.baca ? window.baca("abm.pengaturan", {}) : {};
    if (peng.panjangLintasan) state.balap.targetPetak = Number(peng.panjangLintasan);
    if (peng.waktuRonde !== undefined) state.balap.waktuRonde = Number(peng.waktuRonde);

    var elNama1 = document.getElementById("balap-hud-nama-p1");
    var elNama2 = document.getElementById("balap-hud-nama-p2");
    if (elNama1) elNama1.textContent = state.balap.namaP1;
    if (elNama2) elNama2.textContent = state.balap.namaP2;

    renderLintasanBalap();
    window.Layar.tampil("main-balap");
    rondeBaruBalap();
  }

  function rondeBaruBalap() {
    if (state.balap.timerId) {
      clearInterval(state.balap.timerId);
      state.balap.timerId = null;
    }

    // Cek apakah ada yang sudah finis
    if (state.balap.posisiP1 >= state.balap.targetPetak || state.balap.posisiP2 >= state.balap.targetPetak) {
      selesaiBalapBecak();
      return;
    }

    state.balap.terkunciP1 = false;
    state.balap.terkunciP2 = false;
    state.balap.sedangTransisi = false;

    // Reset highlight kartu jawaban
    var kKiri = document.getElementById("kartu-pilihan-kiri");
    var kKanan = document.getElementById("kartu-pilihan-kanan");
    if (kKiri) kKiri.className = "kartu-jawaban-balap";
    if (kKanan) kKanan.className = "kartu-jawaban-balap";

    var stRonde = document.getElementById("balap-status-ronde");
    if (stRonde) {
      stRonde.hidden = true;
      stRonde.className = "status-ronde-balap";
    }

    // Generate soal via GeneratorSoal
    var s = window.GeneratorSoal.buat({
      tabel: state.balap.tabelPilihan,
      operasi: state.balap.operasi,
      jumlahPilihan: 2
    });
    state.balap.soalAktif = s;

    // Acak posisi kiri & kanan
    var pil = s.pilihan; // 2 pilihan
    state.balap.pilihanKiri = pil[0];
    state.balap.pilihanKanan = pil[1];

    var elSimbol = document.getElementById("balap-simbol-soal");
    if (elSimbol) {
      var teksSoal = s.teks;
      if (teksSoal.indexOf("=?") < 0 && teksSoal.indexOf("=") < 0) {
        teksSoal += " = ?";
      }
      elSimbol.textContent = teksSoal;
    }

    var elKiri = document.getElementById("balap-teks-kiri");
    var elKanan = document.getElementById("balap-teks-kanan");
    if (elKiri) elKiri.textContent = state.balap.pilihanKiri;
    if (elKanan) elKanan.textContent = state.balap.pilihanKanan;

    // Atur timer ronde
    state.balap.sisaWaktu = state.balap.waktuRonde;
    var elTimer = document.getElementById("balap-timer-ronde");
    if (state.balap.waktuRonde === 0) {
      if (elTimer) elTimer.textContent = "∞";
    } else {
      if (elTimer) elTimer.textContent = state.balap.sisaWaktu + "s";
      state.balap.timerId = setInterval(function () {
        state.balap.sisaWaktu--;
        if (elTimer) elTimer.textContent = state.balap.sisaWaktu + "s";
        if (state.balap.sisaWaktu <= 0) {
          clearInterval(state.balap.timerId);
          state.balap.timerId = null;
          waktuHabisRonde();
        }
      }, 1000);
    }
  }

  function tanganiInputKeyboard(code) {
    if (window.Layar.aktif() !== "main-balap") return;
    if (state.balap.sedangTransisi) return;

    var s = state.balap.soalAktif;
    if (!s) return;

    // Pemain 1: KeyZ (kiri), KeyX (kanan)
    if (code === "KeyZ" || code === "KeyX") {
      if (state.balap.terkunciP1) return; // sudah salah ronde ini
      var jawabanP1 = (code === "KeyZ") ? state.balap.pilihanKiri : state.balap.pilihanKanan;
      var benarP1 = (Number(jawabanP1) === Number(s.kunci));
      evaluasiTekanPemain(1, benarP1, (code === "KeyZ" ? "kiri" : "kanan"));
    }

    // Pemain 2: Period (kiri), Slash (kanan)
    if (code === "Period" || code === "Slash") {
      if (state.balap.terkunciP2) return; // sudah salah ronde ini
      var jawabanP2 = (code === "Period") ? state.balap.pilihanKiri : state.balap.pilihanKanan;
      var benarP2 = (Number(jawabanP2) === Number(s.kunci));
      evaluasiTekanPemain(2, benarP2, (code === "Period" ? "kiri" : "kanan"));
    }
  }

  function evaluasiTekanPemain(pemainNo, benar, arah) {
    var namaP = (pemainNo === 1) ? state.balap.namaP1 : state.balap.namaP2;
    var kEl = (arah === "kiri") ? document.getElementById("kartu-pilihan-kiri") : document.getElementById("kartu-pilihan-kanan");
    var stRonde = document.getElementById("balap-status-ronde");
    var teksSt = document.getElementById("balap-teks-status-ronde");

    if (benar) {
      // JAWABAN BENAR -> Maju 1 petak, kunci ronde, transisi ke ronde berikutnya
      state.balap.sedangTransisi = true;
      if (state.balap.timerId) { clearInterval(state.balap.timerId); state.balap.timerId = null; }
      window.Aset.putar("sfx.benar");

      if (pemainNo === 1) { state.balap.posisiP1++; state.balap.benarP1++; }
      else { state.balap.posisiP2++; state.balap.benarP2++; }

      perbaruiPosisiBecakVisual();

      if (kEl) kEl.classList.add("sorot-benar");
      if (stRonde && teksSt) {
        teksSt.textContent = namaP + " Benar! Becak maju 1 petak.";
        stRonde.hidden = false;
      }

      setTimeout(function () {
        rondeBaruBalap();
      }, 800);
    } else {
      // JAWABAN SALAH -> Pemain terkunci pada ronde ini
      window.Aset.putar("sfx.salah");
      if (kEl) kEl.classList.add("sorot-salah");

      if (pemainNo === 1) state.balap.terkunciP1 = true;
      else state.balap.terkunciP2 = true;

      // Catat fakta salah
      var s = state.balap.soalAktif;
      state.balap.faktaSalah.push(s.penjelasan);

      if (state.balap.terkunciP1 && state.balap.terkunciP2) {
        // Kedua pemain salah! Tampilkan penjelasan, tidak ada yang maju
        state.balap.sedangTransisi = true;
        if (state.balap.timerId) { clearInterval(state.balap.timerId); state.balap.timerId = null; }

        if (stRonde && teksSt) {
          teksSt.textContent = "Kedua pemain salah! (" + s.penjelasan + ")";
          stRonde.hidden = false;
        }

        setTimeout(function () {
          rondeBaruBalap();
        }, 1200);
      } else {
        // Masih ada kesempatan bagi lawan
        if (stRonde && teksSt) {
          teksSt.textContent = namaP + " Salah! Kesempatan bagi lawan.";
          stRonde.hidden = false;
        }
      }
    }
  }

  function waktuHabisRonde() {
    state.balap.sedangTransisi = true;
    var s = state.balap.soalAktif;
    state.balap.faktaSalah.push(s.penjelasan);

    var stRonde = document.getElementById("balap-status-ronde");
    var teksSt = document.getElementById("balap-teks-status-ronde");
    if (stRonde && teksSt) {
      teksSt.textContent = "⏰ Waktu Habis!";
      stRonde.className = "status-ronde-balap pop-up-tengah";
      stRonde.hidden = false;
    }

    // Durasi singkat 700ms lalu lanjut ronde berikutnya
    setTimeout(function () {
      if (stRonde) {
        stRonde.className = "status-ronde-balap";
        stRonde.hidden = true;
      }
      rondeBaruBalap();
    }, 700);
  }

  function selesaiBalapBecak() {
    window.Aset.putar("sfx.menang");
    var durasi = Math.round((Date.now() - (state.balap.waktuMulai || Date.now())) / 1000);
    var elJudul = document.getElementById("hasil-judul-utama");
    var elNama = document.getElementById("hasil-selamat-nama");
    var elGrid = document.getElementById("hasil-ringkasan-grid");
    var wadahSulit = document.getElementById("hasil-wadah-sulit");
    var wadahPiala = document.getElementById("wadah-piala-hasil");

    var pemenang = "";
    if (state.balap.posisiP1 >= state.balap.targetPetak && state.balap.posisiP2 >= state.balap.targetPetak) {
      pemenang = "Balapan Seri!";
    } else if (state.balap.posisiP1 >= state.balap.targetPetak) {
      pemenang = "Selamat, " + state.balap.namaP1 + " Juara 1!";
    } else {
      pemenang = "Selamat, " + state.balap.namaP2 + " Juara 1!";
    }

    if (elJudul) elJudul.textContent = "Juara Balap Becak!";

    // Tambahkan ikon piala di atas teks selamat
    if (wadahPiala) {
      wadahPiala.hidden = false;
      if (!wadahPiala.firstChild && window.Aset) {
        wadahPiala.appendChild(window.Aset.img("ui.piala"));
      }
    }

    // Perbesar teks Selamat dst
    if (elNama) {
      elNama.textContent = pemenang;
      elNama.classList.add("teks-selamat-balap");
    }

    // Pada halaman menang balap becak, buang total skor dan pencapaian/rekap
    if (elGrid) elGrid.hidden = true;
    if (wadahSulit) wadahSulit.hidden = true;

    // Catat riwayat skor
    var rekapBalap = state.balap.namaP1 + ": " + state.balap.benarP1 + " benar | " + state.balap.namaP2 + ": " + state.balap.benarP2 + " benar";
    var entri = {
      pemain: pemenang,
      kelompok: rekapBalap,
      permainan: "balap",
      mode: "2-pemain",
      topik: state.balap.operasi,
      tanggal: new Date().toISOString(),
      benar: Math.max(state.balap.benarP1, state.balap.benarP2),
      total: state.balap.targetPetak,
      skor: Math.max(state.balap.posisiP1, state.balap.posisiP2),
      durasiDetik: durasi
    };
    if (window.Skor && window.Skor.simpanRiwayat) window.Skor.simpanRiwayat(entri);

    state.permainan = "balap";
    window.Layar.tampil("hasil");
  }

  /* =========================================================================
     3. SETUP & INTERAKSI
     ========================================================================= */
  function renderSetupTabelBalap() {
    var wadah = document.getElementById("wadah-centang-tabel");
    if (!wadah) return;
    while (wadah.firstChild) wadah.removeChild(wadah.firstChild);

    for (var i = 1; i <= 10; i++) {
      (function (num) {
        var chip = document.createElement("div");
        chip.className = "chip-tabel-check aktif";
        chip.textContent = "Tabel " + num;
        chip.addEventListener("click", function () {
          window.Aset.putar("sfx.klik");
          var idx = state.balap.tabelPilihan.indexOf(num);
          if (idx >= 0) {
            if (state.balap.tabelPilihan.length > 1) {
              state.balap.tabelPilihan.splice(idx, 1);
              chip.classList.remove("aktif");
            }
          } else {
            state.balap.tabelPilihan.push(num);
            chip.classList.add("aktif");
          }
        });
        wadah.appendChild(chip);
      })(i);
    }
  }

  function perbaruiFormNamaTimTebak() {
    var wadah = document.getElementById("wadah-input-nama-tim");
    if (!wadah) return;
    while (wadah.firstChild) wadah.removeChild(wadah.firstChild);

    state.tebak.daftarTim = [];
    for (var i = 1; i <= state.tebak.jumlahTim; i++) {
      var tObj = { id: i, nama: "Tim " + i, skor: 0 };
      state.tebak.daftarTim.push(tObj);

      (function (t) {
        var inp = document.createElement("input");
        inp.type = "text";
        inp.className = "input-nama-tim-kecil";
        inp.value = t.nama;
        inp.maxLength = 12;
        inp.addEventListener("input", function () {
          t.nama = inp.value.trim() || ("Tim " + t.id);
        });
        wadah.appendChild(inp);
      })(tObj);
    }
  }

  function initGame() {
    // 1. Ikon-ikon
    var wIkonTebak = document.getElementById("wadah-ikon-tebak") || document.getElementById("wadah-ikon-hitung");
    if (wIkonTebak && !wIkonTebak.firstChild) wIkonTebak.appendChild(window.Aset.img("ui.ikon-hitung"));

    var wIkonBalap = document.getElementById("wadah-ikon-balap");
    if (wIkonBalap && !wIkonBalap.firstChild) wIkonBalap.appendChild(window.Aset.img("ui.ikon-balap"));

    var wInfo = document.getElementById("ikon-wadah-info");
    if (wInfo && !wInfo.firstChild) wInfo.appendChild(window.Aset.img("ui.ikon-info"));

    var wFun = document.getElementById("ikon-wadah-funfact");
    if (wFun && !wFun.firstChild) wFun.appendChild(window.Aset.img("ui.ikon-funfact"));

    // 2. Tombol Pilih Permainan (layar-main)
    var btnTebak = document.getElementById("btn-pilih-tebak-jajan");
    if (btnTebak) {
      btnTebak.addEventListener("click", function () {
        window.Aset.putar("sfx.klik");
        window.Layar.tampil("main-cara");
      });
    }

    var btnBalap = document.getElementById("btn-pilih-balap-becak");
    if (btnBalap) {
      btnBalap.addEventListener("click", function () {
        window.Aset.putar("sfx.klik");
        window.Layar.tampil("main-balap-setup");
      });
    }

    // 3. Setup Tebak Jajan (layar-main-cara: Pengaturan Level Saja)
    state.tebak.cara = "sendiri";
    state.tebak.topik = "campur";

    var opsiLvl = [
      { id: "level-opt-1", v: 1 },
      { id: "level-opt-2", v: 2 },
      { id: "level-opt-3", v: 3 }
    ];
    opsiLvl.forEach(function (o) {
      var btn = document.getElementById(o.id);
      if (btn) {
        btn.addEventListener("click", function () {
          window.Aset.putar("sfx.klik");
          state.tebak.level = o.v;
          opsiLvl.forEach(function (item) {
            var el = document.getElementById(item.id);
            if (el) {
              if (item.v === o.v) el.classList.remove("mati");
              else el.classList.add("mati");
            }
          });
        });
      }
    });

    var btnMulaiTebak = document.getElementById("btn-mulai-tebak");
    if (btnMulaiTebak) {
      btnMulaiTebak.addEventListener("click", function () {
        window.Aset.putar("sfx.klik");
        siapkanSoalTebak();
        window.Layar.tampil("main-tebak");
        muatSoalTebak();
      });
    }

    // 4. Setup Balap Becak (layar-main-balap-setup)
    var btnMulaiBalap = document.getElementById("btn-mulai-balap-becak");
    if (btnMulaiBalap) {
      btnMulaiBalap.addEventListener("click", function () {
        window.Aset.putar("sfx.klik");
        var inp1 = document.getElementById("balap-nama-p1");
        var inp2 = document.getElementById("balap-nama-p2");
        state.balap.namaP1 = (inp1 && inp1.value.trim()) || "Pemain 1";
        state.balap.namaP2 = (inp2 && inp2.value.trim()) || "Pemain 2";
        mulaiBalapBecak();
      });
    }

    // 5. Tombol Layar Hasil: Ulangi / Menu
    var btnUlangi = document.getElementById("btn-hasil-ulangi");
    if (btnUlangi) {
      btnUlangi.addEventListener("click", function () {
        window.Aset.putar("sfx.klik");
        if (state.permainan === "tebak") {
          siapkanSoalTebak();
          window.Layar.tampil("main-tebak");
          muatSoalTebak();
        } else {
          mulaiBalapBecak();
        }
      });
    }

    var btnHasilMenu = document.getElementById("btn-hasil-ke-menu");
    if (btnHasilMenu) {
      btnHasilMenu.addEventListener("click", function () {
        window.Aset.putar("sfx.klik");
        window.Layar.keMenu();
      });
    }

    // 6. Tombol Bantuan Kuis Tebak Jajan (i, ?)
    var modalAturan = document.getElementById("modal-aturan-kuis");
    var btnAturan = document.getElementById("btn-kuis-aturan");
    var btnTutupAturan = document.getElementById("btn-tutup-aturan");
    if (btnAturan && modalAturan) {
      btnAturan.addEventListener("click", function () {
        window.Aset.putar("sfx.klik");
        modalAturan.hidden = false;
      });
    }
    if (btnTutupAturan && modalAturan) {
      btnTutupAturan.addEventListener("click", function () {
        window.Aset.putar("sfx.klik");
        modalAturan.hidden = true;
      });
    }

    var modalFun = document.getElementById("modal-funfact");
    var btnFun = document.getElementById("btn-kuis-funfact");
    var btnTutupFun = document.getElementById("btn-tutup-funfact");
    var teksFun = document.getElementById("teks-funfact-konten");
    if (btnFun && modalFun) {
      btnFun.addEventListener("click", function () {
        window.Aset.putar("sfx.klik");
        var obj = (state.tebak.soalAktif && state.tebak.soalAktif.objek) || "makanan.klepon";
        var konten = (window.FUNFACT && window.FUNFACT[obj]) || "Objek ini adalah bagian dari kuliner budaya Jawa.";
        if (teksFun) teksFun.textContent = konten;
        modalFun.hidden = false;
      });
    }
    if (btnTutupFun && modalFun) {
      btnTutupFun.addEventListener("click", function () {
        window.Aset.putar("sfx.klik");
        modalFun.hidden = true;
      });
    }

    // 7. Event Keyboard Listener Balap Becak (event.code)
    window.addEventListener("keydown", function (e) {
      // Abaikan repeat
      if (e.repeat) return;

      // Layar penuh dengan tombol F
      if (e.code === "KeyF" && window.Layar.aktif() === "main-balap") {
        if (!document.fullscreenElement) {
          if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
        } else {
          if (document.exitFullscreen) document.exitFullscreen();
        }
        return;
      }

      // Tombol Slash: preventDefault agar Firefox tidak membuka quick find
      if (e.code === "Slash" && window.Layar.aktif() === "main-balap") {
        e.preventDefault();
      }

      // Input permainan balapan
      if (window.Layar.aktif() === "main-balap") {
        if (e.code === "KeyZ" || e.code === "KeyX" || e.code === "Period" || e.code === "Slash") {
          tanganiInputKeyboard(e.code);
        }
      }
    });

    // 8. Event mulaiUlang (Keluar di Menu)
    window.addEventListener("mulaiulang", function () {
      if (state.balap.timerId) { clearInterval(state.balap.timerId); state.balap.timerId = null; }
      state.tebak.daftarSoal = [];
      state.tebak.soalAktif = null;
      state.tebak.skorTotal = 0;
      state.balap.posisiP1 = 0;
      state.balap.posisiP2 = 0;
    });
  }

  var Game = {
    state: state,
    init: initGame
  };

  window.Game = Game;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGame);
  } else {
    initGame();
  }
})();
