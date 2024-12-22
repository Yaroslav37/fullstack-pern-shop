import { Product } from '@/types'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useUser } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { StarIcon } from 'lucide-react'

interface Review {
  rating: number
  comment: string
  created_at: string
  username: string
}

export default function ProductDetail() {
  const { id } = useParams()
  const { user } = useUser()
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [canReview, setCanReview] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        const [productResponse, reviewsResponse] = await Promise.all([
          axios.get(`http://localhost:4000/products/${id}`),
          axios.get(`http://localhost:4000/reviews/${id}`),
        ])

        const newProduct = {
          id: productResponse.data.product.id,
          name: productResponse.data.product.name,
          game: productResponse.data.product.game,
          description: productResponse.data.product.description,
          price: parseFloat(productResponse.data.product.price),
          imageUrl: productResponse.data.product.image_url,
          stock: productResponse.data.product.stock,
        }
        setProduct(newProduct)
        setReviews(reviewsResponse.data)
        setIsLoading(false)
      } catch (err) {
        setError('Ошибка получения информации о товаре или отзывах')
        setIsLoading(false)
      }
    }

    fetchProductAndReviews()
  }, [id])

  useEffect(() => {
    const checkCanReview = async () => {
      if (user && product) {
        try {
          const response = await axios.get(
            'http://localhost:4000/reviews/can-review',
            {
              params: { userId: user.id, productId: product.id },
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          )
          setCanReview(response.data.canReview)
        } catch (err) {
          console.error('Ошибка проверки возможности оставить отзыв:', err)
        }
      }
    }

    checkCanReview()
  }, [user, product])

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !product) return

    try {
      const response = await axios.post(
        'http://localhost:4000/reviews',
        {
          userId: user.id,
          productId: product.id,
          rating,
          comment,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      )

      if (response.status === 200) {
        // Refresh reviews after successful submission
        const reviewsResponse = await axios.get(
          `http://localhost:4000/reviews/${id}`
        )
        setReviews(reviewsResponse.data)
        setCanReview(false)
        setRating(5)
        setComment('')
      }
    } catch (err) {
      console.error('Ошибка отправки отзыва:', err)
    }
  }

  if (isLoading) {
    return <div>Загрузка</div>
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  if (!product) {
    return <div className="text-center">Товар не найден</div>
  }

  function isVideo(mediaUrl: string) {
    return mediaUrl.endsWith('.webm') ? true : false
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center mb-8">
        {isVideo(product.imageUrl) ? (
          <video
            src={product.imageUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full max-w-md"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full max-w-md object-contain"
          />
        )}
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <p className="text-lg mb-4">${product.price}</p>
        <p className="text-gray-700">{product.description}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Отзывы</h2>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <Card key={index} className="mb-4">
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-5 w-5 ${
                          i < review.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold">{review.username}</span>
                </div>
                <p className="text-gray-600 mb-2">{review.comment}</p>
                <p className="text-sm text-gray-400">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>Пока нет отзывов для этого товара.</p>
        )}
      </div>

      {canReview && (
        <div>
          <h2 className="text-xl font-bold mb-4">Оставить отзыв</h2>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label
                htmlFor="rating"
                className="block text-sm font-medium text-gray-700"
              >
                Рейтинг
              </label>
              <Input
                type="number"
                id="rating"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                required
              />
            </div>
            <div>
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-gray-700"
              >
                Комментарий
              </label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e: any) => setComment(e.target.value)}
                required
              />
            </div>
            <Button type="submit">Отправить отзыв</Button>
          </form>
        </div>
      )}
    </div>
  )
}
