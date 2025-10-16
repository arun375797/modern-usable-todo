import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../store/useAuth'

export default function Auth(){
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const setAuth = useAuth((state) => state.setAuth)
  const token = useAuth((state) => state.token)
  const navigate = useNavigate()

  useEffect(() => {
    if(token){
      navigate('/')
    }
  }, [token, navigate])

  function handleChange(key, value){
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e){
    e.preventDefault()
    setError('')
    setLoading(true)
    try{
      if(mode === 'register' && !form.name.trim()){
        setError('Add your name to create an account.')
        setLoading(false)
        return
      }
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register'
      const payload = {
        email: form.email,
        password: form.password,
        ...(mode === 'register' ? { name: form.name } : {})
      }
      const { data } = await api.post(endpoint, payload)
      setAuth({
        token: data.token ?? null,
        user: data.user ?? { name: form.name || 'You', email: form.email }
      })
      setForm({ name: '', email: '', password: '' })
      navigate('/')
    }catch(err){
      const message =
        err.response?.data?.error || 'Unable to authenticate. Double-check credentials.'
      setError(message)
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          {mode === 'login' ? 'Welcome Back' : 'Get Started'}
        </h1>
        <p className="text-gray-400 mt-2">Access your workspace</p>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
        <div className="flex gap-2 mb-6 border-b border-white/10">
          <button
            onClick={() => setMode('login')}
            className={`pb-3 px-4 font-medium transition ${
              mode === 'login'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-white'
            }`}
            type="button"
          >
            Sign in
          </button>
          <button
            onClick={() => setMode('register')}
            className={`pb-3 px-4 font-medium transition ${
              mode === 'register'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:text-white'
            }`}
            type="button"
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'register' ? (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <input
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="Your name"
                autoComplete="name"
              />
            </div>
          ) : null}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              type="email"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              type="password"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="••••••••"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
            />
          </div>
          {error ? <div className="text-sm text-red-400">{error}</div> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 transition-all"
          >
            {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  )
}
