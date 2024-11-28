import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { Users, ShoppingBag, Tag, CreditCard, ShoppingCart } from 'lucide-react'

const navItems = [
  { name: 'Пользователи', href: '/admin/users', icon: Users },
  { name: 'Товары', href: '/admin/products', icon: ShoppingBag },
  { name: 'Промокоды', href: '/admin/promo-codes', icon: Tag },
  { name: 'Транзакции', href: '/admin/transactions', icon: CreditCard },
  { name: 'Покупки', href: '/admin/purchases', icon: ShoppingCart },
]

const Sidebar: React.FC = () => {
  const location = useLocation()

  return (
    <div className="pb-12 w-64">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Админ панель
          </h2>
          <ScrollArea className="h-[calc(100vh-8rem)] px-1">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  asChild
                  variant={
                    location.pathname === item.href ? 'secondary' : 'ghost'
                  }
                  className="w-full justify-start"
                >
                  <Link to={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
