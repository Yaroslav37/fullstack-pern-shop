import { useEffect, useState } from 'react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Skeleton } from './ui/skeleton'
import { Link } from 'react-router-dom'
import { Product } from '@/types'

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:4000/products/`)

        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }

        const data = await response.json()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pl-32 pr-32">
      {products.map((product) => (
        <Link
          to={`/product/${product.id}`}
          key={product.id}
          state={{ product }}
        >
          <Card className="bg-[url('https://store.supercell.com/_next/static/media/brawlercard-hero-bg.99024bb5.png')]">
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
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
