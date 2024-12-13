import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="backdrop-blur-md bg-white/30 border-b border-white/10">
        <div className="container flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-semibold text-black"
          >
            <img src="/web.svg" alt="PayChara Logo" className="h-8" />
            PayChara
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors"
            >
              Main
            </Link>
            <Link
              to="/catalog"
              className="text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors"
            >
              Catalog
            </Link>
            <Link
              to="/reviews"
              className="text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors"
            >
              Reviews
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
