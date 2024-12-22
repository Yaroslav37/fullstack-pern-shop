import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useUser } from '@/contexts/AuthContext'
import Navbar from '@/components/ui/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Log {
  action: string
  details: string
  timestamp: string
}

interface User {
  id: number
  username: string
  email: string
  role_id: number
  balance: number
}

export default function UserLogs() {
  const [logs, setLogs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useUser()

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        if (!user) {
          throw new Error('User is not authenticated')
        }
        const response = await fetch(
          `http://localhost:4000/users/${user.id}/logs`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch logs')
        }

        const data = await response.text()
        setLogs(data.split('\n'))
        setIsLoading(false)
      } catch (err) {
        setError(`An error occurred while fetching logs: ${err}`)
        setIsLoading(false)
      }
    }

    if (user) {
      fetchLogs()
    }
  }, [user])

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Navbar />
        <div className="text-center text-red-500 mt-32">{error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">User Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] w-full rounded-md border p-4">
            {logs.length === 0 ? (
              <p className="text-center text-gray-500">
                No logs found for this user.
              </p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-2 p-2 bg-gray-100 rounded">
                  {log}
                </div>
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
