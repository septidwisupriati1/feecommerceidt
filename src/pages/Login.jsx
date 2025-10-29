import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simple mock authentication - replace with real API call
    if (username && password) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      login({
        name: username,
        email: `${username}@example.com`
      })

      // Redirect to previous page or home
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    } else {
      setError('Username dan password harus diisi')
    }
    
    setLoading(false)
  }

  return (
    <div className="container" style={{ maxWidth: 480, paddingTop: '3rem' }}>
      <div style={{ 
        background: 'var(--surface-strong)', 
        border: '1px solid var(--border)', 
        borderRadius: '1rem', 
        padding: '2rem',
        boxShadow: 'var(--shadow)'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '1.5rem', textAlign: 'center' }}>Masuk ke Akun Anda</h2>
        
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div>
            <label style={{ display: 'block', marginBottom: '.5rem', color: 'var(--muted)', fontSize: '.9rem' }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              disabled={loading}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '.5rem', color: 'var(--muted)', fontSize: '.9rem' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              disabled={loading}
              style={{ width: '100%' }}
            />
          </div>

          {error && (
            <div style={{ 
              color: '#ef4444', 
              background: '#fee2e2', 
              padding: '.75rem', 
              borderRadius: '.5rem',
              fontSize: '.9rem'
            }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn" 
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: '.5rem' }}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', marginBottom: 0, color: 'var(--muted)', fontSize: '.9rem' }}>
          Belum punya akun? <Link to="/" style={{ color: 'var(--primary)' }}>Kembali ke Beranda</Link>
        </p>
      </div>
    </div>
  )
}
