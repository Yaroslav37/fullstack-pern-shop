import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useUser } from '@/contexts/AuthContext'

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
  const { user } = useUser()

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
          // quantity:
          //   newQuantity -
          //   (cartItems.find((item) => item.id === productId)?.quantity || 0),
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
      console.log(cartItems)
    } catch (err) {
      setError(`An error occurred while removing the item from cart: ${err}`)
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error}</div>
  console.log(cartItems)
  if (cartItems.length === 0) return <div>Your cart is empty</div>

  function isVideo(mediaUrl: string) {
    return mediaUrl.endsWith('.webm') ? true : false
  }

  return (
    <div className="container mx-auto p-4">
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
        Total: $
        {cartItems
          .reduce((total, item) => total + item.price * item.quantity, 0)
          .toFixed(2)}
      </div>
    </div>
  )
}
