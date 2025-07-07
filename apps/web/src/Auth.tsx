import { useEffect, useState } from 'react'
import { supabase } from '../../../packages/supabase'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) setUser(data.user)
    }
    getUser()
  }, [])

  const handleAuth = async () => {
    setError(null)
    const { error, data } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })

    if (error) return setError(error.message)
    setUser(data.user ?? null)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (user) {
    return (
      <div style={{ maxWidth: 300, margin: 'auto', padding: '1rem', textAlign: 'center' }}>
        <h2>Welcome!</h2>
        <p>{user.email}</p>
        <button onClick={handleLogout} style={{ marginTop: '1rem', width: '100%' }}>
          Log Out
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 300, margin: 'auto', padding: '1rem' }}>
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
      />
      <button onClick={handleAuth} style={{ width: '100%' }}>
        {isLogin ? 'Log In' : 'Sign Up'}
      </button>
      <p style={{ marginTop: '1rem' }}>
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: 'blue', textDecoration: 'underline' }}>
          {isLogin ? 'Sign Up' : 'Log In'}
        </button>
      </p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
