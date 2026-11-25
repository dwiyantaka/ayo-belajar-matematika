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

  window.$ = $;
  window.$$ = $$;
  window.acak = acak;
  window.simpan = simpan;
  window.baca = baca;
  window.hapusStorage = hapus;
})();

