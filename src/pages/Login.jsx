import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [daftar, setDaftar] = useState(false)
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [pesan, setPesan] = useState('')
  const [sibuk, setSibuk] = useState(false)

  const kirim = async (e) => {
    e.preventDefault()
    setSibuk(true)
    setPesan('')
    const { error, data } = daftar
      ? await supabase.auth.signUp({ email, password: pw })
      : await supabase.auth.signInWithPassword({ email, password: pw })
    setSibuk(false)
    if (error) setPesan(error.message)
    else if (daftar && !data.session) setPesan('Akun dibuat. Cek email untuk konfirmasi, lalu masuk.')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 20 }}>
      <form className="sheet raise" style={{ borderRadius: 26 }} onSubmit={kirim}>
        <div>
          <div className="logo">Tanam</div>
          <div className="sm">Uang ditanam, lama-lama tumbuh</div>
        </div>
        <input type="email" required autoComplete="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" required minLength={6} autoComplete={daftar ? 'new-password' : 'current-password'}
          placeholder="Kata sandi (min. 6 karakter)" value={pw} onChange={(e) => setPw(e.target.value)} />
        {pesan && <div className="sm out" role="alert">{pesan}</div>}
        <button className="btn pri" disabled={sibuk}>{sibuk ? 'Tunggu…' : daftar ? 'Daftar' : 'Masuk'}</button>
        <button type="button" className="sm" onClick={() => { setDaftar(!daftar); setPesan('') }}>
          {daftar ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar'}
        </button>
      </form>
    </div>
  )
}
