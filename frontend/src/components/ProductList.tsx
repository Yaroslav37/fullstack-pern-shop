import { useEffect, useState } from 'react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Skeleton } from './ui/skeleton'
import { Product } from '@/types'
import { Button } from '@/components/ui/button'
import { useUser } from '@/contexts/AuthContext'

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useUser()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:4000/products/`)

        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }

        const data = await response.json()
        const productsData = data.products.map((product: any) => ({
          id: product.id,
          name: product.name,
          game: product.game,
          description: product.description,
          price: parseFloat(product.price),
          imageUrl: product.image_url,
          stock: product.stock,
        }))
        setProducts(productsData)
        setIsLoading(false)
      } catch (err) {
        setError(`An error occurred while fetching products: ${err}`)
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const addToCart = async (productId: string) => {
    if (!user) {
      // Redirect to login or show a message
      return
    }

    try {
      const response = await fetch('http://localhost:4000/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
      })

      if (!response.ok) {
        throw new Error('Failed to add item to cart')
      }

      // Show a success message or update UI
    } catch (err) {
      console.error('Error adding item to cart:', err)
      // Show an error message
    }
  }

  console.log(JSON.stringify(products))

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <Skeleton className="h-48 w-full mb-4" />
              <Skeleton className="h-4 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  if (products.length === 0) {
    return <div className="text-center">No products found</div>
  }

  function isVideo(mediaUrl: string) {
    return mediaUrl.endsWith('.webm') ? true : false
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5 pl-32 pr-32">
      {products.map((product) => (
        <Card key={product.id} className="flex items-center">
          <CardContent className="p-4">
            <div className="relative h-48 mb-4 overflow-hidden ">
              {isVideo(product.imageUrl) ? (
                <video
                  src={product.imageUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full "
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            <CardTitle className="text-center mb-2">{product.name}</CardTitle>
            <p className="text-center font-bold mb-4">${product.price}</p>
            <div className="flex justify-center">
              <Button className="mb-2" onClick={() => addToCart(product.id)}>
                Add to Cart
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
