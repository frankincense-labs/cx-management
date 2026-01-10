import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material'
import {
  Feedback,
  Support,
  History,
  CheckCircle,
  Schedule,
} from '@mui/icons-material'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { subscribeToUserFeedback } from '../services/feedbackService'
import { subscribeToUserTickets } from '../services/ticketService'

function CustomerDashboard() {
  const { currentUser, userDisplayName } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalFeedback: 0,
    openTickets: 0,
    resolvedTickets: 0,
  })
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    setLoading(true)
    let feedbackData = []
    let ticketsData = []

    const unsubscribeFeedback = subscribeToUserFeedback(currentUser.uid, (data) => {
      feedbackData = data
      updateDashboard(feedbackData, ticketsData)
    })

    const unsubscribeTickets = subscribeToUserTickets(currentUser.uid, (data) => {
      ticketsData = data
      updateDashboard(feedbackData, ticketsData)
    })

    function updateDashboard(feedback, tickets) {
      const openTickets = tickets.filter((t) => t.status === 'open' || t.status === 'in-progress' || t.status === 'in progress')
      const resolvedTickets = tickets.filter((t) => t.status === 'resolved')

      setStats({
        totalFeedback: feedback.length,
        openTickets: openTickets.length,
        resolvedTickets: resolvedTickets.length,
      })

      // Combine and sort recent activity
      const activity = [
        ...feedback.map((f) => ({ ...f, type: 'feedback', date: f.createdAt })),
        ...tickets.map((t) => ({ ...t, type: 'ticket', date: t.createdAt })),
      ]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)

      setRecentActivity(activity)
      setLoading(false)
    }

    return () => {
      unsubscribeFeedback()
      unsubscribeTickets()
    }
  }, [currentUser.uid])

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="lg">
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="60vh" gap={2}>
            <CircularProgress size={50} />
            <Typography variant="body1" color="text.secondary">
              Loading your dashboard...
            </Typography>
          </Box>
        </Container>
      </Layout>
    )
  }

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
            Welcome back, {userDisplayName || currentUser?.email?.split('@')[0]}! 👋
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Here's an overview of your activity and quick actions
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: 3,
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                }
              }}
            >
              <CardContent>
                <Typography color="textSecondary" gutterBottom sx={{ fontWeight: 600 }}>
                  Total Feedback
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {stats.totalFeedback}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: 3,
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                }
              }}
            >
              <CardContent>
                <Typography color="textSecondary" gutterBottom sx={{ fontWeight: 600 }}>
                  Open Tickets
                </Typography>
                <Typography variant="h3" color="warning.main" sx={{ fontWeight: 700 }}>
                  {stats.openTickets}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: 3,
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                }
              }}
            >
              <CardContent>
                <Typography color="textSecondary" gutterBottom sx={{ fontWeight: 600 }}>
                  Resolved Tickets
                </Typography>
                <Typography variant="h3" color="success.main" sx={{ fontWeight: 700 }}>
                  {stats.resolvedTickets}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                height: '100%',
                borderRadius: 3,
                transition: 'all 0.3s',
                '&:hover': {
                  boxShadow: 6,
                }
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Feedback />}
                    onClick={() => navigate('/customer/submit-feedback')}
                    fullWidth
                    size="large"
                    sx={{
                      py: 1.5,
                      fontWeight: 600,
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 6,
                      }
                    }}
                  >
                    Submit Feedback
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Support />}
                    onClick={() => navigate('/customer/create-ticket')}
                    fullWidth
                    size="large"
                    sx={{
                      py: 1.5,
                      fontWeight: 600,
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 6,
                      }
                    }}
                  >
                    Create Support Ticket
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              {recentActivity.length === 0 ? (
                <Typography color="textSecondary" sx={{ mt: 2 }}>
                  No recent activity
                </Typography>
              ) : (
                <List>
                  {recentActivity.map((item, index) => (
                    <ListItem
                      key={index}
                      button
                      onClick={() => {
                        if (item.type === 'ticket') {
                          navigate(`/customer/ticket/${item.id}`)
                        } else {
                          navigate('/customer/my-feedback')
                        }
                      }}
                    >
                      <ListItemIcon>
                        {item.type === 'feedback' ? <Feedback /> : <Support />}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.type === 'ticket' ? item.subject : `Feedback (${item.rating}/5)`}
                        secondary={new Date(item.date).toLocaleDateString()}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  )
}

export default CustomerDashboard

