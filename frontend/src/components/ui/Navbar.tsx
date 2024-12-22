import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useUser } from '../../contexts/AuthContext'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { CartSheet } from '../cart-sheet'
import { TopUpBalanceModal } from '../top-up-balance-modal'

export default function Navbar() {
  const { user, logout } = useUser()

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="backdrop-blur-3xl pl-32 pr-32 bg-white/30 border-b border-white/10">
        <div className="container flex items-center justify-between h-16 ">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-semibold text-black"
          >
            <img src="/web.svg" alt="PayChara Logo" className="h-8" />
            PayChara
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors"
            >
              Main
            </Link>
            {user?.id === 1 && (
              <Link
                to="/admin"
                className="text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors"
              >
                Dashboard
              </Link>
            )}
            <Link
              to="/reviews"
              className="text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors"
            >
              Reviews
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="none" size="cart">
                  Cart
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px]" side="right">
                <CartSheet />
              </SheetContent>
            </Sheet>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm font-medium text-gray-800">
                  {user.username}
                </span>
                <span className="text-sm font-medium text-gray-800">
                  ${user.balance}
                </span>
                <TopUpBalanceModal />
                <Button onClick={logout} variant="destructive" size="sm">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
