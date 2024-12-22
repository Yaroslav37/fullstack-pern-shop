import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/AuthContext'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Star } from 'lucide-react'
import axios from 'axios'
import Navbar from '@/components/ui/Navbar'

interface Review {
  rating: number
  comment: string
  created_at: string
  username: string
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [canReview, setCanReview] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const { user } = useUser()
  const reviewsPerPage = 4

  useEffect(() => {
    fetchReviews()
    if (user) {
      checkCanReview()
    }
  }, [user])

  const fetchReviews = async () => {
    try {
      const response = await axios.get('http://localhost:4000/reviews')
      setReviews(response.data)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const checkCanReview = async () => {
    try {
      const response = await axios.get(
        'http://localhost:4000/reviews/can-review',
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      )
      setCanReview(response.data.canReview)
    } catch (error) {
      console.error('Error checking review eligibility:', error)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post(
        'http://localhost:4000/reviews',
        { rating, comment },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      )
      fetchReviews()
      setCanReview(false)
      setRating(5)
      setComment('')
    } catch (error) {
      console.error('Error submitting review:', error)
    }
  }

  const totalPages = Math.ceil(reviews.length / reviewsPerPage)
  const displayedReviews = reviews.slice(
    currentPage * reviewsPerPage,
    (currentPage + 1) * reviewsPerPage
  )

  return (
    <div className="container mx-auto py-12 px-32">
      <Navbar />
      <h1 className="text-3xl font-bold text-center mb-8 pt-10">
        Customer Reviews
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {displayedReviews.map((review, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? 'fill-primary text-primary'
                        : 'fill-muted text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-4">{review.comment}</p>
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <div className="font-semibold">{review.username}</div>
              <div className="text-sm text-muted-foreground">
                {new Date(review.created_at).toLocaleDateString()}
              </div>
            </CardFooter>
            <div className="absolute top-4 right-4 text-4xl text-muted-foreground/20">
              "
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 mb-8">
        <Button
          variant="outline"
          onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
          disabled={currentPage === 0}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          {currentPage + 1} / {totalPages}
        </span>
        <Button
          variant="outline"
          onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={currentPage === totalPages - 1}
        >
          Next
        </Button>
      </div>

      {canReview && (
        <div className="max-w-md pt-10">
          <h2 className="text-2xl font-bold mb-4">Leave a Review</h2>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Button
                    key={value}
                    onClick={() => setRating(value)}
                    className="w-full"
                    variant="none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        value <= rating
                          ? 'fill-orange-400 text-primary'
                          : 'fill-muted text-muted-foreground'
                      }`}
                    />
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Comment</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                required
                className="min-h-[100px]"
              />
            </div>
            <Button type="submit" className="w-full">
              Submit Review
            </Button>
          </form>
        </div>
      )}
    </div>
  )
}
