import { useStore } from '../lib/store'
import { rp } from '../lib/hitung'

export default function TxList({ max = 999 }) {
  const { tx, delTx } = useStore()
  const l = [...tx].sort((a, b) => (a.d < b.d ? 1 : a.d > b.d ? -1 : b.id - a.id)).slice(0, max)
  if (!l.length) return <div className="empty raise">Belum ada transaksi. Ketuk tombol + untuk mencatat yang pertama.</div>
  return (
    <div className="list">
      {l.map((x) => (
        <div className="tx raise" key={x.id}>
          <div><b>{x.n || x.c}</b><small>{x.c} · {x.d}</small></div>
          <div className="row">
            <b className={x.t === 'in' ? 'in' : 'out'}>{x.t === 'in' ? '+' : '-'}{rp(x.a)}</b>
            <button className="sm" onClick={() => delTx(x.id)} aria-label="Hapus">✕</button>
          </div>
        </div>
      ))}
    </div>
  )
}
