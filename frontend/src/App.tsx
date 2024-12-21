import './App.css'
import ProductList from '@/components/ProductList'
import Navbar from './components/ui/Navbar'
import GameCategories from './components/GameCategories'
import { UserProvider } from './contexts/AuthContext'

function App() {
  return (
    <main>
      <Navbar />
      <div className="min-h-screen pt-24">
        <GameCategories />
        <ProductList />
      </div>
    </main>
  )
}

export default App
