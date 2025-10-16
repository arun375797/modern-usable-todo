import { Outlet } from 'react-router-dom'
import Nav from './components/Nav'
import AnimatedBackground from './components/AnimatedBackground'

export default function App(){
  return (
    <div className="min-h-screen text-white">
      <AnimatedBackground />
      <Nav />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
