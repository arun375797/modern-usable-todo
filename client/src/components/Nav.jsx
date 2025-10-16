import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/useAuth'

const links = [
  { to: '/', label: 'Calendar', end: true },
  { to: '/today', label: 'Today' }
]

export default function Nav(){
  const navigate = useNavigate()
  const token = useAuth((state) => state.token)
  const logout = useAuth((state) => state.logout)

  function handleAuth(){
    if(token){
      logout()
      navigate('/auth')
    }else{
      navigate('/auth')
    }
  }

  return (
    <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="font-bold text-xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          TaskFlow
        </div>
        <nav className="flex items-center gap-6">
          {links.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => 
                isActive 
                  ? 'text-cyan-400 font-medium' 
                  : 'text-gray-400 hover:text-white transition-colors'
              }
            >
              {label}
            </NavLink>
          ))}
          <button
            onClick={handleAuth}
            className="ml-4 px-4 py-2 text-sm border border-purple-500/50 rounded-lg hover:bg-purple-500/20 transition-colors"
          >
            {token ? 'Sign out' : 'Sign in'}
          </button>
        </nav>
      </div>
    </header>
  )
}
