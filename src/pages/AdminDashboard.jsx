import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
} from '@mui/material'
import {
  Feedback,
  Support,
  History,
  CheckCircle,
  Schedule,
  Warning,
} from '@mui/icons-material'
import Layout from '../components/Layout'
import { subscribeToAllFeedback } from '../services/feedbackService'
import { subscribeToAllTickets } from '../services/ticketService'

function AdminDashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalFeedback: 0,
    reviewedFeedback: 0,
    openTickets: 0,
    resolvedTickets: 0,
    inProgressTickets: 0,
  })
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    setLoading(true)
    let feedbackData = []
    let ticketsData = []

    const unsubscribeFeedback = subscribeToAllFeedback((data) => {
      feedbackData = data
      updateDashboard(feedbackData, ticketsData)
    })

    const unsubscribeTickets = subscribeToAllTickets((data) => {
      ticketsData = data
      updateDashboard(feedbackData, ticketsData)
    })

    function updateDashboard(feedback, tickets) {
      const reviewedFeedback = feedback.filter((f) => f.status === 'reviewed')
      const openTickets = tickets.filter((t) => t.status === 'open')
      const inProgressTickets = tickets.filter((t) => t.status === 'in-progress' || t.status === 'in progress')
      const resolvedTickets = tickets.filter((t) => t.status === 'resolved')

      setStats({
        totalFeedback: feedback.length,
        reviewedFeedback: reviewedFeedback.length,
        openTickets: openTickets.length,
        resolvedTickets: resolvedTickets.length,
        inProgressTickets: inProgressTickets.length,
      })

      // Combine and sort recent activity
      const activity = [
        ...feedback
          .filter((f) => f.status === 'submitted')
          .map((f) => ({ ...f, type: 'feedback', date: f.createdAt })),
        ...tickets
          .filter((t) => t.status === 'open')
          .map((t) => ({ ...t, type: 'ticket', date: t.createdAt })),
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
  }, [])

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Layout>
    )
  }

  return (
    <Layout>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Admin Dashboard
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Feedback
                </Typography>
                <Typography variant="h4">{stats.totalFeedback}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {stats.reviewedFeedback} reviewed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Open Tickets
                </Typography>
                <Typography variant="h4" color="primary.main">
                  {stats.openTickets}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  In Progress
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {stats.inProgressTickets}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Resolved Tickets
                </Typography>
                <Typography variant="h4" color="success.main">
                  {stats.resolvedTickets}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Feedback />}
                    onClick={() => navigate('/admin/review-feedback')}
                    fullWidth
                    size="large"
                  >
                    Review Feedback
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Support />}
                    onClick={() => navigate('/admin/manage-tickets')}
                    fullWidth
                    size="large"
                  >
                    Manage Tickets
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
                          navigate(`/admin/ticket/${item.id}`)
                        } else {
                          navigate('/admin/review-feedback')
                        }
                      }}
                    >
                      <ListItemIcon>
                        {item.type === 'feedback' ? <Feedback /> : <Support />}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.type === 'ticket' ? item.subject : `Feedback (${item.rating}/5)`}
                        secondary={`${item.email} • ${new Date(item.date).toLocaleDateString()}`}
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

export default AdminDashboard

