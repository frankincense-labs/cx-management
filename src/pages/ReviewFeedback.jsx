import { useState, useEffect } from 'react'
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
  Button,
  Chip,
} from '@mui/material'
import { AttachFile, Image as ImageIcon } from '@mui/icons-material'
import Layout from '../components/Layout'
import StarRating from '../components/StarRating'
import StatusBadge from '../components/StatusBadge'
import { subscribeToAllFeedback, markFeedbackAsReviewed } from '../services/feedbackService'

function ReviewFeedback() {
  const [feedback, setFeedback] = useState([])
  const [filteredFeedback, setFilteredFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [ratingFilter, setRatingFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [customerFilter, setCustomerFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [updating, setUpdating] = useState({})

  useEffect(() => {
    setLoading(true)
    const unsubscribe = subscribeToAllFeedback((data) => {
      setFeedback(data)
      setFilteredFeedback(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    filterFeedback()
  }, [ratingFilter, statusFilter, customerFilter, categoryFilter, startDate, endDate, feedback])

  function filterFeedback() {
    let filtered = [...feedback]

    if (ratingFilter !== 'all') {
      filtered = filtered.filter((f) => f.rating === parseInt(ratingFilter))
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((f) => f.status === statusFilter)
    }

    if (customerFilter !== 'all') {
      filtered = filtered.filter((f) => f.email === customerFilter)
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((f) => f.category === categoryFilter)
    }

    // Date range filtering
    if (startDate) {
      const start = new Date(startDate)
      start.setHours(0, 0, 0, 0)
      filtered = filtered.filter((f) => {
        const feedbackDate = new Date(f.createdAt)
        feedbackDate.setHours(0, 0, 0, 0)
        return feedbackDate >= start
      })
    }

    if (endDate) {
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999)
      filtered = filtered.filter((f) => {
        const feedbackDate = new Date(f.createdAt)
        return feedbackDate <= end
      })
    }

    setFilteredFeedback(filtered)
  }

  async function handleMarkAsReviewed(feedbackId) {
    setUpdating({ ...updating, [feedbackId]: true })
    try {
      await markFeedbackAsReviewed(feedbackId)
      // Data will update automatically via real-time listener
    } catch (error) {
      console.error('Error marking feedback as reviewed:', error)
    } finally {
      setUpdating({ ...updating, [feedbackId]: false })
    }
  }

  const uniqueCustomers = [...new Set(feedback.map((f) => f.email))].sort()
  const uniqueCategories = [...new Set(feedback.map((f) => f.category).filter(Boolean))].sort()

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
          Review Feedback
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Filter by Rating"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
            >
              <MenuItem value="all">All Ratings</MenuItem>
              <MenuItem value="5">5 Stars</MenuItem>
              <MenuItem value="4">4 Stars</MenuItem>
              <MenuItem value="3">3 Stars</MenuItem>
              <MenuItem value="2">2 Stars</MenuItem>
              <MenuItem value="1">1 Star</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Filter by Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="submitted">Submitted</MenuItem>
              <MenuItem value="reviewed">Reviewed</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Filter by Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="all">All Categories</MenuItem>
              {uniqueCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
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

        {filteredFeedback.length === 0 ? (
          <Card>
            <CardContent>
              <Typography variant="body1" color="textSecondary" align="center" sx={{ py: 4 }}>
                {feedback.length === 0
                  ? 'No feedback submitted yet.'
                  : 'No feedback matches your filters.'}
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={2}>
            {filteredFeedback.map((item) => (
              <Grid item xs={12} key={item.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Box>
                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                          {item.email}
                        </Typography>
                        <StarRating value={item.rating} readOnly size="small" />
                        {item.category && (
                          <Chip label={item.category} size="small" sx={{ ml: 1 }} />
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <StatusBadge status={item.status} />
                        {item.status === 'submitted' && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleMarkAsReviewed(item.id)}
                            disabled={updating[item.id]}
                          >
                            {updating[item.id] ? <CircularProgress size={16} /> : 'Mark as Reviewed'}
                          </Button>
                        )}
                      </Box>
                    </Box>
                    <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                      {item.comment}
                    </Typography>
                    {item.attachments && item.attachments.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 0.5 }}>
                          Attachments ({item.attachments.length}):
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {item.attachments.map((attachment, index) => (
                            <Chip
                              key={index}
                              icon={attachment.type?.startsWith('image/') ? <ImageIcon /> : <AttachFile />}
                              label={attachment.name}
                              component="a"
                              href={attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              clickable
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                    <Typography variant="caption" color="textSecondary">
                      Submitted: {new Date(item.createdAt).toLocaleString()}
                      {item.reviewedAt && (
                        <> • Reviewed: {new Date(item.reviewedAt).toLocaleString()}</>
                      )}
                    </Typography>
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

export default ReviewFeedback

