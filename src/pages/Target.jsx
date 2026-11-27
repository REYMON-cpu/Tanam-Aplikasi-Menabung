import { useState } from 'react'
import { useStore } from '../lib/store'
import { rp } from '../lib/hitung'
import Bar from '../components/Bar'
import { GoalForm, DepForm } from '../components/Forms'

export default function Target() {
  const { goals } = useStore()
  const [m, setM] = useState(null) // 'baru' atau objek target
  return (
    <>
      <div className="row">
        <h2>Target menabung</h2>
        <button className="btn pri" onClick={() => setM('baru')}>Target baru</button>
      </div>
      <div className="list">
        {!goals.length && <div className="empty raise">Belum ada target. Buat satu, misalnya laptop atau dana darurat.</div>}
        {goals.map((g) => {
          const bln = Math.max(1, (new Date(g.due) - new Date()) / 2592e6)
          return (
            <div className="item raise" key={g.id}>
              <div className="row"><b>{g.n}</b><span className="sm">{Math.round((g.saved / g.target) * 100)}%</span></div>
              <Bar p={(g.saved / g.target) * 100} />
              <div className="row" style={{ marginTop: 12 }}>
                <span className="sm">{rp(g.saved)} dari {rp(g.target)}<br />
                  Sisihkan sekitar <b style={{ color: 'var(--pr)' }}>{rp(Math.max(0, g.target - g.saved) / bln)}</b> per bulan</span>
                <button className="btn" onClick={() => setM(g)}>Setor</button>
              </div>
            </div>
          )
        })}
      </div>
      {m === 'baru' && <GoalForm onClose={() => setM(null)} />}
      {m && m !== 'baru' && <DepForm goal={m} onClose={() => setM(null)} />}
    </>
  )
}
