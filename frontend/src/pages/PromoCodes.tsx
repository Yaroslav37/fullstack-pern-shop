'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Promocode, NewPromocode } from '../types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const PromocodesManager: React.FC = () => {
  const [promocodes, setPromocodes] = useState<Promocode[]>([])
  const [newPromocode, setNewPromocode] = useState<NewPromocode>({
    code: '',
    discount: 0,
    expiration_date: '',
    is_active: true,
  })
  const [editingPromocode, setEditingPromocode] = useState<Promocode | null>(
    null
  )
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] =
    useState<Promocode | null>(null)

  useEffect(() => {
    fetchPromocodes()
  }, [])

  const fetchPromocodes = async () => {
    try {
      const response = await axios.get<{ promocodes: Promocode[] }>(
        'http://localhost:4000/promocodes'
      )
      setPromocodes(response.data.promocodes)
    } catch (error) {
      console.error('Error fetching promocodes:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    const inputValue =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : value

    if (editingPromocode) {
      setEditingPromocode({ ...editingPromocode, [name]: inputValue })
    } else {
      setNewPromocode({ ...newPromocode, [name]: inputValue })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingPromocode) {
        await axios.put(
          `http://localhost:4000/promocodes/${editingPromocode.id}`,
          editingPromocode
        )
        setEditingPromocode(null)
      } else {
        await axios.post('http://localhost:4000/promocodes', newPromocode)
        setNewPromocode({
          code: '',
          discount: 0,
          expiration_date: '',
          is_active: true,
        })
      }
      fetchPromocodes()
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error submitting promocode:', error)
    }
  }

  const startEditing = (promocode: Promocode) => {
    setEditingPromocode(promocode)
    setIsDialogOpen(true)
  }

  const cancelEditing = () => {
    setEditingPromocode(null)
    setIsDialogOpen(false)
  }

  const deletePromocode = async (promocode: Promocode) => {
    try {
      await axios.delete(`http://localhost:4000/promocodes/${promocode.id}`)
      fetchPromocodes()
    } catch (error) {
      console.error('Error deleting promocode:', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Promocodes Manager</h1>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button>Add New Promocode</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPromocode ? 'Edit Promocode' : 'Add New Promocode'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  name="code"
                  value={editingPromocode?.code || newPromocode.code}
                  onChange={handleInputChange}
                  placeholder="Enter promocode"
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="discount">Discount</Label>
                <Input
                  id="discount"
                  name="discount"
                  type="number"
                  value={editingPromocode?.discount || newPromocode.discount}
                  onChange={handleInputChange}
                  placeholder="Enter discount"
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="expiration_date">Expiration Date</Label>
                <Input
                  id="expiration_date"
                  name="expiration_date"
                  type="date"
                  value={
                    editingPromocode?.expiration_date ||
                    newPromocode.expiration_date
                  }
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  name="is_active"
                  checked={
                    editingPromocode?.is_active || newPromocode.is_active
                  }
                  onCheckedChange={(checked) => {
                    if (editingPromocode) {
                      setEditingPromocode({
                        ...editingPromocode,
                        is_active: checked as boolean,
                      })
                    } else {
                      setNewPromocode({
                        ...newPromocode,
                        is_active: checked as boolean,
                      })
                    }
                  }}
                />
                <Label htmlFor="is_active">Is Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                {editingPromocode ? 'Update Promocode' : 'Add Promocode'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Table className="mt-8">
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Expiration Date</TableHead>
            <TableHead>Is Active</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promocodes.map((promocode) => (
            <TableRow key={promocode.id}>
              <TableCell>{promocode.code}</TableCell>
              <TableCell>{promocode.discount}</TableCell>
              <TableCell>
                {new Date(promocode.expiration_date).toLocaleDateString()}
              </TableCell>
              <TableCell>{promocode.is_active ? 'Yes' : 'No'}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => startEditing(promocode)}
                >
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the promocode.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deletePromocode(promocode)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default PromocodesManager
