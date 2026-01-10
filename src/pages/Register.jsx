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
  Avatar,
  CssBaseline,
  Grid,
  Divider,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { PersonAdd, Google, Visibility, VisibilityOff } from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [adminCode, setAdminCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const { signup, loginWithGoogle, userRole, currentUser } = useAuth()
  const navigate = useNavigate()

  // Redirect based on role after successful signup
  useEffect(() => {
    // Only redirect if we just signed up (not on initial load)
    if (currentUser && userRole && !loading && !googleLoading) {
      // Small delay to ensure role is fully set
      const timer = setTimeout(() => {
        if (userRole === 'admin') {
          navigate('/admin/dashboard', { replace: true })
        } else {
          navigate('/customer/dashboard', { replace: true })
        }
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [currentUser, userRole, loading, googleLoading, navigate])

  function validatePassword(pwd) {
    const errors = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    }
    setPasswordErrors(errors)
    return Object.values(errors).every(Boolean)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Please enter your name')
      return
    }

    if (!validatePassword(password)) {
      setError('Password does not meet requirements')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      await signup(email, password, name.trim(), adminCode.trim())
      // Role-based redirect will happen via useEffect
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.')
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address')
      } else {
        setError('Failed to create account. Please try again.')
      }
      console.error(err)
    } finally {
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
        setError('Failed to sign up with Google. Please try again.')
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
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <PersonAdd />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
          Sign up
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                label="Full Name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  validatePassword(e.target.value)
                }}
                helperText={
                  <Box component="span" sx={{ fontSize: '0.75rem' }}>
                    Password must contain:
                    <Box component="ul" sx={{ margin: 0.5, pl: 2 }}>
                      <li style={{ color: passwordErrors.length ? 'green' : 'inherit' }}>
                        At least 8 characters
                      </li>
                      <li style={{ color: passwordErrors.uppercase ? 'green' : 'inherit' }}>
                        One uppercase letter
                      </li>
                      <li style={{ color: passwordErrors.lowercase ? 'green' : 'inherit' }}>
                        One lowercase letter
                      </li>
                      <li style={{ color: passwordErrors.number ? 'green' : 'inherit' }}>
                        One number
                      </li>
                      <li style={{ color: passwordErrors.special ? 'green' : 'inherit' }}>
                        One special character (!@#$%^&*...)
                      </li>
                    </Box>
                  </Box>
                }
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={confirmPassword.length > 0 && password !== confirmPassword}
                helperText={
                  confirmPassword.length > 0 && password !== confirmPassword
                    ? 'Passwords do not match'
                    : ''
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="adminCode"
                label="Admin Code (Optional)"
                id="adminCode"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                helperText="Leave blank to sign up as a customer. Enter admin code to create an admin account (email/password sign-up only)."
                placeholder="Enter admin code if you have one"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading || googleLoading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign Up'}
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
            {googleLoading ? <CircularProgress size={24} /> : 'Sign up with Google'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link
                to="/login"
                style={{
                  textDecoration: 'none',
                  color: 'primary.main',
                  fontWeight: 500,
                }}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default Register
