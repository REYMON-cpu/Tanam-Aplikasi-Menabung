import { useState } from 'react'
import { useStore } from '../lib/store'
import { rp, ringkasan } from '../lib/hitung'
import Bar from '../components/Bar'
import TxList from '../components/TxList'
import { BudgetForm } from '../components/Forms'

export default function Beranda() {
  const { tx, budget, pay, setPay, mode, setMode } = useStore()
  const r = ringkasan(tx, pay, mode)
  const [atur, setAtur] = useState(false)
  const minggu = mode === 'minggu'
  const periode = minggu ? 'minggu ini' : 'bulan ini'
  const anggaran = budget[mode] || {}
  return (
    <>
      <div className="seg" style={{ marginBottom: 18, maxWidth: 260 }}>
        <button className={'btn ' + (minggu ? 'on' : '')} onClick={() => setMode('minggu')}>Minggu</button>
        <button className={'btn ' + (!minggu ? 'on' : '')} onClick={() => setMode('bulan')}>Bulan</button>
      </div>
      <section className="hero raise">
        <div className="sm">Sisa jatah hari ini</div>
        <div className={'big ' + (r.sisa < 0 ? 'out' : '')}>{rp(r.sisa)}</div>
        <Bar p={r.jatah ? (r.sisa / r.jatah) * 100 : 0} />
        <div className="row sm">
          {minggu ? (
            <span>{r.dl} hari lagi kiriman (Senin)</span>
          ) : (
            <span>
              {r.dl} hari lagi gajian, tgl{' '}
              <input className="pay" type="number" min="1" max="28" key={pay} defaultValue={pay} aria-label="Tanggal gajian"
                onBlur={(e) => setPay(Math.min(28, Math.max(1, +e.target.value || 1)))} />
            </span>
          )}
          <span>Saldo <b style={{ color: 'var(--tx)' }}>{rp(r.saldo)}</b></span>
        </div>
      </section>
      <div className="stats">
        <div className="stat raise"><span className="sm">Pemasukan {periode}</span><b className="in">{rp(r.mi)}</b></div>
        <div className="stat raise"><span className="sm">Pengeluaran {periode}</span><b className="out">{rp(r.mo)}</b></div>
      </div>
      <div className="cols">
        <div>
          <div className="row">
            <h2>Anggaran {periode}</h2>
            <button className="btn" onClick={() => setAtur(true)}>Atur</button>
          </div>
          {!Object.keys(anggaran).length && (
            <div className="empty raise">Belum ada anggaran. Ketuk Atur untuk menentukan batas per kategori.</div>
          )}
          <div className="list">
            {Object.entries(anggaran).map(([c, max]) => {
              const u = r.pakai(c), p = (u / max) * 100
              return (
                <div className="item raise" key={c}>
                  <div className="row"><b>{c}</b><span className={p >= 100 ? 'out' : ''}>{rp(u)}</span></div>
                  <div className="sm">sisa dari {rp(max)}{p >= 100 ? ' · lewat batas' : p >= 80 ? ' · hampir habis' : ''}</div>
                  <Bar p={p} />
                </div>
              )
            })}
          </div>
        </div>
        <div><h2>Terakhir</h2><TxList max={5} /></div>
      </div>
      {atur && <BudgetForm mode={mode} onClose={() => setAtur(false)} />}
    </>
  )
}
