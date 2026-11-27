export const iso = (d = new Date()) => d.toLocaleDateString('sv-SE')
export const rp = (n) => (n < 0 ? '-' : '') + 'Rp' + Math.abs(Math.round(n)).toLocaleString('id-ID')
export const CATS = ['Makan', 'Transport', 'Jajan', 'Kos & tagihan', 'Tabungan', 'Lainnya']
const sum = (a) => a.reduce((x, y) => x + y.a, 0)

// Hari ke-berapa dalam minggu (Senin = 0 ... Minggu = 6)
const hariKe = (d) => (d.getDay() + 6) % 7

// Kiriman tiap Senin: Senin = 7 hari lagi (uang baru masuk), Minggu = 1 hari lagi
export const daysLeftWeek = (now = new Date()) => 7 - hariKe(now)

export const awalMinggu = (now = new Date()) => {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  d.setDate(d.getDate() - hariKe(d))
  return d
}

export function daysLeft(pay, now = new Date()) {
  let p = new Date(now.getFullYear(), now.getMonth(), pay)
  if (p <= now) p = new Date(now.getFullYear(), now.getMonth() + 1, pay)
  return Math.max(1, Math.ceil((p - now) / 864e5))
}

export function ringkasan(tx, pay, mode = 'minggu') {
  const mulai = mode === 'minggu' ? iso(awalMinggu()) : iso().slice(0, 8) + '01'
  const dalam = (x) => x.d >= mulai
  const ins = tx.filter((x) => x.t === 'in')
  const outs = tx.filter((x) => x.t === 'out')
  const saldo = sum(ins) - sum(outs)
  const dl = mode === 'minggu' ? daysLeftWeek() : daysLeft(pay)
  const hariIni = sum(outs.filter((x) => x.d === iso()))
  // jatah dihitung dari saldo awal hari ini (saldo sekarang + yang sudah dipakai hari ini)
  const jatah = Math.max(0, saldo + hariIni) / dl
  return {
    saldo, dl, jatah, sisa: jatah - hariIni,
    mi: sum(ins.filter(dalam)),
    mo: sum(outs.filter(dalam)),
    pakai: (c) => sum(outs.filter((x) => x.c === c && dalam(x))),
  }
}
