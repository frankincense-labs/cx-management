import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Avatar,
  CssBaseline,
  Divider,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { LockOutlined, Google, Visibility, VisibilityOff } from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'

function Login() {
  // Load saved email from localStorage
  const [email, setEmail] = useState(() => {
    return localStorage.getItem('rememberedEmail') || ''
  })
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(() => {
    return !!localStorage.getItem('rememberedEmail')
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const { login, loginWithGoogle, userRole, currentUser } = useAuth()
  const navigate = useNavigate()

  // Save email when remember me is checked
  useEffect(() => {
    if (rememberMe && email) {
      localStorage.setItem('rememberedEmail', email)
    } else if (!rememberMe) {
      localStorage.removeItem('rememberedEmail')
    }
  }, [rememberMe, email])

  // Redirect immediately after login - don't wait for role fetch
  useEffect(() => {
    if (currentUser && !loading && !googleLoading) {
      // Redirect immediately, role will be fetched in background
      // If role is already available, use it; otherwise default to customer
      const timer = setTimeout(() => {
        if (userRole === 'admin') {
          navigate('/admin/dashboard', { replace: true })
        } else {
          navigate('/customer/dashboard', { replace: true })
        }
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [currentUser, userRole, loading, googleLoading, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      // Save email if remember me is checked
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email)
      }
      // Redirect will happen via useEffect - don't wait for role
      // Don't set loading to false here - let redirect happen
    } catch (err) {
      let errorMessage = 'Failed to sign in. Please check your email and password.'
      if (err.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password. Please try again.'
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please sign up first.'
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.'
      }
      setError(errorMessage)
      console.error(err)
      setLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    setError('')
    setGoogleLoading(true)

    try {
      await loginWithGoogle()
      // Role-based redirect will happen via useEffect
    } catch (err) {
      // Show specific error messages
      if (err.message) {
        setError(err.message)
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup was blocked by your browser. Please allow popups for this site and try again.')
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed. Please try again.')
      } else {
        setError('Failed to sign in with Google. Please try again.')
      }
      console.error(err)
      setGoogleLoading(false)
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar 
          sx={{ 
            m: 1, 
            bgcolor: 'primary.main',
            width: 56,
            height: 56,
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        >
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
          Sign in
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Welcome back! Please sign in to continue.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                value="remember"
                color="primary"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
            }
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ 
              mt: 3, 
              mb: 2,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 6,
              },
              '&:disabled': {
                transform: 'none',
              }
            }}
            disabled={loading || googleLoading}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
          
          <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
            <Divider sx={{ flexGrow: 1 }} />
            <Typography variant="body2" sx={{ px: 2, color: 'text.secondary' }}>
              OR
            </Typography>
            <Divider sx={{ flexGrow: 1 }} />
          </Box>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<Google />}
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
            sx={{ mb: 2 }}
          >
            {googleLoading ? <CircularProgress size={24} /> : 'Sign in with Google'}
          </Button>

          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Link
              to="#"
              style={{ textDecoration: 'none', color: 'inherit', fontSize: '0.875rem' }}
              onClick={(e) => {
                e.preventDefault()
                // TODO: Implement forgot password
                alert('Forgot password feature coming soon!')
              }}
            >
              Forgot password?
            </Link>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link
                to="/register"
                style={{
                  textDecoration: 'none',
                  color: 'primary.main',
                  fontWeight: 500,
                }}
              >
                Sign up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default Login
