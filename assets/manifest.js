/* =====================================================================
   DAFTAR ASET — satu-satunya tempat untuk mengganti / menambah aset.
   Format:  g("kunci", "folder/berkas.ext", "Label", "ukuran saran");
            a("kunci", "folder/berkas.mp3", "Label", ulang?);
   MENGGANTI  : timpa berkas bernama sama, ATAU ubah nama berkas di baris ini.
   MENAMBAH   : tambah satu baris baru.
   Setelah mengganti isi berkas, NAIKKAN `versi` (di bawah) agar cache peramban diperbarui.
   ===================================================================== */
window.ASET_MANIFEST = (function () {
  var G = {}, A = {};
  function g(k, f, l, u) { G[k] = { file: "assets/img/" + f, label: l, ukuran: u || "" }; }
  function a(k, f, l, ulang) { A[k] = { file: "assets/audio/" + f, label: l, ulang: !!ulang }; }

  /* ---- UI ---- */
  g("ui.logo", "ui/logo.svg", "Logo / judul Ayo Belajar Matematika", "600x240");
  g("ui.logo-uny", "ui/logo-uny.png", "Logo Universitas Negeri Yogyakarta", "400x400");
  g("ui.latar-bumper", "ui/latar-bumper.webp", "Latar bumper", "1366x768");
  g("ui.latar-menu", "ui/latar-menu.svg", "Latar menu (kuning)", "1366x768");
  g("ui.latar-belajar", "ui/latar-belajar.svg", "Latar Ruang Belajar", "1366x768");
  g("ui.latar-main", "ui/latar-main.svg", "Latar Ruang Bermain (hijau muda)", "1366x768");
  g("ui.latar-profil", "ui/latar-profil.svg", "Latar Profil Pengembang", "1366x768");
  g("ui.tombol", "ui/tombol.svg", "Tombol menu bergelombang", "360x96");
  g("ui.kartu", "ui/kartu.svg", "Kartu pilihan bergelombang", "420x420");
  g("ui.tombol-start", "ui/tombol-start.webp", "Tombol START", "300x96");
  g("ui.ikon-benar", "ui/ikon-benar.webp", "Ikon centang (benar)", "256x256");
  g("ui.ikon-salah", "ui/ikon-salah.webp", "Ikon silang (salah)", "256x256");
  g("ui.ikon-speaker-on", "ui/ikon-speaker-on.svg", "Ikon speaker hidup", "128x128");
  g("ui.ikon-speaker-off", "ui/ikon-speaker-off.svg", "Ikon speaker mati", "128x128");
  g("ui.ikon-kembali", "ui/ikon-kembali.webp", "Ikon panah kembali", "128x128");
  g("ui.ikon-lanjut", "ui/ikon-lanjut.svg", "Ikon panah lanjut", "128x128");
  g("ui.ikon-kiri", "ui/ikon-kiri.webp", "Ikon panah kiri", "128x128");
  g("ui.ikon-kanan", "ui/ikon-kanan.webp", "Ikon panah kanan", "128x128");
  g("ui.ikon-info", "ui/ikon-bantuan.webp", "Ikon ? (aturan)", "400x400");
  g("ui.ikon-funfact", "ui/ikon-info.webp", "Ikon i (fun fact)", "400x400");
  g("ui.ikon-dengar", "ui/ikon-dengar.svg", "Ikon dengarkan narasi", "128x128");
  g("ui.piala", "ui/piala.webp", "Piala pemenang", "300x300");
  g("ui.lencana", "ui/lencana.svg", "Lencana hadiah (opsional)", "200x200");
  g("ui.perkalian", "ui/perkalian.webp", "Menu perkalian", "558x657");
  g("ui.pembagian", "ui/pembagian.webp", "Menu pembagian", "558x657");
  g("ui.ikon-hamburger", "ui/ikon-humberger.webp", "Ikon menu hamburger", "128x128");
  g("ui.ikon-humberger", "ui/ikon-humberger.webp", "Ikon menu hamburger", "128x128");
  g("ui.ikon-tutup", "ui/ikon-close.webp", "Ikon tutup panel X", "128x128");
  g("ui.ikon-close", "ui/ikon-close.webp", "Ikon tutup panel X", "128x128");
  g("ui.panel-menu", "ui/panel-menu.svg", "Latar panel menu hamburger", "520x768");
  g("ui.ikon-tujuan", "ui/ikon-tujuan.webp", "Ikon sasaran / tujuan pembelajaran", "128x128");
  g("ui.ikon-bantuan", "ui/ikon-bantuan.webp", "Ikon bantuan / panduan", "128x128");
  g("ui.ikon-pengaturan", "ui/ikon-suara.webp", "Ikon pengaturan", "128x128");
  g("ui.ikon-profil", "ui/ikon-profil.webp", "Ikon profil pengembang", "128x128");
  g("ui.ikon-gembok", "ui/ikon-guru.webp", "Ikon gembok PIN guru", "128x128");
  g("ui.ikon-rumah", "ui/ikon-rumah.webp", "Ikon rumah kembali ke awal", "128x128");
  g("ui.ikon-keluar", "ui/ikon-keluar.webp", "Ikon keluar game", "128x128");
  g("ui.favicon", "ui/favicon.webp", "Favicon aplikasi", "512x512");

  /* ---- ORNAMEN / DEKORASI ---- */
  g("ornamen.border-atas", "ornamen/border-atas.svg", "Border batik atas", "1366x120");
  g("ornamen.border-bawah", "ornamen/border-bawah.svg", "Border batik bawah", "1366x120");
  g("ornamen.pola-kawung", "ornamen/pola-kawung.svg", "Pola kawung (ubin latar)", "256x256");
  g("ornamen.pola-parang", "ornamen/pola-parang.svg", "Pola parang (ubin latar)", "256x256");
  g("ornamen.gunungan", "ornamen/gunungan.svg", "Bingkai gunungan (soal)", "900x560");
  g("ornamen.joglo", "ornamen/joglo.svg", "Siluet joglo/pendopo", "800x400");
  g("ornamen.tirai-kiri", "ornamen/tirai-kiri.svg", "Tirai transisi kiri", "700x768");
  g("ornamen.tirai-kanan", "ornamen/tirai-kanan.svg", "Tirai transisi kanan", "700x768");

  /* ---- MAKANAN (1 ikon per objek; dipakai berulang sebagai objek hitung) ---- */
  g("makanan.getuk", "makanan/getuk.webp", "Getuk", "300x300");
  g("makanan.klepon", "makanan/klepon.webp", "Klepon", "100x100");
  g("makanan.cenil", "makanan/cenil.webp", "Cenil", "380x380");
  g("makanan.bakpia", "makanan/bakpia.svg", "Bakpia", "256x256");
  g("makanan.geplak", "makanan/geplak.svg", "Geplak", "256x256");
  g("makanan.yangko", "makanan/yangko.svg", "Yangko", "256x256");
  g("makanan.jadah-tempe", "makanan/jadah-tempe.svg", "Jadah tempe", "256x256");
  g("makanan.apem", "makanan/apem.svg", "Apem", "256x256");
  g("makanan.wajik", "makanan/wajik.svg", "Wajik", "256x256");
  g("makanan.lemper", "makanan/lemper.svg", "Lemper", "256x256");
  g("makanan.serabi", "makanan/serabi.svg", "Serabi", "256x256");
  g("makanan.wedang-uwuh", "makanan/wedang-uwuh.svg", "Wedang uwuh", "256x256");
  g("makanan.gudeg", "makanan/gudeg.svg", "Gudeg", "256x256");

  /* ---- TRANSPORTASI ---- */
  g("transportasi.becak", "transportasi/becak.svg", "Becak", "256x256");
  g("transportasi.andong", "transportasi/andong.svg", "Andong", "256x256");
  g("transportasi.sepeda-onthel", "transportasi/sepeda-onthel.svg", "Sepeda onthel", "256x256");
  g("transportasi.bus-transjogja", "transportasi/bus-transjogja.svg", "Bus Trans Jogja", "256x256");

  /* ---- BUSANA ---- */
  g("busana.blangkon", "busana/blangkon.svg", "Blangkon", "256x256");
  g("busana.batik-jarik", "busana/batik-jarik.svg", "Kain batik/jarik", "256x256");
  g("busana.surjan", "busana/surjan.svg", "Baju surjan", "256x256");
  g("busana.kebaya", "busana/kebaya.svg", "Kebaya", "256x256");
  g("busana.selendang", "busana/selendang.svg", "Selendang", "256x256");

  /* ---- KARAKTER (4 karakter x 3 ekspresi) ---- */
  ["anak1", "anak2", "anak3", "anak4"].forEach(function (n, i) {
    var no = i + 1;
    g("karakter." + n, "karakter/" + n + ".svg", "Karakter " + no + " (netral)", "400x600");
    g("karakter." + n + ".senang", "karakter/" + n + "-senang.svg", "Karakter " + no + " (senang)", "400x600");
    g("karakter." + n + ".semangat", "karakter/" + n + "-semangat.svg", "Karakter " + no + " (semangat)", "400x600");
  });

  /* ---- PROFIL PENGEMBANG ---- */
  g("profil.1", "profil/pengembang1.jpeg", "Foto pengembang 1", "400x400");
  g("profil.2", "profil/pengembang2.jpeg", "Foto pengembang 2", "400x400");
  g("profil.3", "profil/pengembang3.jpeg", "Foto pengembang 3", "400x400");
  g("profil.4", "profil/pengembang4.jfif", "Foto pengembang 4", "400x400");
  /* Alias tanpa tanda titik */
  g("profil1", "profil/pengembang1.jpeg", "Foto pengembang 1", "400x400");
  g("profil2", "profil/pengembang2.jpeg", "Foto pengembang 2", "400x400");
  g("profil3", "profil/pengembang3.jpeg", "Foto pengembang 3", "400x400");
  g("profil4", "profil/pengembang4.jfif", "Foto pengembang 4", "400x400");


  /* ---- AUDIO (berkas boleh belum ada; aplikasi tetap jalan) ---- */
  a("musik.bumper", "musik/gamelan-bumper.mp3", "Gamelan pendek bumper", false);
  a("musik.latar", "musik/padhang-bulan.mp3", "Musik latar lembut", true);
  a("sfx.klik", "sfx/klik.wav", "Bunyi klik", false);
  a("sfx.benar", "sfx/benar.mp3", "Bunyi jawaban benar", false);
  a("sfx.salah", "sfx/salah.mp3", "Bunyi jawaban salah", false);
  a("sfx.menang", "sfx/menang.mp3", "Bunyi pemenang", false);

  /* ---- BALAP BECAK ---- */
  g("balap.becak1", "balap/becak1.png", "Becak pemain 1", "256x160");
  g("balap.becak2", "balap/becak2.png", "Becak pemain 2", "256x160");
  g("balap.latar", "balap/latar.svg", "Latar balapan (jalan/Malioboro)", "1366x768");
  g("balap.lajur", "balap/lajur.svg", "Ubin lajur", "136x120");
  g("balap.start", "balap/start.svg", "Garis start", "136x120");
  g("balap.finis", "balap/finis.svg", "Garis finis", "136x120");
  /* ---- RUANG BERMAIN ---- */
  g("ui.ikon-hitung", "ui/ikon-hitung-jajan.webp", "Ikon kartu Hitung Jajan", "800x600");
  g("ui.ikon-tebak", "ui/ikon-hitung-jajan.webp", "Ikon kartu Hitung Jajan", "800x600");
  g("ui.ikon-balap", "ui/ikon-balap-becak.jfif", "Ikon kartu Balap Becak", "2400x1792");
  g("ui.ikon-sendiri", "ui/ikon-sendiri.svg", "Ikon cara main Sendiri", "256x256");
  g("ui.ikon-tim", "ui/ikon-tim.svg", "Ikon cara main Tim", "256x256");
  g("ui.tombol-kunci", "ui/tombol-kunci.svg", "Kotak label tombol keyboard", "96x96");

  return {
    versi: 15,                                  /* naikkan setelah mengganti isi berkas */
    gambar: G,
    audio: A,
    narasiFolder: "assets/audio/narasi/",       /* narasi per soal: <ID>.mp3, mis. P-03.mp3 */
    font: { judul: "assets/fonts/judul.woff2", isi: "assets/fonts/isi.woff2", lilita: "assets/fonts/LilitaOne.ttf" }
  };
})();
