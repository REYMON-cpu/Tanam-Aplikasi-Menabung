import { useEffect, useState } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { StoreProvider } from './lib/store'
import Layout from './components/Layout'
import Beranda from './pages/Beranda'
import Target from './pages/Target'
import Riwayat from './pages/Riwayat'
import Login from './pages/Login'

export default function App() {
  const [session, setSession] = useState(undefined) // undefined = masih mengecek

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  if (session === undefined) return <div className="empty">Memuat…</div>
  if (!session) return <Login />

  return (
    <StoreProvider key={session.user.id} user={session.user}>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Beranda />} />
            <Route path="target" element={<Target />} />
            <Route path="riwayat" element={<Riwayat />} />
          </Route>
        </Routes>
      </HashRouter>
    </StoreProvider>
  )
}
