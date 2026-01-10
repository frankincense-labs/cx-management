import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function useRoleRedirect() {
  const { currentUser, userRole, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && currentUser && userRole) {
      if (userRole === 'admin') {
        navigate('/admin/dashboard', { replace: true })
      } else {
        navigate('/customer/dashboard', { replace: true })
      }
    }
  }, [currentUser, userRole, loading, navigate])
}

