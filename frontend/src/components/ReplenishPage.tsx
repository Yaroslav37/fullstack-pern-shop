import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useUser } from '@/contexts/AuthContext'
import Navbar from './ui/Navbar'
import { Separator } from '@/components/ui/separator'
import { Toaster } from './ui/toaster'

const topUpSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  promocode: z.string().optional(),
})

export default function TopUpBalancePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isApplyingPromocode, setIsApplyingPromocode] = useState(false)
  const { toast } = useToast()
  const { user, updateBalance } = useUser()

  const form = useForm<z.infer<typeof topUpSchema>>({
    resolver: zodResolver(topUpSchema),
    defaultValues: {
      amount: 0,
      promocode: '',
    },
  })

  async function onSubmit(values: z.infer<typeof topUpSchema>) {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:4000/users/balance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ amount: values.amount }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: 'Balance Updated',
          description: data.message,
        })
        updateBalance(data.balance)
        form.reset()
      } else {
        throw new Error(data.error || 'Failed to update balance')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const applyPromocode = async () => {
    const promocode = form.getValues('promocode')
    if (!promocode) return

    setIsApplyingPromocode(true)
    try {
      const response = await fetch(
        'http://localhost:4000/users/apply-promocode',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ code: promocode }),
        }
      )

      const data = await response.json()

      if (response.ok) {
        toast({
          title: 'Success',
          description: data.message,
        })
        form.setValue('promocode', '')
        updateBalance(data.balance)
      } else {
        throw new Error(data.error || 'Failed to apply promocode')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to apply promocode',
        variant: 'destructive',
      })
    } finally {
      setIsApplyingPromocode(false)
    }
  }

  return (
    <main>
      <Navbar />
      <div className="container mx-auto mt-20 px-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Top Up Balance
            </CardTitle>
            <CardDescription className="text-center">
              Enter the amount you want to add to your balance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter amount"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Processing...' : 'Top Up'}
                </Button>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="promocode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Promocode</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input placeholder="Enter promocode" {...field} />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={applyPromocode}
                            disabled={isApplyingPromocode || !field.value}
                          >
                            {isApplyingPromocode ? 'Applying...' : 'Apply'}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Toaster />
      </div>
    </main>
  )
}
