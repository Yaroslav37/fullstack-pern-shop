import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'

interface User {
  id: number
  username: string
  email: string
  role: string
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/users')
      setUsers(response.data.users)
      setIsLoading(false)
    } catch (error) {
      setError('Ошибка получения пользователей')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleAssignAdmin = async (userId: number) => {
    try {
      await axios.put(`http://localhost:4000/users/${userId}/assign-admin`)
      toast({
        title: 'Успешно',
        description: 'Пользователь назначен администратором.',
      })
      fetchUsers() // Обновляем список пользователей
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось назначить администратора.',
        variant: 'destructive',
      })
    }
  }

  if (isLoading) {
    return <div>Загрузка...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Управление пользователями</h1>
      <Table>
        <TableCaption>Список пользователей</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                {user.role === 'User' && (
                  <Button onClick={() => handleAssignAdmin(user.id)}>
                    Make admin
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Toaster />
    </div>
  )
}

export default Users
