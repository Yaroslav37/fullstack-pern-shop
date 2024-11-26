import { useEffect, useState } from 'react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Skeleton } from './ui/skeleton'
import { useNavigate, useParams } from 'react-router'

interface Product {
  id: string
  name: string
  price: string
  description: string
  image_url: string
}

export default function ProductList() {
  const { id } = useParams()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:3000/products/${id}`)

        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }

        const data = await response.json()
        setProducts(data.products)
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

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <Card
          key={product.id}
          onClick={() => navigate(`/product/${product.id}`, { state: product })}
        >
          <CardContent className="p-4">
            <div className="relative h-48 mb-4 overflow-hidden">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardTitle className="mb-2">{product.name}</CardTitle>
            <p className="font-bold mb-4">${product.price}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
