#!/usr/bin/env node
/* Cek aset dan validasi soal. Tanpa dependensi, non-interaktif, selalu berhenti sendiri.
   node tools/cek-aset.mjs               -> laporan
   node tools/cek-aset.mjs --placeholder -> buat placeholder .svg untuk gambar yang BELUM ada (tidak menimpa)
   node tools/cek-aset.mjs --daftar      -> tulis docs/DAFTAR-ASET.md (checst aset yang perlu disiapkan) */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const arg = new Set(process.argv.slice(2));
const ada = (f) => fs.existsSync(path.join(root, f));

function muat(rel) {
  const sb = { window: {} };
  vm.createContext(sb);
  vm.runInContext(fs.readFileSync(path.join(root, rel), "utf8"), sb, { filename: rel });
  return sb.window;
}

let M, SOAL;
try { M = muat("assets/manifest.js").ASET_MANIFEST; } catch (e) { console.error("GAGAL membaca assets/manifest.js:", e.message); process.exit(1); }
try { SOAL = muat("js/soal.js").BANK_SOAL; } catch (e) { console.error("GAGAL membaca js/soal.js:", e.message); process.exit(1); }

/* ---------- placeholder ---------- */
const warna = { ui: "#B3C65A", ornamen: "#2F5233", makanan: "#F0CD66", transportasi: "#E8A87C", busana: "#E8C0D0", karakter: "#F5ECDC", profil: "#D9D9D9" };
function svgPlaceholder(kunci, e) {
  const [w, h] = (e.ukuran.match(/^(\d+)x(\d+)$/) || [0, 256, 256]).slice(1).map(Number);
  const grup = kunci.split(".")[0];
  const fill = warna[grup] || "#F0CD66";
  const tx = grup === "ornamen" ? "#F5ECDC" : "#6B3F1D";
  const fs1 = Math.max(14, Math.min(w, h) / 9);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect x="4" y="4" width="${w - 8}" height="${h - 8}" rx="${Math.min(w, h) / 10}" fill="${fill}" stroke="#6B3F1D" stroke-width="4" stroke-dasharray="14 8"/>
  <text x="${w / 2}" y="${h / 2 - 4}" font-family="sans-serif" font-size="${fs1}" font-weight="700" text-anchor="middle" fill="${tx}">${e.label.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text>
  <text x="${w / 2}" y="${h / 2 + fs1}" font-family="sans-serif" font-size="${fs1 * 0.6}" text-anchor="middle" fill="${tx}">${kunci} (${w}x${h})</text>
</svg>
`;
}
let dibuat = 0;
if (arg.has("--placeholder")) {
  for (const [k, e] of Object.entries(M.gambar)) {
    if (!e.file.endsWith(".svg") || ada(e.file)) continue;
    fs.mkdirSync(path.dirname(path.join(root, e.file)), { recursive: true });
    fs.writeFileSync(path.join(root, e.file), svgPlaceholder(k, e));
    dibuat++;
  }
  console.log(`Placeholder dibuat: ${dibuat} berkas (berkas yang sudah ada tidak disentuh).`);
}

/* ---------- cek aset ---------- */
const hilangG = Object.entries(M.gambar).filter(([, e]) => !ada(e.file));
const hilangA = Object.entries(M.audio).filter(([, e]) => !ada(e.file));
const hilangF = Object.entries(M.font).filter(([, f]) => !ada(f));
const besar = [];
const dikenal = new Set([...Object.values(M.gambar), ...Object.values(M.audio)].map((e) => e.file).concat(Object.values(M.font)));
const yatim = [];
(function jalan(dir) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return;
  for (const n of fs.readdirSync(abs, { withFileTypes: true })) {
    const rel = dir + "/" + n.name;
    if (n.isDirectory()) { if (rel !== "assets/audio/narasi" && rel !== "assets/ilustrasi-soal") jalan(rel); continue; }
    if (n.name === ".gitkeep" || n.name.toLowerCase().startsWith("readme") || n.name === "manifest.js" || n.name === "SUMBER-ASET.md") continue;
    const mb = fs.statSync(path.join(root, rel)).size / 1048576;
    const batas = rel.startsWith("assets/audio/musik") ? 3 : rel.startsWith("assets/audio") ? 1 : 1.5;
    if (mb > batas) besar.push(`${rel} (${mb.toFixed(2)} MB > ${batas} MB)`);
    if (!dikenal.has(rel)) yatim.push(rel);
  }
})("assets");

/* ---------- validasi soal ---------- */
const galatSoal = [];
const idSet = new Set();
for (const s of SOAL) {
  const p = (m) => galatSoal.push(`${s.id}: ${m}`);
  if (idSet.has(s.id)) p("ID ganda"); idSet.add(s.id);
  if (!Array.isArray(s.operan) || s.operan.length !== 2) { p("operan tidak valid"); continue; }
  const [a, b] = s.operan;
  const benar = s.operasi === "kali" ? a * b : a / b;
  if (s.operasi === "bagi" && a % b !== 0) p(`${a} : ${b} tidak habis dibagi`);
  if (benar !== s.kunci) p(`kunci ${s.kunci} tidak cocok dengan hitungan (${benar})`);
  if (!s.pilihan.includes(s.kunci)) p("kunci tidak ada di pilihan");
  if (new Set(s.pilihan).size !== s.pilihan.length) p("pilihan ganda");
  if (s.pilihan.length !== 3) p("soal harus memiliki 3 pilihan");
  if (benar > 100) p("hasil/operan melebihi 100");
  if (a > 100 || (s.operasi === "kali" && (a > 10 || b > 10))) p("di luar fakta dasar 1–10");
  if (s.objek && !s.ilustrasi && !M.gambar[s.objek]) p(`objek "${s.objek}" tidak ada di manifest`);
  if (s.susunan && !s.objek && !s.ilustrasi) p("susunan tanpa objek");
  if (s.susunan && s.susunan.baris * s.susunan.kolom > 100) p("susunan terlalu banyak ikon");
}

/* ---------- laporan ---------- */
const jml = { g: Object.keys(M.gambar).length, a: Object.keys(M.audio).length };
console.log(`\nASET   gambar: ${jml.g - hilangG.length}/${jml.g} ada | audio: ${jml.a - hilangA.length}/${jml.a} ada | font: ${Object.keys(M.font).length - hilangF.length}/${Object.keys(M.font).length} ada`);
if (hilangG.length) console.log(`  Gambar belum ada (${hilangG.length}) -> app memakai placeholder otomatis:\n   ` + hilangG.map(([k]) => k).join(", "));
if (hilangA.length) console.log(`  Audio belum ada (${hilangA.length}) -> app diam:\n   ` + hilangA.map(([k]) => k).join(", "));
if (hilangF.length) console.log(`  Font belum ada -> memakai font cadangan: ${hilangF.map(([k]) => k).join(", ")}`);
if (yatim.length) console.log(`  Berkas TIDAK terdaftar di manifest (${yatim.length}):\n   ` + yatim.join("\n   "));
if (besar.length) console.log(`  Berkas terlalu besar:\n   ` + besar.join("\n   "));
console.log(`\nSOAL   total: ${SOAL.length} (permainan: ${SOAL.filter((s) => s.permainan === "tebak").length} tebak jajan)`);
if (galatSoal.length) console.log("  GALAT:\n   " + galatSoal.join("\n   ")); else console.log("  Semua soal valid (kunci benar, tidak ada pilihan ganda, objek terdaftar).");

/* ---------- daftar aset ---------- */
if (arg.has("--daftar")) {
  const baris = ["# DAFTAR ASET (dibuat otomatis oleh tools/cek-aset.mjs --daftar)", "", "Centang setelah aset asli menggantikan placeholder. Ganti dengan menimpa berkas bernama sama, lalu naikkan `versi` di `assets/manifest.js`.", "", "| Selesai | Kunci | Berkas | Ukuran saran | Keterangan |", "|---|---|---|---|---|"];
  for (const [k, e] of Object.entries(M.gambar)) baris.push(`| [ ] | \`${k}\` | \`${e.file}\` | ${e.ukuran} | ${e.label} |`);
  for (const [k, e] of Object.entries(M.audio)) baris.push(`| [ ] | \`${k}\` | \`${e.file}\` | MP3 | ${e.label}${e.ulang ? " (loop)" : ""} |`);
  for (const [k, f] of Object.entries(M.font)) baris.push(`| [ ] | font.${k} | \`${f}\` | WOFF2 | Font ${k} |`);
  baris.push("", `Narasi opsional: \`${M.narasiFolder}<ID-soal>.mp3\` (mis. \`P-03.mp3\`) untuk ${SOAL.length} soal.`, "");
  fs.writeFileSync(path.join(root, "docs/DAFTAR-ASET.md"), baris.join("\n"));
  console.log("\nDitulis: docs/DAFTAR-ASET.md");
}
process.exit(galatSoal.length ? 1 : 0);
