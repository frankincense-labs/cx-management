import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Tabs,
  Tab,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  MenuItem,
  Grid,
  Chip,
} from '@mui/material'
import { Feedback, Support } from '@mui/icons-material'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import StarRating from '../components/StarRating'
import { subscribeToAllFeedback } from '../services/feedbackService'
import { subscribeToAllTickets } from '../services/ticketService'

function AllInteractions() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [tabValue, setTabValue] = useState(0)
  const [interactions, setInteractions] = useState([])
  const [filteredInteractions, setFilteredInteractions] = useState([])
  const [customerFilter, setCustomerFilter] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    setLoading(true)
    let feedbackData = []
    let ticketsData = []

    const unsubscribeFeedback = subscribeToAllFeedback((data) => {
      feedbackData = data
      updateInteractions(feedbackData, ticketsData)
    })

    const unsubscribeTickets = subscribeToAllTickets((data) => {
      ticketsData = data
      updateInteractions(feedbackData, ticketsData)
    })

    function updateInteractions(feedback, tickets) {
      const allInteractions = [
        ...feedback.map((f) => ({ ...f, type: 'feedback', date: f.createdAt })),
        ...tickets.map((t) => ({ ...t, type: 'ticket', date: t.createdAt })),
      ].sort((a, b) => new Date(b.date) - new Date(a.date))

      setInteractions(allInteractions)
      setFilteredInteractions(allInteractions)
      setLoading(false)
    }

    return () => {
      unsubscribeFeedback()
      unsubscribeTickets()
    }
  }, [])

  useEffect(() => {
    filterInteractions()
  }, [tabValue, customerFilter, startDate, endDate, interactions])

  function filterInteractions() {
    let filtered = [...interactions]

    // Type filter from tabs
    if (tabValue === 1) {
      filtered = filtered.filter((i) => i.type === 'feedback')
    } else if (tabValue === 2) {
      filtered = filtered.filter((i) => i.type === 'ticket')
    }

    // Customer filter
    if (customerFilter !== 'all') {
      filtered = filtered.filter((i) => i.email === customerFilter)
    }

    // Date range filtering
    if (startDate) {
      const start = new Date(startDate)
      start.setHours(0, 0, 0, 0)
      filtered = filtered.filter((i) => {
        const interactionDate = new Date(i.date)
        interactionDate.setHours(0, 0, 0, 0)
        return interactionDate >= start
      })
    }

    if (endDate) {
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
      filtered = filtered.filter((i) => {
        const interactionDate = new Date(i.date)
        return interactionDate <= end
      })
    }

    setFilteredInteractions(filtered)
  }

  const uniqueCustomers = [...new Set(interactions.map((i) => i.email))].sort()

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
          All Interactions
        </Typography>

        <Paper sx={{ mb: 3, p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
                <Tab label="All" />
                <Tab label="Feedback" />
                <Tab label="Tickets" />
              </Tabs>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                select
                label="Filter by Customer"
                value={customerFilter}
                onChange={(e) => setCustomerFilter(e.target.value)}
                size="small"
              >
                <MenuItem value="all">All Customers</MenuItem>
                {uniqueCustomers.map((email) => (
                  <MenuItem key={email} value={email}>
                    {email}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                size="small"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                size="small"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        {filteredInteractions.length === 0 ? (
          <Card>
            <CardContent>
              <Typography variant="body1" color="textSecondary" align="center" sx={{ py: 4 }}>
                No interactions found.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <List>
            {filteredInteractions.map((item) => (
              <Card key={item.id} sx={{ mb: 2 }}>
                <ListItem
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
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="subtitle1">
                          {item.type === 'ticket' ? item.subject : `Feedback (${item.rating}/5)`}
                        </Typography>
                        {item.type === 'ticket' ? (
                          <StatusBadge status={item.status} />
                        ) : (
                          <>
                            <StarRating value={item.rating} readOnly size="small" />
                            <StatusBadge status={item.status} />
                          </>
                        )}
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                          {item.email}
                        </Typography>
                        {item.type === 'ticket' && (
                          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                            {item.description.length > 100
                              ? `${item.description.substring(0, 100)}...`
                              : item.description}
                          </Typography>
                        )}
                        {item.type === 'feedback' && (
                          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                            {item.comment.length > 100
                              ? `${item.comment.substring(0, 100)}...`
                              : item.comment}
                          </Typography>
                        )}
                        <Typography variant="caption" color="textSecondary">
                          {new Date(item.date).toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              </Card>
            ))}
          </List>
        )}
      </Container>
    </Layout>
  )
}

export default AllInteractions

