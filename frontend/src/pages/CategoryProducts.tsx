import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Skeleton } from '../components/ui/skeleton'
import { Product } from '@/types'
import { Button } from '@/components/ui/button'
import { useUser } from '@/contexts/AuthContext'
import Navbar from '@/components/ui/Navbar'

export default function CategoryProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useUser()
  const { category } = useParams<{ category: string }>()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/products?category=${category}`
        )

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
  }, [category])

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

  function isVideo(mediaUrl: string) {
    return mediaUrl.endsWith('.webm') ? true : false
  }

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
    return (
      <div className="text-center">No products found for this category</div>
    )
  }

  return (
    <>
      <Navbar />
      <div className="container mt-20 mx-32">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {category} Products
        </h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card
              key={product.id}
              className="bg-[url('https://store.supercell.com/_next/static/media/brawlercard-hero-bg.99024bb5.png')]"
            >
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
                <CardTitle className="mb-2">{product.name}</CardTitle>
                <p className="font-bold mb-4">${product.price}</p>
                <Button onClick={() => addToCart(product.id)}>
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
