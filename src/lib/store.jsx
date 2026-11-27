import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'
import { iso } from './hitung'

const Ctx = createContext()
const kosong = { tx: [], goals: [], budget: { minggu: {}, bulan: {} }, pay: 5, mode: 'minggu' }
const pTx = (r) => ({ id: r.id, t: r.type, a: r.amount, c: r.category, n: r.note || '', d: r.date })
const pGoal = (r) => ({ id: r.id, n: r.name, target: r.target, saved: r.saved, due: r.due })

export function StoreProvider({ user, children }) {
  const [d, setD] = useState(kosong)
  const [siap, setSiap] = useState(false)
  const [err, setErr] = useState('')
  const cek = (error) => { if (error) { setErr(error.message); return false } return true }

  useEffect(() => {
    let batal = false
    ;(async () => {
      const [t, g, b, s] = await Promise.all([
        supabase.from('transactions').select('*').order('date').order('id'),
        supabase.from('goals').select('*').order('id'),
        supabase.from('budgets').select('*'),
        supabase.from('settings').select('*').maybeSingle(),
      ])
      if (batal) return
      const gagal = t.error || g.error || b.error || s.error
      if (gagal) setErr(gagal.message)
      const budget = { minggu: {}, bulan: {} }
      ;(b.data || []).forEach((r) => { if (budget[r.mode]) budget[r.mode][r.category] = r.amount })
      setD({
        tx: (t.data || []).map(pTx),
        goals: (g.data || []).map(pGoal),
        budget,
        pay: s.data?.pay ?? 5,
        mode: s.data?.mode ?? 'minggu',
      })
      setSiap(true)
    })()
    return () => { batal = true }
  }, [user.id])

  const api = {
    ...d,
    err,
    clearErr: () => setErr(''),
    addTx: async (t) => {
      const { data, error } = await supabase.from('transactions')
        .insert({ type: t.t, amount: t.a, category: t.c, note: t.n || null, date: iso() }).select().single()
      if (cek(error)) setD((p) => ({ ...p, tx: [...p.tx, pTx(data)] }))
    },
    delTx: async (id) => {
      const { error } = await supabase.from('transactions').delete().eq('id', id)
      if (cek(error)) setD((p) => ({ ...p, tx: p.tx.filter((x) => x.id !== id) }))
    },
    addGoal: async (g) => {
      const { data, error } = await supabase.from('goals')
        .insert({ name: g.n, target: g.target, due: g.due }).select().single()
      if (cek(error)) setD((p) => ({ ...p, goals: [...p.goals, pGoal(data)] }))
    },
    deposit: async (id, a) => {
      const g = d.goals.find((x) => x.id === id)
      const r1 = await supabase.from('goals').update({ saved: g.saved + a }).eq('id', id)
      if (!cek(r1.error)) return
      const r2 = await supabase.from('transactions')
        .insert({ type: 'out', amount: a, category: 'Tabungan', note: 'Setor: ' + g.n, date: iso() }).select().single()
      if (!cek(r2.error)) return
      setD((p) => ({
        ...p,
        goals: p.goals.map((x) => (x.id === id ? { ...x, saved: x.saved + a } : x)),
        tx: [...p.tx, pTx(r2.data)],
      }))
    },
    setPay: async (pay) => {
      const { error } = await supabase.from('settings').upsert({ user_id: user.id, pay, mode: d.mode })
      if (cek(error)) setD((p) => ({ ...p, pay }))
    },
    setMode: async (mode) => {
      const { error } = await supabase.from('settings').upsert({ user_id: user.id, pay: d.pay, mode })
      if (cek(error)) setD((p) => ({ ...p, mode }))
    },
    setBudget: async (mode, b) => {
      const r1 = await supabase.from('budgets').delete().eq('mode', mode)
      if (!cek(r1.error)) return
      const rows = Object.entries(b).map(([category, amount]) => ({ mode, category, amount }))
      if (rows.length) {
        const r2 = await supabase.from('budgets').insert(rows)
        if (!cek(r2.error)) return
      }
      setD((p) => ({ ...p, budget: { ...p.budget, [mode]: b } }))
    },
  }

  if (!siap) return <div className="empty">Memuat data…</div>
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}
export const useStore = () => useContext(Ctx)
