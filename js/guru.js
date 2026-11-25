/* js/guru.js — Akses Guru: PIN, Editor Soal, Pengaturan, Riwayat, Ekspor/Impor (Task T5)
   - Verifikasi PIN 4 digit (default "1234", dapat diubah)
   - Editor Soal: Tambah, Ubah, Hapus soal dengan penimpaan aman di localStorage["abm.soalGuru"]
   - Pengaturan: Panjang lintasan balap (8/10/12), Waktu ronde (10/15/20/0 tanpa batas), lewatiOnboarding
   - Riwayat: Tampilkan tabel riwayat sesi dan Ekspor CSV
   - Ekspor / Impor JSON Soal: Blob + download, dan FileReader
*/
(function () {
  "use strict";

  /* Ambil pengaturan saat ini */
  function ambilPengaturan() {
    var bawaan = {
      pin: "1234",
      panjangLintasan: 10,
      waktuRonde: 15,
      jumlahSoal: 10,
      lewatiOnboarding: false
    };
    if (!window.baca) return bawaan;
    var tersimpan = window.baca("abm.pengaturan", {});
    return Object.assign({}, bawaan, tersimpan);
  }

  /* Simpan pengaturan */
  function simpanPengaturan(data) {
    if (!window.simpan) return false;
    return window.simpan("abm.pengaturan", data);
  }

  /* Ambil data penimpaan soal guru: { tambah: [], ubah: {}, hapus: [] } */
  function ambilSoalGuru() {
    var bawaan = { tambah: [], ubah: {}, hapus: [] };
    if (!window.baca) return bawaan;
    var tersimpan = window.baca("abm.soalGuru", bawaan);
    if (!tersimpan || typeof tersimpan !== "object") return bawaan;
    return {
      tambah: Array.isArray(tersimpan.tambah) ? tersimpan.tambah : [],
      ubah: (tersimpan.ubah && typeof tersimpan.ubah === "object") ? tersimpan.ubah : {},
      hapus: Array.isArray(tersimpan.hapus) ? tersimpan.hapus : []
    };
  }

  function simpanSoalGuru(data) {
    if (!window.simpan) return false;
    return window.simpan("abm.soalGuru", data);
  }

  /* Menggabungkan BANK_SOAL bawaan dengan penimpaan guru */
  function ambilDaftarSoalLengkap() {
    var dasar = (window.BANK_SOAL && Array.isArray(window.BANK_SOAL)) ? window.BANK_SOAL : [];
    var sg = ambilSoalGuru();
    var setHapus = new Set(sg.hapus);
    var hasil = [];

    dasar.forEach(function (s) {
      if (setHapus.has(s.id)) return;
      if (sg.ubah[s.id]) {
        var mod = Object.assign({}, sg.ubah[s.id], { _asal: "diubah" });
        hasil.push(mod);
      } else {
        var bwn = Object.assign({}, s, { _asal: "bawaan" });
        hasil.push(bwn);
      }
    });

    sg.tambah.forEach(function (s) {
      var tmb = Object.assign({}, s, { _asal: "guru" });
      hasil.push(tmb);
    });

    return hasil;
  }

  /* State PIN input */
  var pinInputBuffer = "";

  /* State Editor Soal */
  var editSoalIdTarget = null; // null jika buat baru

  /* =========================================================================
     1. LOGIKA PIN & AUTENTIKASI
     ========================================================================= */
  function cekPin(pin) {
    var peng = ambilPengaturan();
    return String(pin).trim() === String(peng.pin).trim();
  }

  function perbaruiTampilanPin() {
    var elDot = document.getElementById("guru-pin-display");
    if (!elDot) return;
    var dots = "";
    for (var i = 0; i < 4; i++) {
      dots += (i < pinInputBuffer.length) ? "● " : "○ ";
    }
    elDot.textContent = dots.trim();
  }

  function tekanPinKey(num) {
    if (pinInputBuffer.length < 4) {
      window.Aset.putar("sfx.klik");
      pinInputBuffer += String(num);
      perbaruiTampilanPin();

      if (pinInputBuffer.length === 4) {
        setTimeout(function () {
          if (cekPin(pinInputBuffer)) {
            window.Aset.putar("sfx.benar");
            pinInputBuffer = "";
            perbaruiTampilanPin();
            window.Layar.tampil("guru");
            muatPanelGuru();
          } else {
            window.Aset.putar("sfx.salah");
            var elPesan = document.getElementById("guru-pin-pesan-salah");
            if (elPesan) {
              elPesan.hidden = false;
              elPesan.textContent = "PIN salah! Coba lagi.";
            }
            pinInputBuffer = "";
            perbaruiTampilanPin();
          }
        }, 150);
      }
    }
  }

  function hapusPinKey() {
    if (pinInputBuffer.length > 0) {
      window.Aset.putar("sfx.klik");
      pinInputBuffer = pinInputBuffer.slice(0, -1);
      perbaruiTampilanPin();
    }
  }

  /* =========================================================================
     2. PANEL AKSES GURU (TAB: SOAL, RIWAYAT, PENGATURAN)
     ========================================================================= */
  function muatPanelGuru() {
    bukaTabGuru("soal");
    renderDaftarSoalGuru();
    renderRiwayatSkorGuru();
    renderPengaturanGuru();
  }

  function bukaTabGuru(tabNama) {
    var tabs = ["soal", "riwayat", "pengaturan"];
    tabs.forEach(function (t) {
      var btn = document.getElementById("tab-guru-btn-" + t);
      var konten = document.getElementById("tab-guru-konten-" + t);
      if (btn && konten) {
        if (t === tabNama) {
          btn.classList.add("aktif");
          konten.hidden = false;
        } else {
          btn.classList.remove("aktif");
          konten.hidden = true;
        }
      }
    });
  }

  /* RENDER DAFTAR SOAL */
  function renderDaftarSoalGuru() {
    var wadah = document.getElementById("tabel-soal-guru-body");
    if (!wadah) return;
    while (wadah.firstChild) wadah.removeChild(wadah.firstChild);

    var daftar = ambilDaftarSoalLengkap();
    var filterOp = (document.getElementById("filter-soal-guru-op") || {}).value || "semua";

    var tersaring = daftar.filter(function (s) {
      if (filterOp !== "semua" && s.operasi !== filterOp) return false;
      return true;
    });

    var countEl = document.getElementById("guru-total-soal-info");
    if (countEl) countEl.textContent = "Total: " + tersaring.length + " soal";

    tersaring.forEach(function (s, idx) {
      var tr = document.createElement("tr");

      var tdNo = document.createElement("td"); tdNo.textContent = idx + 1;
      var tdId = document.createElement("td"); tdId.textContent = s.id;
      var tdOp = document.createElement("td"); tdOp.textContent = (s.operasi === "kali" ? "Kali (×)" : "Bagi (÷)");
      var tdLvl = document.createElement("td"); tdLvl.textContent = "Lvl " + s.level;
      var tdTeks = document.createElement("td"); tdTeks.textContent = s.teks;
      var tdIlus = document.createElement("td"); tdIlus.textContent = s.ilustrasi || s.objek || "-";
      tdIlus.style.fontSize = "16px";
      var tdKunci = document.createElement("td"); tdKunci.textContent = s.kunci;
      var tdStatus = document.createElement("td");
      tdStatus.textContent = (s._asal === "guru") ? "Baru" : (s._asal === "diubah") ? "Diedit" : "Bawaan";

      var tdAksi = document.createElement("td");
      var btnEdit = document.createElement("button");
      btnEdit.type = "button";
      btnEdit.className = "btn-aksi-mini edit";
      btnEdit.textContent = "Edit";
      btnEdit.addEventListener("click", function () {
        bukaModalEditorSoal(s);
      });

      var btnHapus = document.createElement("button");
      btnHapus.type = "button";
      btnHapus.className = "btn-aksi-mini hapus";
      btnHapus.textContent = "Hapus";
      btnHapus.addEventListener("click", function () {
        if (confirm("Yakin ingin menghapus soal " + s.id + "?")) {
          hapusSoalGuru(s.id);
        }
      });

      tdAksi.appendChild(btnEdit);
      tdAksi.appendChild(btnHapus);

      tr.appendChild(tdNo);
      tr.appendChild(tdId);
      tr.appendChild(tdOp);
      tr.appendChild(tdLvl);
      tr.appendChild(tdTeks);
      tr.appendChild(tdIlus);
      tr.appendChild(tdKunci);
      tr.appendChild(tdStatus);
      tr.appendChild(tdAksi);

      wadah.appendChild(tr);
    });
  }

  function hapusSoalGuru(id) {
    var sg = ambilSoalGuru();
    // Jika soal ada di tambah, hapus dari tambah
    var idxTambah = sg.tambah.findIndex(function (s) { return s.id === id; });
    if (idxTambah >= 0) {
      sg.tambah.splice(idxTambah, 1);
    } else {
      // Jika soal bawaan atau diubah, masukkan ke daftar hapus dan bersihkan ubah
      if (!sg.hapus.includes(id)) sg.hapus.push(id);
      delete sg.ubah[id];
    }
    simpanSoalGuru(sg);
    renderDaftarSoalGuru();
  }

  /* MODAL EDITOR SOAL */
  function bukaModalEditorSoal(soalObj) {
    var modal = document.getElementById("modal-editor-soal");
    if (!modal) return;

    editSoalIdTarget = soalObj ? soalObj.id : null;
    var elJudul = document.getElementById("editor-soal-judul-modal");
    if (elJudul) elJudul.textContent = soalObj ? ("Edit Soal: " + soalObj.id) : "Tambah Soal Baru";

    // Form inputs
    document.getElementById("form-soal-operasi").value = soalObj ? soalObj.operasi : "kali";
    document.getElementById("form-soal-level").value = soalObj ? soalObj.level : "1";
    document.getElementById("form-soal-teks").value = soalObj ? soalObj.teks : "";
    document.getElementById("form-soal-operan1").value = (soalObj && soalObj.operan) ? soalObj.operan[0] : "2";
    document.getElementById("form-soal-operan2").value = (soalObj && soalObj.operan) ? soalObj.operan[1] : "3";
    document.getElementById("form-soal-kunci").value = soalObj ? soalObj.kunci : "6";
    document.getElementById("form-soal-pilihan").value = soalObj ? soalObj.pilihan.join(", ") : "4, 6, 8";
    document.getElementById("form-soal-hint").value = (soalObj && soalObj.hint) ? soalObj.hint : "";
    document.getElementById("form-soal-penjelasan").value = (soalObj && soalObj.penjelasan) ? soalObj.penjelasan : "";
    
    var elIlus = document.getElementById("form-soal-ilustrasi") || document.getElementById("form-soal-objek");
    if (elIlus) {
      elIlus.value = (soalObj && (soalObj.ilustrasi || soalObj.objek)) ? (soalObj.ilustrasi || soalObj.objek) : "";
    }

    modal.hidden = false;
  }

  function simpanDariEditorSoal() {
    var op = document.getElementById("form-soal-operasi").value;
    var lvl = Number(document.getElementById("form-soal-level").value) || 1;
    var teks = document.getElementById("form-soal-teks").value.trim();
    var a = Number(document.getElementById("form-soal-operan1").value) || 1;
    var b = Number(document.getElementById("form-soal-operan2").value) || 1;
    var kunci = Number(document.getElementById("form-soal-kunci").value);
    var pilStr = document.getElementById("form-soal-pilihan").value;
    var hint = document.getElementById("form-soal-hint").value.trim();
    var penj = document.getElementById("form-soal-penjelasan").value.trim();
    var elIlus = document.getElementById("form-soal-ilustrasi") || document.getElementById("form-soal-objek");
    var ilustrasi = (elIlus && elIlus.value.trim()) || null;

    if (!teks) { alert("Teks soal tidak boleh kosong."); return; }

    var pil = pilStr.split(",").map(function (v) { return Number(v.trim()); }).filter(function (v) { return !isNaN(v); });
    if (!pil.includes(kunci)) pil.push(kunci);
    // Hapus duplikat
    pil = Array.from(new Set(pil));

    // Pastikan tepat 3 pilihan jawaban
    while (pil.length < 3) {
      var d = Math.max(1, kunci + (pil.length === 1 ? (Math.random() < 0.5 ? 2 : -2) : (Math.random() < 0.5 ? 4 : -4)));
      if (!pil.includes(d)) pil.push(d);
    }
    if (pil.length > 3) {
      var selainKunci = pil.filter(function (v) { return v !== kunci; });
      pil = [kunci, selainKunci[0], selainKunci[1]];
    }

    var sg = ambilSoalGuru();

    if (editSoalIdTarget) {
      // Edit soal yang sudah ada
      var id = editSoalIdTarget;
      var objBaru = {
        id: id,
        permainan: "tebak",
        operasi: op,
        level: lvl,
        ilustrasi: ilustrasi,
        operan: [a, b],
        teks: teks,
        pilihan: pil,
        kunci: kunci,
        hint: hint || (op === "kali" ? (b + " + " + b + " ...") : (b + " × ... = " + a)),
        penjelasan: penj || (a + (op === "kali" ? " × " : " : ") + b + " = " + kunci)
      };

      // Cek apakah soal ada di tambah
      var idx = sg.tambah.findIndex(function (s) { return s.id === id; });
      if (idx >= 0) {
        sg.tambah[idx] = objBaru;
      } else {
        sg.ubah[id] = objBaru;
      }
    } else {
      // Tambah soal baru
      var idBaru = "G-" + Date.now().toString().slice(-4);
      var objBaruTambah = {
        id: idBaru,
        permainan: "tebak",
        operasi: op,
        level: lvl,
        ilustrasi: ilustrasi,
        operan: [a, b],
        teks: teks,
        pilihan: pil,
        kunci: kunci,
        hint: hint || (op === "kali" ? (b + " + " + b + " ...") : (b + " × ... = " + a)),
        penjelasan: penj || (a + (op === "kali" ? " × " : " : ") + b + " = " + kunci)
      };
      sg.tambah.push(objBaruTambah);
    }

    simpanSoalGuru(sg);
    document.getElementById("modal-editor-soal").hidden = true;
    renderDaftarSoalGuru();
  }

  /* RESET SEMUA SOAL KE BAWAAN */
  function resetSoalKeBawaan() {
    if (confirm("Kembalikan seluruh bank soal ke default bawaan aplikasi? Semua penambahan dan edit oleh guru akan direset.")) {
      simpanSoalGuru({ tambah: [], ubah: {}, hapus: [] });
      renderDaftarSoalGuru();
      alert("Bank soal telah dikembalikan ke bawaan.");
    }
  }

  /* EKSPOR & IMPOR JSON SOAL */
  function eksporSoalJSON() {
    var daftar = ambilDaftarSoalLengkap();
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(daftar, null, 2));
    var link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", "bank-soal-matematika-" + new Date().toISOString().slice(0, 10) + ".json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function imporSoalJSON(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (e) {
      try {
        var data = JSON.parse(e.target.result);
        if (!Array.isArray(data)) {
          alert("Format file JSON tidak valid (harus array soal).");
          return;
        }
        var sg = ambilSoalGuru();
        var jumlahSukses = 0;
        data.forEach(function (s) {
          if (s && s.id && s.teks && s.kunci !== undefined && Array.isArray(s.pilihan)) {
            s.permainan = "tebak";
            // Jika ID sudah ada di tambah, timpa; jika belum, masukkan ke tambah
            var idx = sg.tambah.findIndex(function (t) { return t.id === s.id; });
            if (idx >= 0) sg.tambah[idx] = s;
            else sg.tambah.push(s);
            jumlahSukses++;
          }
        });
        simpanSoalGuru(sg);
        renderDaftarSoalGuru();
        alert("Berhasil mengimpor " + jumlahSukses + " soal.");
      } catch (err) {
        alert("Gagal membaca file JSON: " + err.message);
      }
    };
    reader.readAsText(file);
  }

  /* RENDER RIWAYAT SKOR */
  function renderRiwayatSkorGuru() {
    var wadah = document.getElementById("tabel-riwayat-guru-body");
    if (!wadah) return;
    while (wadah.firstChild) wadah.removeChild(wadah.firstChild);

    var riwayat = window.Skor ? window.Skor.ambilRiwayat() : [];
    if (!riwayat.length) {
      var trKosong = document.createElement("tr");
      var tdKosong = document.createElement("td");
      tdKosong.colSpan = 7;
      tdKosong.style.textAlign = "center";
      tdKosong.style.padding = "20px";
      tdKosong.textContent = "Belum ada riwayat permainan yang tercatat.";
      trKosong.appendChild(tdKosong);
      wadah.appendChild(trKosong);
      return;
    }

    riwayat.slice(0, 50).forEach(function (r, idx) {
      var tr = document.createElement("tr");
      var tglStr = r.tanggal ? new Date(r.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "-";

      var tdNo = document.createElement("td"); tdNo.textContent = idx + 1;
      var tdTgl = document.createElement("td"); tdTgl.textContent = tglStr;
      var tdPem = document.createElement("td"); tdPem.textContent = r.pemain || "-";
      var tdPer = document.createElement("td"); tdPer.textContent = (r.permainan === "balap" ? "Balap Becak" : "Hitung Jajan");
      var tdTop = document.createElement("td"); tdTop.textContent = (r.permainan === "balap") ? "-" : (r.level ? "Level " + r.level : "-");
      var tdSkr = document.createElement("td"); tdSkr.textContent = r.skor !== undefined ? r.skor : "-";
      var tdDur = document.createElement("td"); tdDur.textContent = (r.durasiDetik !== undefined ? r.durasiDetik : 0) + " dtk";

      tr.appendChild(tdNo);
      tr.appendChild(tdTgl);
      tr.appendChild(tdPem);
      tr.appendChild(tdPer);
      tr.appendChild(tdTop);
      tr.appendChild(tdSkr);
      tr.appendChild(tdDur);

      wadah.appendChild(tr);
    });
  }

  /* RENDER & SIMPAN PENGATURAN GURU */
  function renderPengaturanGuru() {
    var peng = ambilPengaturan();
    var inpPin = document.getElementById("peng-pin-baru");
    if (inpPin) inpPin.value = peng.pin;

    var selLintasan = document.getElementById("peng-panjang-lintasan");
    if (selLintasan) selLintasan.value = peng.panjangLintasan;

    var selWaktu = document.getElementById("peng-waktu-ronde");
    if (selWaktu) selWaktu.value = peng.waktuRonde;

    var selJml = document.getElementById("peng-jumlah-soal");
    if (selJml) selJml.value = peng.jumlahSoal || 10;

    var chkOnboard = document.getElementById("peng-lewati-onboard");
    if (chkOnboard) chkOnboard.checked = !!peng.lewatiOnboarding;
  }

  function simpanPengaturanForm() {
    var peng = ambilPengaturan();
    var inpPin = document.getElementById("peng-pin-baru");
    var pinBaru = (inpPin && inpPin.value.trim()) || "1234";
    if (pinBaru.length !== 4 || isNaN(Number(pinBaru))) {
      alert("PIN harus berupa 4 digit angka!");
      return;
    }

    var selLintasan = document.getElementById("peng-panjang-lintasan");
    var selWaktu = document.getElementById("peng-waktu-ronde");
    var selJml = document.getElementById("peng-jumlah-soal");
    var chkOnboard = document.getElementById("peng-lewati-onboard");

    peng.pin = pinBaru;
    if (selLintasan) peng.panjangLintasan = Number(selLintasan.value);
    if (selWaktu) peng.waktuRonde = Number(selWaktu.value);
    if (selJml) peng.jumlahSoal = Number(selJml.value) || 10;
    if (chkOnboard) peng.lewatiOnboarding = chkOnboard.checked;

    simpanPengaturan(peng);
    alert("Pengaturan dan PIN berhasil disimpan!");
  }

  /* =========================================================================
     3. INISIALISASI EVENT LISTENERS
     ========================================================================= */
  function initGuru() {
    // 1. Tombol Keypad PIN
    var keypadBtns = document.querySelectorAll(".guru-keypad-btn");
    keypadBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        var val = b.dataset.key;
        if (val === "hapus") hapusPinKey();
        else tekanPinKey(val);
      });
    });

    var btnPinBatal = document.getElementById("btn-guru-pin-batal");
    if (btnPinBatal) {
      btnPinBatal.addEventListener("click", function () {
        window.Aset.putar("sfx.klik");
        pinInputBuffer = "";
        perbaruiTampilanPin();
        window.Layar.keMenu();
      });
    }

    // 2. Tab Navigasi Panel Guru
    var tabSoal = document.getElementById("tab-guru-btn-soal");
    if (tabSoal) tabSoal.addEventListener("click", function () { window.Aset.putar("sfx.klik"); bukaTabGuru("soal"); });

    var tabRiwayat = document.getElementById("tab-guru-btn-riwayat");
    if (tabRiwayat) tabRiwayat.addEventListener("click", function () { window.Aset.putar("sfx.klik"); bukaTabGuru("riwayat"); renderRiwayatSkorGuru(); });

    var tabPeng = document.getElementById("tab-guru-btn-pengaturan");
    if (tabPeng) tabPeng.addEventListener("click", function () { window.Aset.putar("sfx.klik"); bukaTabGuru("pengaturan"); renderPengaturanGuru(); });

    // 3. Tombol-tombol di Tab Soal
    var btnTambahSoal = document.getElementById("btn-guru-tambah-soal");
    if (btnTambahSoal) btnTambahSoal.addEventListener("click", function () { window.Aset.putar("sfx.klik"); bukaModalEditorSoal(null); });

    var btnResetSoal = document.getElementById("btn-guru-reset-soal");
    if (btnResetSoal) btnResetSoal.addEventListener("click", function () { window.Aset.putar("sfx.klik"); resetSoalKeBawaan(); });

    var btnEksporSoal = document.getElementById("btn-guru-ekspor-soal");
    if (btnEksporSoal) btnEksporSoal.addEventListener("click", function () { window.Aset.putar("sfx.klik"); eksporSoalJSON(); });

    var inpImporSoal = document.getElementById("input-file-impor-soal");
    var btnTriggerImpor = document.getElementById("btn-guru-impor-soal");
    if (btnTriggerImpor && inpImporSoal) {
      btnTriggerImpor.addEventListener("click", function () { inpImporSoal.click(); });
      inpImporSoal.addEventListener("change", function (e) {
        if (e.target.files && e.target.files[0]) imporSoalJSON(e.target.files[0]);
      });
    }

    var filterSoalOp = document.getElementById("filter-soal-guru-op");
    if (filterSoalOp) filterSoalOp.addEventListener("change", function () { renderDaftarSoalGuru(); });

    // 4. Modal Editor Soal
    var btnSimpanEditor = document.getElementById("btn-editor-soal-simpan");
    if (btnSimpanEditor) btnSimpanEditor.addEventListener("click", function () { window.Aset.putar("sfx.klik"); simpanDariEditorSoal(); });

    var btnBatalEditor = document.getElementById("btn-editor-soal-batal");
    if (btnBatalEditor) {
      btnBatalEditor.addEventListener("click", function () {
        window.Aset.putar("sfx.klik");
        document.getElementById("modal-editor-soal").hidden = true;
      });
    }

    // 5. Tombol di Tab Riwayat: Ekspor CSV & Bersihkan
    var btnEksporCSV = document.getElementById("btn-guru-ekspor-csv");
    if (btnEksporCSV) {
      btnEksporCSV.addEventListener("click", function () {
        window.Aset.putar("sfx.klik");
        if (window.Skor) window.Skor.eksporCSV();
      });
    }

    var btnBersihRiwayat = document.getElementById("btn-guru-bersih-riwayat");
    if (btnBersihRiwayat) {
      btnBersihRiwayat.addEventListener("click", function () {
        if (confirm("Apakah Anda yakin ingin menghapus seluruh riwayat sesi skor?")) {
          window.Aset.putar("sfx.klik");
          if (window.Skor) window.Skor.bersihkanRiwayat();
          renderRiwayatSkorGuru();
        }
      });
    }

    // 6. Tombol di Tab Pengaturan: Simpan
    var btnSimpanPeng = document.getElementById("btn-guru-simpan-pengaturan");
    if (btnSimpanPeng) {
      btnSimpanPeng.addEventListener("click", function () {
        window.Aset.putar("sfx.klik");
        simpanPengaturanForm();
      });
    }

    // Event pergantian layar
    window.addEventListener("gantilayar", function (e) {
      if (e.detail.nama === "guru-pin") {
        pinInputBuffer = "";
        perbaruiTampilanPin();
        var elPesan = document.getElementById("guru-pin-pesan-salah");
        if (elPesan) elPesan.hidden = true;
      }
    });
  }

  var Guru = {
    cekPin: cekPin,
    ambilDaftarSoal: ambilDaftarSoalLengkap,
    ambilPengaturan: ambilPengaturan,
    init: initGuru
  };

  window.Guru = Guru;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGuru);
  } else {
    initGuru();
  }
})();
