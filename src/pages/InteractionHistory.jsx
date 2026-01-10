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
  Chip,
} from '@mui/material'
import { Feedback, Support } from '@mui/icons-material'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import StarRating from '../components/StarRating'
import { useAuth } from '../context/AuthContext'
import { subscribeToUserFeedback } from '../services/feedbackService'
import { subscribeToUserTickets } from '../services/ticketService'

function InteractionHistory() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [tabValue, setTabValue] = useState(0)
  const [interactions, setInteractions] = useState([])

  useEffect(() => {
    setLoading(true)
    let feedbackData = []
    let ticketsData = []

    const unsubscribeFeedback = subscribeToUserFeedback(currentUser.uid, (data) => {
      feedbackData = data
      updateInteractions(feedbackData, ticketsData)
    })

    const unsubscribeTickets = subscribeToUserTickets(currentUser.uid, (data) => {
      ticketsData = data
      updateInteractions(feedbackData, ticketsData)
    })

    function updateInteractions(feedback, tickets) {
      const allInteractions = [
        ...feedback.map((f) => ({ ...f, type: 'feedback', date: f.createdAt })),
        ...tickets.map((t) => ({ ...t, type: 'ticket', date: t.createdAt })),
      ].sort((a, b) => new Date(b.date) - new Date(a.date))

      setInteractions(allInteractions)
      setLoading(false)
    }

    return () => {
      unsubscribeFeedback()
      unsubscribeTickets()
    }
  }, [currentUser.uid])

  function filterInteractions() {
    // This is handled by the display logic, but we keep it for consistency
  }

  const filteredInteractions = tabValue === 0
    ? interactions
    : tabValue === 1
    ? interactions.filter((i) => i.type === 'feedback')
    : interactions.filter((i) => i.type === 'ticket')

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
          Interaction History
        </Typography>

        <Paper sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="All" />
            <Tab label="Feedback" />
            <Tab label="Tickets" />
          </Tabs>
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

export default InteractionHistory

