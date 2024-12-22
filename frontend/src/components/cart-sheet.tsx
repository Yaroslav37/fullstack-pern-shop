import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useUser } from '@/contexts/AuthContext'
import { toast } from '@/hooks/use-toast'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart } from 'lucide-react'

interface CartItem {
  id: number
  name: string
  price: number
  image_url: string
  quantity: number
}

export function CartSheet() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [, setError] = useState<string | null>(null)
  const { user, updateBalance } = useUser()

  useEffect(() => {
    fetchCartItems()
  }, [user])

  const fetchCartItems = async () => {
    try {
      const response = await fetch('http://localhost:4000/cart', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch cart items')
      }

      const data = await response.json()
      setCartItems(data.cartProducts)
      setIsLoading(false)
    } catch (err) {
      setError(`An error occurred while fetching cart items: ${err}`)
      setIsLoading(false)
    }
  }

  const updateQuantity = async (productId: number, newQuantity: number) => {
    try {
      const response = await fetch('http://localhost:4000/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: newQuantity,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update cart')
      }

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      )
    } catch (err) {
      setError(`An error occurred while updating the cart: ${err}`)
    }
  }

  const removeFromCart = async (productId: number) => {
    try {
      const response = await fetch('http://localhost:4000/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ product_id: productId }),
      })

      if (!response.ok) {
        throw new Error('Failed to remove item from cart')
      }

      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== productId)
      )
    } catch (err) {
      setError(`An error occurred while removing the item from cart: ${err}`)
    }
  }

  const checkout = async () => {
    try {
      const response = await fetch('http://localhost:4000/cart/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to checkout')
      }

      const data = await response.json()
      updateBalance(data.balance)
      setCartItems([])
      toast({
        title: 'Checkout Successful',
        description: 'Your order has been placed successfully.',
      })
    } catch (err) {
      toast({
        title: 'Checkout Failed',
        description:
          err instanceof Error ? err.message : 'An unknown error occurred',
        variant: 'destructive',
      })
    }
  }

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  if (isLoading) return <div>Loading...</div>

  function isVideo(mediaUrl: string) {
    return mediaUrl.endsWith('.webm') ? true : false
  }

  return (
    <>
      <SheetHeader>
        <SheetTitle>Shopping Cart</SheetTitle>
      </SheetHeader>
      <Separator className="my-4" />
      <div className="flex flex-col h-full">
        <ScrollArea className="flex-1">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">
                Add items to your cart to checkout
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="relative">
                  <CardContent className="p-4 grid grid-cols-[80px_1fr] gap-4">
                    {isVideo(item.image_url) ? (
                      <video
                        src={item.image_url}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-20 h-20 object-cover mr-4"
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-20 h-20 object-cover mr-4"
                      />
                    )}
                    <div className="grid gap-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm font-medium">${item.price}</p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4 fill-white" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
        {cartItems.length > 0 && (
          <div className="border-t pt-4 space-y-4 pb-2">
            <div className="flex items-center justify-between text-base font-medium">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <Button
              className="w-full"
              onClick={checkout}
              disabled={totalPrice > (user?.balance || 0)}
            >
              Checkout ${totalPrice.toFixed(2)}
            </Button>
            {totalPrice && (
              <p className="text-sm text-red-500 text-center">
                Insufficient balance. Please top up your account.
              </p>
            )}
          </div>
        )}
      </div>
    </>
  )
}
