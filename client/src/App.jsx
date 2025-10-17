import { Outlet } from 'react-router-dom'
import Nav from './components/Nav'
import NeuralBackground from './components/NeuralBackground'
import { AuthProvider } from './contexts/AuthContext'

export default function App(){
  return (
    <AuthProvider>
      <NeuralBackground>
        <Nav />
        <main className="w-full px-4 py-8">
          <Outlet />
        </main>
      </NeuralBackground>
    </AuthProvider>
  )
}
