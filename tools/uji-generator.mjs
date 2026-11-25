#!/usr/bin/env node
/* Uji generator soal Balap Becak. Selalu berhenti sendiri.  node tools/uji-generator.mjs */
import fs from "node:fs"; import path from "node:path"; import vm from "node:vm"; import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sb = { window: {} }; vm.createContext(sb);
vm.runInContext(fs.readFileSync(path.join(root, "js/generator-soal.js"), "utf8"), sb);
const G = sb.window.GeneratorSoal;
const galat = []; let jml = 0;
for (const jp of [2, 3, 4]) for (const op of ["kali", "bagi", "campur"]) for (const tabel of [[1,2,3,4,5,6,7,8,9,10], [7], [6, 7, 8]]) {
  G.ulangiRiwayat();
  for (let i = 0; i < 2000; i++) {
    const s = G.buat({ tabel, operasi: op, jumlahPilihan: jp }); jml++;
    const [x, y] = s.operan;
    const benar = s.operasi === "kali" ? x * y : x / y;
    const p = (m) => galat.push(`${s.teks} [${op}/${jp}/${tabel}]: ${m}`);
    if (benar !== s.kunci) p("kunci salah");
    if (!s.pilihan.includes(s.kunci)) p("kunci tidak di pilihan");
    if (new Set(s.pilihan).size !== jp) p("jumlah/duplikat pilihan");
    if (s.pilihan.some((v) => v < 1 || v > 100)) p("pilihan di luar 1–100");
    if (!tabel.includes(s.tabel)) p("tabel di luar pilihan");
    if (s.operasi === "bagi" && x % y !== 0) p("tidak habis dibagi");
    if (s.operasi === "kali" && ![x, y].includes(s.tabel)) p("bukan dari tabel");
    if (op !== "campur" && s.operasi !== op) p("operasi salah");
  }
}
const t = G.tabel(7, "kali"), b = G.tabel(7, "bagi");
if (t[9].teks !== "10 × 7 = 70" || b[9].teks !== "70 : 7 = 10") galat.push("tabel Ruang Belajar tidak sesuai");
console.log(`Soal diuji: ${jml}. ` + (galat.length ? "GALAT:\n " + [...new Set(galat)].slice(0, 20).join("\n ") : "Semua valid."));
process.exit(galat.length ? 1 : 0);
