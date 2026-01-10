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
import { Add as AddIcon, AttachFile, Image as ImageIcon } from '@mui/icons-material'
import Layout from '../components/Layout'
import StarRating from '../components/StarRating'
import StatusBadge from '../components/StatusBadge'
import { useAuth } from '../context/AuthContext'
import { subscribeToUserFeedback } from '../services/feedbackService'

function MyFeedback() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [feedback, setFeedback] = useState([])
  const [filteredFeedback, setFilteredFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [ratingFilter, setRatingFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    setLoading(true)
    const unsubscribe = subscribeToUserFeedback(currentUser.uid, (data) => {
      setFeedback(data)
      setFilteredFeedback(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [currentUser.uid])

  useEffect(() => {
    filterFeedback()
  }, [ratingFilter, statusFilter, feedback])

  function filterFeedback() {
    let filtered = [...feedback]

    if (ratingFilter !== 'all') {
      filtered = filtered.filter((f) => f.rating === parseInt(ratingFilter))
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((f) => f.status === statusFilter)
    }

    setFilteredFeedback(filtered)
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
          <Typography variant="h4">My Feedback</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/customer/submit-feedback')}
          >
            Submit New Feedback
          </Button>
        </Box>

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
        </Grid>

        {filteredFeedback.length === 0 ? (
          <Card>
            <CardContent>
              <Typography variant="body1" color="textSecondary" align="center" sx={{ py: 4 }}>
                {feedback.length === 0
                  ? "You haven't submitted any feedback yet."
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
                        <StarRating value={item.rating} readOnly size="small" />
                        {item.category && (
                          <Chip label={item.category} size="small" sx={{ ml: 1 }} />
                        )}
                      </Box>
                      <StatusBadge status={item.status} />
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

export default MyFeedback

