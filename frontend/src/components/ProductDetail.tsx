import { Product } from '@/types'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/products/${id}`)
        setProduct(response.data.product)
        setIsLoading(false)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setError('Ошибка получения информации о товаре')
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (isLoading) {
    return <div>Загрузка</div>
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  if (!product) {
    return <div className="text-center">Товар не найден</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center">
        <img
          src={product.imageUrl}
          alt={product.name}
          className=" object-cover mb-4"
        />
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <p className="text-lg mb-4">${product.price}</p>
        <p className="text-gray-700">{product.description}</p>
      </div>
    </div>
  )
}
