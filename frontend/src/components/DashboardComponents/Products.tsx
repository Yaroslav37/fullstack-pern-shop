import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { Label } from '../ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Product, Game } from '@/types'

const tableheads = [
  'ID',
  'IMG',
  'Название',
  'Игра',
  'Описание',
  'Цена',
  'Кол-во',
  'Действия',
]

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [newProduct, setNewProduct] = useState({
    name: '',
    game_id: '',
    description: '',
    price: '',
    stock: '',
    image_url: '',
  })
  const [selectedGame, setSelectedGame] = useState<{
    id: string
    name: string
  } | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get('http://localhost:4000/products')
        const productsData = response.data.products.map((product: any) => ({
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
      } catch (error) {
        setError('Ошибка получения товаров')
        setIsLoading(false)
      }
    }

    const fetchGames = async () => {
      try {
        const response = await axios.get('http://localhost:4000/games')
        setGames(response.data.games)
      } catch (error) {
        console.error('Ошибка получения игр:', error)
      }
    }

    fetchProducts()
    fetchGames()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewProduct((prev) => ({ ...prev, [name]: value }))
  }

  const handleGameChange = (value: string) => {
    setNewProduct((prev) => ({ ...prev, game_id: value }))
    const selectedGame = games.find((game) => game.id === value)
    if (selectedGame) {
      setSelectedGame(selectedGame)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:4000/products', newProduct)
      // Refresh products list
      const response = await axios.get('http://localhost:4000/products')
      setProducts(response.data.products)
      // Reset form
      setNewProduct({
        name: '',
        game_id: '',
        description: '',
        price: '',
        stock: '',
        image_url: '',
      })
      setSelectedGame(null)
    } catch (error) {
      console.error('Ошибка создания товара:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:4000/products/${id}`)
      setProducts(products.filter((product) => product.id !== id))
    } catch (error) {
      console.error('Ошибка удаления товара:', error)
    }
  }

  if (isLoading) {
    return <div>Загрузка...</div>
  }

  if (error) {
    return <div className="bg-red-500">{error}</div>
  }

  function isVideo(mediaUrl: string) {
    return mediaUrl.endsWith('.webm') ? true : false
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Product managment</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="name"
          value={newProduct.name}
          onChange={handleInputChange}
          placeholder="Название товара"
          required
        />
        <Select
          onValueChange={handleGameChange}
          value={newProduct.game_id}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Выберите игру">
              {selectedGame ? selectedGame.name : 'Выберите игру'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {games.map((game) => (
              <SelectItem key={game.id} value={game.id}>
                {game.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          name="description"
          value={newProduct.description}
          onChange={handleInputChange}
          placeholder="Описание"
        />
        <Input
          name="price"
          value={newProduct.price}
          onChange={handleInputChange}
          placeholder="Цена"
          type="number"
          required
        />
        <Input
          name="stock"
          value={newProduct.stock}
          onChange={handleInputChange}
          placeholder="Количество"
          type="number"
          required
        />
        <Input
          name="image_url"
          value={newProduct.image_url}
          onChange={handleInputChange}
          placeholder="URL изображения"
        />
        <Button type="submit">Создать товар</Button>
      </form>

      <Table>
        <TableCaption>Список товаров</TableCaption>
        <TableHeader>
          <TableRow>
            {tableheads.map((tablehead) => {
              return <TableHead className="text-center">{tablehead}</TableHead>
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Label>{product.id}</Label>
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger>
                    <Avatar>
                      {isVideo(product.imageUrl) ? (
                        <AvatarFallback>{product.name[0]}</AvatarFallback>
                      ) : (
                        <AvatarImage
                          src={product.imageUrl}
                          alt={product.name}
                        />
                      )}
                    </Avatar>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>{product.name}</DialogTitle>
                      <DialogDescription>
                        {isVideo(product.imageUrl) ? (
                          <video
                            src={product.imageUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-auto bg-transparent"
                          >
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-auto object-cover"
                          />
                        )}
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.game}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>${product.price}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(product.id)}
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default Products
