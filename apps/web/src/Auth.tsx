import { useState } from 'react'
import { supabase } from 'supabase'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleAuth = async () => {
    setError(null)
    const { error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })
    if (error) setError(error.message)
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
        <button onClick={() => setIsLogin(!isLogin)} style={{ textDecoration: 'underline', background: 'none', border: 'none', color: 'blue' }}>
          {isLogin ? 'Sign Up' : 'Log In'}
        </button>
      </p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
