import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useUser } from '@/contexts/AuthContext'
import Navbar from '@/components/ui/Navbar'
import { toast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'

interface CartItem {
  id: number
  name: string
  price: number
  image_url: string
  quantity: number
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, updateBalance } = useUser()

  useEffect(() => {
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

    if (user) {
      fetchCartItems()
    }
  }, [user])

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

  if (isLoading) return <div>Loading...</div>
  if (cartItems.length === 0 || error) return <div>Your cart is empty</div>

  function isVideo(mediaUrl: string) {
    return mediaUrl.endsWith('.webm') ? true : false
  }

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cartItems.map((item) => (
        <Card key={item.id} className="mb-4">
          <CardContent className="flex items-center p-4">
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
            <div className="flex-grow p-4">
              <CardTitle>{item.name}</CardTitle>
              <p>${item.price}</p>
            </div>
            <div className="flex items-center">
              <Button
                onClick={() =>
                  updateQuantity(item.id, Math.max(1, item.quantity - 1))
                }
              >
                -
              </Button>
              <span className="mx-2 p-2">{item.quantity}</span>
              <Button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                +
              </Button>
            </div>
            <Button
              variant="destructive"
              className="ml-4"
              onClick={() => removeFromCart(item.id)}
            >
              Remove
            </Button>
          </CardContent>
        </Card>
      ))}
      <div className="text-xl font-bold mt-4">
        Total: ${totalPrice.toFixed(2)}
      </div>
      <Button
        onClick={checkout}
        className="mt-4"
        disabled={totalPrice > (user?.balance || 0)}
      >
        Checkout
      </Button>
      {totalPrice > (user?.balance || 0) && (
        <p className="text-red-500 mt-2">
          Insufficient balance. Please top up your account.
        </p>
      )}
      <Toaster />
    </div>
  )
}
