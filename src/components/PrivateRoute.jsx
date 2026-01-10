import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Box, CircularProgress } from '@mui/material'

function PrivateRoute({ children, requiredRole }) {
  const { currentUser, userRole, loading } = useAuth()

  // Show loading while checking auth
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  // If role is still loading, allow access (role will update in background)
  // This prevents hanging on slow Firestore queries
  if (requiredRole && userRole && userRole !== requiredRole) {
    // Redirect to appropriate dashboard based on actual role
    if (userRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />
    }
    return <Navigate to="/customer/dashboard" replace />
  }

  // If role is not yet loaded but user is authenticated, allow access
  // The correct role will be applied once fetched
  return children
}

export default PrivateRoute

