import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './components/NotificationProvider'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import CustomerDashboard from './pages/CustomerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import SubmitFeedback from './pages/SubmitFeedback'
import MyFeedback from './pages/MyFeedback'
import CreateTicket from './pages/CreateTicket'
import MyTickets from './pages/MyTickets'
import TicketDetail from './pages/TicketDetail'
import InteractionHistory from './pages/InteractionHistory'
import ReviewFeedback from './pages/ReviewFeedback'
import ManageTickets from './pages/ManageTickets'
import AllInteractions from './pages/AllInteractions'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#ff9800',
    },
    success: {
      main: '#4caf50',
    },
    error: {
      main: '#f44336',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/customer/*"
              element={
                <PrivateRoute requiredRole="customer">
                  <Routes>
                    <Route path="dashboard" element={<CustomerDashboard />} />
                    <Route path="submit-feedback" element={<SubmitFeedback />} />
                    <Route path="my-feedback" element={<MyFeedback />} />
                    <Route path="create-ticket" element={<CreateTicket />} />
                    <Route path="my-tickets" element={<MyTickets />} />
                    <Route path="ticket/:ticketId" element={<TicketDetail />} />
                    <Route path="history" element={<InteractionHistory />} />
                    <Route path="*" element={<Navigate to="/customer/dashboard" replace />} />
                  </Routes>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <PrivateRoute requiredRole="admin">
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="review-feedback" element={<ReviewFeedback />} />
                    <Route path="manage-tickets" element={<ManageTickets />} />
                    <Route path="ticket/:ticketId" element={<TicketDetail />} />
                    <Route path="all-interactions" element={<AllInteractions />} />
                    <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                  </Routes>
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

