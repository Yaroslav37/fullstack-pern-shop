import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useUser } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  adminOnly = false,
}) => {
  const { user } = useUser()
  const location = useLocation()

  if (!user) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  if (adminOnly && user.role_id !== 1) {
    // Assuming role_id 1 is for admin
    // Redirect to home if user is not an admin
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
