import React, { createContext, useState, useContext, useEffect } from 'react'

interface User {
  id: number
  username: string
  email: string
  role_id: number
  balance: number
}

interface UserContextType {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  logout: () => void
  updateBalance: (newBalance: number) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchUserData(token)
    }
  }, [])

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch('http://localhost:4000/auth/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
      } else {
        console.error('Failed to fetch user data')
        logout()
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      logout()
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const updateBalance = (newBalance: number) => {
    setUser((prevUser) =>
      prevUser ? { ...prevUser, balance: newBalance } : null
    )
    const updatedUser = { ...user, balance: newBalance }
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  return (
    <UserContext.Provider value={{ user, setUser, logout, updateBalance }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
