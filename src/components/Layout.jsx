import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { TxForm } from './Forms'
import { useStore } from '../lib/store'
import { supabase } from '../lib/supabase'

const toggleTheme = () => {
  const r = document.documentElement
  const dark = r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme:dark)').matches
  r.dataset.theme = dark ? 'light' : 'dark'
}
const keluar = () => supabase.auth.signOut()

export default function Layout() {
  const [open, setOpen] = useState(false)
  const { err, clearErr } = useStore()
  return (
    <div className="app">
      <aside className="side">
        <div className="logo">Tanam</div>
        <NavLink to="/">Beranda</NavLink>
        <NavLink to="/target">Target</NavLink>
        <NavLink to="/riwayat">Riwayat</NavLink>
        <button className="btn pri" style={{ marginTop: 14 }} onClick={() => setOpen(true)}>+ Catat</button>
        <button className="n" style={{ marginTop: 'auto' }} onClick={toggleTheme}>Ganti tema</button>
        <button className="n" onClick={keluar}>Keluar</button>
      </aside>
      <main>
        <div style={{ marginBottom: 18 }}>
          <div className="logo">Tanam</div>
          <div className="sm">Uang ditanam, lama-lama tumbuh</div>
        </div>
        {err && (
          <div className="item raise out" role="alert" style={{ marginBottom: 16 }}>
            <div className="row"><span>Ada masalah: {err}</span><button onClick={clearErr} aria-label="Tutup">✕</button></div>
          </div>
        )}
        <Outlet />
      </main>
      <nav className="nav raise" aria-label="Menu utama">
        <NavLink to="/">Beranda</NavLink>
        <NavLink to="/target">Target</NavLink>
        <button className="add" onClick={() => setOpen(true)} aria-label="Catat transaksi">+</button>
        <NavLink to="/riwayat">Riwayat</NavLink>
        <button onClick={toggleTheme}>Tema</button>
        <button onClick={keluar}>Keluar</button>
      </nav>
      {open && <TxForm onClose={() => setOpen(false)} />}
    </div>
  )
}
