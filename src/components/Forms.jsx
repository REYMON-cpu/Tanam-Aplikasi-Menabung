import { useEffect, useState } from 'react'
import { useStore } from '../lib/store'
import { CATS } from '../lib/hitung'

export function Modal({ onClose, children }) {
  useEffect(() => {
    const f = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', f)
    return () => window.removeEventListener('keydown', f)
  }, [onClose])
  return (
    <div className="modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet raise">{children}</div>
    </div>
  )
}

export function TxForm({ onClose }) {
  const { addTx } = useStore()
  const [t, setT] = useState('out')
  const [a, setA] = useState('')
  const [c, setC] = useState(CATS[0])
  const [n, setN] = useState('')
  const simpan = () => { if (+a > 0) { addTx({ t, a: +a, c, n: n.trim() }); onClose() } }
  return (
    <Modal onClose={onClose}>
      <b>Catat transaksi</b>
      <div className="seg">
        <button className={'btn ' + (t === 'out' ? 'on' : '')} onClick={() => setT('out')}>Pengeluaran</button>
        <button className={'btn ' + (t === 'in' ? 'on' : '')} onClick={() => setT('in')}>Pemasukan</button>
      </div>
      <input autoFocus type="number" inputMode="numeric" placeholder="Nominal (Rp)" value={a} onChange={(e) => setA(e.target.value)} />
      <select value={c} onChange={(e) => setC(e.target.value)}>{CATS.map((x) => <option key={x}>{x}</option>)}</select>
      <input placeholder="Catatan (opsional)" value={n} onChange={(e) => setN(e.target.value)} />
      <button className="btn pri" onClick={simpan}>Simpan</button>
    </Modal>
  )
}

export function GoalForm({ onClose }) {
  const { addGoal } = useStore()
  const [n, setN] = useState('')
  const [t, setT] = useState('')
  const [d, setD] = useState('')
  const simpan = () => { if (n.trim() && +t > 0 && d) { addGoal({ n: n.trim(), target: +t, due: d }); onClose() } }
  return (
    <Modal onClose={onClose}>
      <b>Target baru</b>
      <input autoFocus placeholder="Nama target, mis. Dana darurat" value={n} onChange={(e) => setN(e.target.value)} />
      <input type="number" inputMode="numeric" placeholder="Jumlah target (Rp)" value={t} onChange={(e) => setT(e.target.value)} />
      <input type="date" value={d} onChange={(e) => setD(e.target.value)} />
      <button className="btn pri" onClick={simpan}>Simpan target</button>
    </Modal>
  )
}

export function DepForm({ goal, onClose }) {
  const { deposit } = useStore()
  const [a, setA] = useState('')
  return (
    <Modal onClose={onClose}>
      <b>Setor ke {goal.n}</b>
      <input autoFocus type="number" inputMode="numeric" placeholder="Nominal setoran (Rp)" value={a} onChange={(e) => setA(e.target.value)} />
      <button className="btn pri" onClick={() => { if (+a > 0) { deposit(goal.id, +a); onClose() } }}>Setor</button>
    </Modal>
  )
}

export function BudgetForm({ mode, onClose }) {
  const { budget, setBudget } = useStore()
  const aktif = budget[mode] || {}
  const [v, setV] = useState(() =>
    Object.fromEntries(CATS.filter((c) => c !== 'Tabungan').map((c) => [c, aktif[c] ?? '']))
  )
  const simpan = () => {
    const b = {}
    Object.entries(v).forEach(([c, x]) => { if (+x > 0) b[c] = +x })
    setBudget(mode, b)
    onClose()
  }
  return (
    <Modal onClose={onClose}>
      <b>Atur anggaran {mode === 'minggu' ? 'mingguan' : 'bulanan'}</b>
      <span className="sm">Kosongkan kalau kategori itu tidak mau dibatasi.</span>
      {Object.keys(v).map((c) => (
        <label key={c} className="sm">
          {c}
          <input type="number" inputMode="numeric" placeholder={'Rp per ' + mode} value={v[c]}
            onChange={(e) => setV({ ...v, [c]: e.target.value })} />
        </label>
      ))}
      <button className="btn pri" onClick={simpan}>Simpan anggaran</button>
    </Modal>
  )
}
