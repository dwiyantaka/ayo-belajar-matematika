/* js/skor.js — Pengelolaan riwayat sesi & ekspor skor CSV (Task T5)
   - Menyimpan sesi permainan: { pemain, kelompok, permainan, mode, topik, level, tanggal, benar, total, skor, durasiDetik }
   - Format penyimpanan localStorage aman (try/catch): abm.skor
   - Ekspor skor ke CSV (Blob + download)
   - Hapus / bersihkan riwayat skor
*/
(function () {
  "use strict";

  var Skor = {
    /* Mengambil riwayat skor dari localStorage (aman try/catch) */
    ambilRiwayat: function () {
      if (!window.baca) return [];
      var riwayat = window.baca("abm.skor", []);
      return Array.isArray(riwayat) ? riwayat : [];
    },

    /* Menyimpan entri baru ke riwayat sesi */
    simpanRiwayat: function (entri) {
      if (!window.baca || !window.simpan) return false;
      try {
        var riwayat = Skor.ambilRiwayat();
        // Beri id unik dan timestamp bila belum ada
        if (!entri.id) {
          entri.id = "SKOR-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
        }
        if (!entri.tanggal) {
          entri.tanggal = new Date().toISOString();
        }
        riwayat.unshift(entri); // entri terbaru di depan
        // Batasi riwayat maksimal 200 entri terakhir
        if (riwayat.length > 200) {
          riwayat = riwayat.slice(0, 200);
        }
        window.simpan("abm.skor", riwayat);
        return true;
      } catch (e) {
        console.warn("Gagal simpan riwayat skor:", e);
        return false;
      }
    },

    /* Menghapus seluruh riwayat skor */
    bersihkanRiwayat: function () {
      if (!window.simpan) return false;
      return window.simpan("abm.skor", []);
    },

    /* Ekspor riwayat skor ke berkas CSV (FR-16) */
    eksporCSV: function () {
      var riwayat = Skor.ambilRiwayat();
      if (!riwayat.length) {
        alert("Belum ada data riwayat skor untuk diekspor.");
        return;
      }

      var header = ["No", "Tanggal", "Pemain / Tim", "Permainan", "Mode", "Topik / Operasi", "Level", "Benar", "Total Soal", "Skor", "Durasi (detik)"];
      var barisCSV = [header.join(",")];

      riwayat.forEach(function (r, idx) {
        var tgl = r.tanggal ? new Date(r.tanggal).toLocaleString("id-ID") : "-";
        var pem = '"' + String(r.pemain || "-").replace(/"/g, '""') + '"';
        var per = '"' + String(r.permainan || "-").replace(/"/g, '""') + '"';
        var mod = '"' + String(r.mode || "-").replace(/"/g, '""') + '"';
        var top = '"' + String(r.topik || "-").replace(/"/g, '""') + '"';
        var lvl = r.level !== undefined ? r.level : "-";
        var bnr = r.benar !== undefined ? r.benar : 0;
        var tot = r.total !== undefined ? r.total : 0;
        var skr = r.skor !== undefined ? r.skor : 0;
        var dur = r.durasiDetik !== undefined ? r.durasiDetik : 0;

        barisCSV.push([idx + 1, '"' + tgl + '"', pem, per, mod, top, lvl, bnr, tot, skr, dur].join(","));
      });

      var kontenCSV = "\uFEFF" + barisCSV.join("\r\n"); // UTF-8 BOM
      var blob = new Blob([kontenCSV], { type: "text/csv;charset=utf-8;" });
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      var namaBerkas = "riwayat-skor-matematika-" + new Date().toISOString().slice(0, 10) + ".csv";

      link.setAttribute("href", url);
      link.setAttribute("download", namaBerkas);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  window.Skor = Skor;
})();
