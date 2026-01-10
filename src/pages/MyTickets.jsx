import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Button,
  TextField,
  MenuItem,
  Grid,
  Chip,
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import { useAuth } from '../context/AuthContext'
import { subscribeToUserTickets } from '../services/ticketService'

function MyTickets() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [filteredTickets, setFilteredTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    setLoading(true)
    const unsubscribe = subscribeToUserTickets(currentUser.uid, (data) => {
      setTickets(data)
      setFilteredTickets(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [currentUser.uid])

  useEffect(() => {
    filterTickets()
  }, [statusFilter, tickets])

  function filterTickets() {
    if (statusFilter === 'all') {
      setFilteredTickets(tickets)
    } else {
      const normalizedStatus = statusFilter.toLowerCase().replace(' ', '-')
      setFilteredTickets(
        tickets.filter((t) => {
          const ticketStatus = t.status.toLowerCase().replace(' ', '-')
          return ticketStatus === normalizedStatus
        })
      )
    }
  }

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">My Tickets</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/customer/create-ticket')}
          >
            Create New Ticket
          </Button>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Filter by Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent>
              <Typography variant="body1" color="textSecondary" align="center" sx={{ py: 4 }}>
                {tickets.length === 0
                  ? "You haven't created any tickets yet."
                  : 'No tickets match your filters.'}
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={2}>
            {filteredTickets.map((ticket) => (
              <Grid item xs={12} key={ticket.id}>
                <Card
                  sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}
                  onClick={() => navigate(`/customer/ticket/${ticket.id}`)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {ticket.ticketId || ticket.id}
                        </Typography>
                        <Typography variant="subtitle1" color="textPrimary">
                          {ticket.subject}
                        </Typography>
                      </Box>
                      <StatusBadge status={ticket.status} />
                    </Box>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      {ticket.description.length > 150
                        ? `${ticket.description.substring(0, 150)}...`
                        : ticket.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 2 }}>
                      {ticket.priority && (
                        <Chip
                          label={ticket.priority.toUpperCase()}
                          size="small"
                          color={ticket.priority === 'high' ? 'error' : ticket.priority === 'medium' ? 'warning' : 'default'}
                        />
                      )}
                      <Typography variant="caption" color="textSecondary">
                        Created: {new Date(ticket.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Layout>
  )
}

export default MyTickets

