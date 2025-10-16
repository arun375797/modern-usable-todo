import { Outlet } from 'react-router-dom'
import Nav from './components/Nav'
import NeuralBackground from './components/NeuralBackground'

export default function App(){
  return (
    <NeuralBackground>
      <Nav />
      <main className="w-full px-4 py-8">
        <Outlet />
      </main>
    </NeuralBackground>
  )
}
