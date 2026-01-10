import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  TextField,
  Button,
  MenuItem,
  Link,
} from '@mui/material'
import { AttachFile, Image as ImageIcon, CheckCircle, Send } from '@mui/icons-material'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../components/NotificationProvider'
import { getTicketById, updateTicketStatus, addTicketReply, subscribeToTicketReplies } from '../services/ticketService'
import { subscribeToAllTickets } from '../services/ticketService'

function TicketDetail() {
  const { ticketId } = useParams()
  const { currentUser, userRole } = useAuth()
  const { showNotification } = useNotification()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState(null)
  const [replies, setReplies] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [replyMessage, setReplyMessage] = useState('')
  const [updating, setUpdating] = useState(false)
  const [replying, setReplying] = useState(false)
  const [error, setError] = useState('')
  const [statusChanged, setStatusChanged] = useState(false)

  const isAdmin = userRole === 'admin'

  useEffect(() => {
    let unsubscribeReplies = null
    let unsubscribeTickets = null

    loadTicketData()

    function setupTicketListeners(ticketData) {
      // Check if user has access to this ticket
      if (!isAdmin && ticketData.userId !== currentUser.uid) {
        setError('You do not have access to this ticket')
        setLoading(false)
        return
      }

      setTicket(ticketData)
      setStatus(ticketData.status)
      setLoading(false)

      // Set up real-time listener for replies
      unsubscribeReplies = subscribeToTicketReplies(ticketData.id, (repliesData) => {
        setReplies(repliesData)
      })

      // Set up real-time listener for ticket updates
      unsubscribeTickets = subscribeToAllTickets((tickets) => {
        const updated = tickets.find(t => t.id === ticketData.id)
        if (updated) {
          setTicket(updated)
          setStatus(updated.status)
        }
      })
    }

    async function loadTicketData() {
      try {
        setLoading(true)
        // Try to get ticket by document ID first
        let ticketData = await getTicketById(ticketId)
        
        // If not found, it might be a ticketId string, try searching by ticketId field
        if (!ticketData) {
          // Use real-time listener to find ticket
          const unsubscribe = subscribeToAllTickets((tickets) => {
            const found = tickets.find(t => t.ticketId === ticketId || t.id === ticketId)
            if (found) {
              setupTicketListeners(found)
              unsubscribe()
            }
          })
          return
        }

        setupTicketListeners(ticketData)
      } catch (error) {
        console.error('Error loading ticket:', error)
        setError('Failed to load ticket')
        setLoading(false)
      }
    }

    return () => {
      if (unsubscribeReplies) unsubscribeReplies()
      if (unsubscribeTickets) unsubscribeTickets()
    }
  }, [ticketId, isAdmin, currentUser.uid])


  async function handleStatusUpdate() {
    if (status === ticket.status) return

    setUpdating(true)
    setError('')
    try {
      await updateTicketStatus(ticket.id, status)
      setStatusChanged(true)
      showNotification(`Ticket status updated to ${status.replace('-', ' ').toUpperCase()} successfully!`, 'success')
      // Reset status changed indicator after animation
      setTimeout(() => setStatusChanged(false), 2000)
    } catch (error) {
      console.error('Error updating status:', error)
      setError('Failed to update status. Please try again.')
      showNotification('Failed to update ticket status', 'error')
    } finally {
      setUpdating(false)
    }
  }

  async function handleReply() {
    if (!replyMessage.trim()) return

    setReplying(true)
    setError('')
    try {
      await addTicketReply(ticket.id, currentUser.uid, currentUser.email, replyMessage)
      setReplyMessage('')
      showNotification('Reply sent successfully!', 'success')
      // Replies will update automatically via real-time listener
    } catch (error) {
      console.error('Error adding reply:', error)
      setError('Failed to send reply. Please try again.')
      showNotification('Failed to send reply', 'error')
    } finally {
      setReplying(false)
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

  if (error && !ticket) {
    return (
      <Layout>
        <Container maxWidth="md">
          <Alert severity="error">{error}</Alert>
          <Button onClick={() => navigate(isAdmin ? '/admin/manage-tickets' : '/customer/my-tickets')} sx={{ mt: 2 }}>
            Go Back
          </Button>
        </Container>
      </Layout>
    )
  }

  if (!ticket) return null

  return (
    <Layout>
      <Container maxWidth="md">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
            Ticket Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View and manage ticket information, status, and communication history
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            mb: 3,
            borderRadius: 3,
            transition: 'all 0.2s',
            '&:hover': {
              boxShadow: 4,
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                Ticket ID
              </Typography>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                {ticket.ticketId || ticket.id}
              </Typography>
              <Typography variant="h6" color="textPrimary" sx={{ mt: 1, fontWeight: 600 }}>
                {ticket.subject}
              </Typography>
            </Box>
            <StatusBadge status={ticket.status} />
          </Box>

          {isAdmin && (
            <Box 
              sx={{ 
                mb: 2, 
                p: 2, 
                bgcolor: statusChanged ? 'success.light' : 'grey.50',
                borderRadius: 2,
                transition: 'background-color 0.3s ease',
                display: 'flex', 
                gap: 2, 
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
            >
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flex: 1, minWidth: 300 }}>
                <TextField
                  select
                  label="Update Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  size="small"
                  sx={{ minWidth: 180 }}
                  disabled={updating}
                >
                  <MenuItem value="open">Open</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                </TextField>
                <Button
                  variant="contained"
                  onClick={handleStatusUpdate}
                  disabled={updating || status === ticket.status}
                  startIcon={statusChanged ? <CheckCircle /> : null}
                  sx={{
                    minWidth: 140,
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: 4,
                    }
                  }}
                >
                  {updating ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : statusChanged ? (
                    'Updated!'
                  ) : (
                    'Update Status'
                  )}
                </Button>
              </Box>
              {statusChanged && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'success.main' }}>
                  <CheckCircle fontSize="small" />
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    Status updated successfully
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Description
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
            {ticket.description}
          </Typography>

          {ticket.attachments && ticket.attachments.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Attachments ({ticket.attachments.length})
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {ticket.attachments.map((attachment, index) => (
                  <Chip
                    key={index}
                    icon={attachment.type?.startsWith('image/') ? <ImageIcon /> : <AttachFile />}
                    label={attachment.name}
                    component="a"
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    clickable
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            {ticket.priority && (
              <Chip
                label={`Priority: ${ticket.priority.toUpperCase()}`}
                size="small"
                color={ticket.priority === 'high' ? 'error' : ticket.priority === 'medium' ? 'warning' : 'default'}
              />
            )}
            {isAdmin && (
              <Chip label={`Customer: ${ticket.email}`} size="small" variant="outlined" />
            )}
          </Box>

          <Typography variant="caption" color="textSecondary">
            Created: {new Date(ticket.createdAt).toLocaleString()}
            {ticket.updatedAt && (
              <> • Last Updated: {new Date(ticket.updatedAt).toLocaleString()}</>
            )}
            {ticket.resolvedAt && (
              <> • Resolved: {new Date(ticket.resolvedAt).toLocaleString()}</>
            )}
          </Typography>
        </Paper>

        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Communication Thread
          </Typography>

          <Box 
            sx={{ 
              mb: 3, 
              p: 2.5, 
              bgcolor: 'grey.50', 
              borderRadius: 2,
              borderLeft: '4px solid',
              borderColor: 'primary.main',
              transition: 'all 0.2s',
              '&:hover': {
                boxShadow: 2,
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 600 }}>
                Original Ticket
              </Typography>
              <Chip label="Customer" size="small" color="default" variant="outlined" />
            </Box>
            <Typography variant="body1" sx={{ mb: 1.5, whiteSpace: 'pre-wrap' }}>
              {ticket.description}
            </Typography>
            <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {ticket.email} • {new Date(ticket.createdAt).toLocaleString()}
            </Typography>
          </Box>

          {replies.length === 0 && isAdmin && (
            <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
              <Typography variant="body2">No replies yet. Be the first to respond!</Typography>
            </Box>
          )}

          {replies.map((reply, index) => (
            <Box 
              key={reply.id} 
              sx={{ 
                mb: 2, 
                p: 2.5, 
                bgcolor: 'primary.50',
                borderRadius: 2,
                borderLeft: '4px solid',
                borderColor: 'primary.main',
                transition: 'all 0.2s',
                animation: index === replies.length - 1 ? 'fadeIn 0.3s ease-in' : 'none',
                '@keyframes fadeIn': {
                  '0%': { opacity: 0, transform: 'translateY(-10px)' },
                  '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                '&:hover': {
                  boxShadow: 2,
                  transform: 'translateX(4px)',
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 600 }}>
                  Admin Reply
                </Typography>
                <Chip label="Admin" size="small" color="primary" />
              </Box>
              <Typography variant="body1" sx={{ mb: 1.5, whiteSpace: 'pre-wrap' }}>
                {reply.message}
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {reply.adminEmail} • {new Date(reply.createdAt).toLocaleString()}
              </Typography>
            </Box>
          ))}

          {isAdmin && (
            <>
              <Divider sx={{ my: 3 }} />
              <Box sx={{ 
                p: 2, 
                bgcolor: 'primary.50', 
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'primary.200'
              }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                  Add Reply
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply here... The customer will see this message."
                  sx={{ mb: 2 }}
                  disabled={replying}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setReplyMessage('')}
                    disabled={replying || !replyMessage.trim()}
                  >
                    Clear
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleReply}
                    disabled={replying || !replyMessage.trim()}
                    startIcon={replying ? null : <Send />}
                    sx={{
                      minWidth: 140,
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: 4,
                      }
                    }}
                  >
                    {replying ? (
                      <>
                        <CircularProgress size={16} sx={{ mr: 1 }} color="inherit" />
                        Sending...
                      </>
                    ) : (
                      'Send Reply'
                    )}
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </Layout>
  )
}

export default TicketDetail

