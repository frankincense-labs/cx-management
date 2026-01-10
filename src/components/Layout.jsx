import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard,
  Feedback,
  Support,
  History,
  Logout,
  AccountCircle,
  Delete,
} from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'

function Layout({ children }) {
  const { currentUser, userRole, logout, deleteAccount } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [deleting, setDeleting] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleDeleteAccountClick = () => {
    setDeleteDialogOpen(true)
    setAnchorEl(null)
    setDeletePassword('')
    setDeleteError('')
  }

  const handleDeleteAccount = async () => {
    setDeleteError('')
    setDeleting(true)

    try {
      // Check if user signed in with Google
      const isGoogleUser = currentUser?.providerData?.some(
        (provider) => provider.providerId === 'google.com'
      )

      if (isGoogleUser) {
        // For Google users, we'll re-authenticate via popup
        await deleteAccount()
      } else {
        // For email/password users, require password
        if (!deletePassword) {
          setDeleteError('Password is required to delete your account')
          setDeleting(false)
          return
        }
        await deleteAccount(deletePassword)
      }

      setDeleteDialogOpen(false)
      navigate('/login')
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        setDeleteError('Incorrect password. Please try again.')
      } else if (error.code === 'auth/requires-recent-login') {
        setDeleteError('For security, please sign out and sign back in, then try again.')
      } else if (error.message === 'Password required for account deletion') {
        setDeleteError('Password is required to delete your account')
      } else {
        setDeleteError(error.message || 'Failed to delete account. Please try again.')
      }
      console.error(error)
    } finally {
      setDeleting(false)
    }
  }

  const customerMenuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/customer/dashboard' },
    { text: 'Submit Feedback', icon: <Feedback />, path: '/customer/submit-feedback' },
    { text: 'My Feedback', icon: <Feedback />, path: '/customer/my-feedback' },
    { text: 'Create Ticket', icon: <Support />, path: '/customer/create-ticket' },
    { text: 'My Tickets', icon: <Support />, path: '/customer/my-tickets' },
    { text: 'History', icon: <History />, path: '/customer/history' },
  ]

  const adminMenuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
    { text: 'Review Feedback', icon: <Feedback />, path: '/admin/review-feedback' },
    { text: 'Manage Tickets', icon: <Support />, path: '/admin/manage-tickets' },
    { text: 'All Interactions', icon: <History />, path: '/admin/all-interactions' },
  ]

  const menuItems = userRole === 'admin' ? adminMenuItems : customerMenuItems

  const drawer = (
    <Box sx={{ width: 250, pt: 2 }}>
      <List>
        {menuItems.map((item) => {
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(item.path)
                  setDrawerOpen(false)
                }}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CX Management Platform
            <Typography variant="caption" sx={{ ml: 1, opacity: 0.8 }}>
              for FinTech Startups
            </Typography>
          </Typography>
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  color="inherit"
                  onClick={() => navigate(item.path)}
                  sx={{
                    backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
          <IconButton
            color="inherit"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem disabled>
              <Typography variant="body2">{currentUser?.email}</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
            <MenuItem onClick={handleDeleteAccountClick} sx={{ color: 'error.main' }}>
              <ListItemIcon>
                <Delete fontSize="small" sx={{ color: 'error.main' }} />
              </ListItemIcon>
              Delete Account
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {drawer}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => !deleting && setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone. All your data will be permanently deleted.
          </Alert>
          {currentUser?.providerData?.some((p) => p.providerId === 'google.com') ? (
            <Typography variant="body2" color="text.secondary">
              You will be asked to sign in with Google again to confirm this action.
            </Typography>
          ) : (
            <TextField
              autoFocus
              margin="dense"
              label="Enter your password to confirm"
              type="password"
              fullWidth
              variant="outlined"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              disabled={deleting}
              error={!!deleteError}
              helperText={deleteError}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
            disabled={deleting || (!currentUser?.providerData?.some((p) => p.providerId === 'google.com') && !deletePassword)}
          >
            {deleting ? 'Deleting...' : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Layout
