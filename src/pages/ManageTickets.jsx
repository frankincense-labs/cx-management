import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  TextField,
  MenuItem,
  Grid,
  Tabs,
  Tab,
  Chip,
} from '@mui/material'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import { subscribeToAllTickets } from '../services/ticketService'

function ManageTickets() {
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [filteredTickets, setFilteredTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusTab, setStatusTab] = useState(0)
  const [customerFilter, setCustomerFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    setLoading(true)
    const unsubscribe = subscribeToAllTickets((data) => {
      setTickets(data)
      setFilteredTickets(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    filterTickets()
  }, [statusTab, customerFilter, priorityFilter, startDate, endDate, tickets])

  function filterTickets() {
    let filtered = [...tickets]

    // Status filter from tabs
    if (statusTab === 1) {
      filtered = filtered.filter((t) => t.status === 'open')
    } else if (statusTab === 2) {
      filtered = filtered.filter((t) => t.status === 'in-progress' || t.status === 'in progress')
    } else if (statusTab === 3) {
      filtered = filtered.filter((t) => t.status === 'resolved')
    }

    // Customer filter
    if (customerFilter !== 'all') {
      filtered = filtered.filter((t) => t.email === customerFilter)
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter((t) => t.priority === priorityFilter)
    }

    // Date range filtering
    if (startDate) {
      const start = new Date(startDate)
      start.setHours(0, 0, 0, 0)
      filtered = filtered.filter((t) => {
        const ticketDate = new Date(t.createdAt)
        ticketDate.setHours(0, 0, 0, 0)
        return ticketDate >= start
      })
    }

    if (endDate) {
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
      filtered = filtered.filter((t) => {
        const ticketDate = new Date(t.createdAt)
        return ticketDate <= end
      })
    }

    setFilteredTickets(filtered)
  }

  const openCount = tickets.filter((t) => t.status === 'open').length
  const inProgressCount = tickets.filter((t) => t.status === 'in-progress' || t.status === 'in progress').length
  const resolvedCount = tickets.filter((t) => t.status === 'resolved').length

  const uniqueCustomers = [...new Set(tickets.map((t) => t.email))].sort()

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
          Manage Tickets
        </Typography>

        <Card sx={{ mb: 3 }}>
          <Tabs value={statusTab} onChange={(e, newValue) => setStatusTab(newValue)}>
            <Tab label={`All (${tickets.length})`} />
            <Tab label={`Open (${openCount})`} />
            <Tab label={`In Progress (${inProgressCount})`} />
            <Tab label={`Resolved (${resolvedCount})`} />
          </Tabs>
        </Card>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Filter by Customer"
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
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
              select
              label="Filter by Priority"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <MenuItem value="all">All Priorities</MenuItem>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
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
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>

        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent>
              <Typography variant="body1" color="textSecondary" align="center" sx={{ py: 4 }}>
                {tickets.length === 0
                  ? 'No tickets created yet.'
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
                  onClick={() => navigate(`/admin/ticket/${ticket.id}`)}
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
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                          {ticket.email}
                        </Typography>
                      </Box>
                      <StatusBadge status={ticket.status} />
                    </Box>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      {ticket.description.length > 200
                        ? `${ticket.description.substring(0, 200)}...`
                        : ticket.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', mt: 2 }}>
                      {ticket.priority && (
                        <Chip
                          label={`Priority: ${ticket.priority.toUpperCase()}`}
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

export default ManageTickets

