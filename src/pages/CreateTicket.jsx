import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  MenuItem,
  CircularProgress,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  IconButton,
  Grid,
} from '@mui/material'
import { AttachFile, Close, CloudUpload } from '@mui/icons-material'
import { formatFileSize, MAX_FILE_SIZE, validateFile } from '../services/fileService'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import { createTicket } from '../services/ticketService'
import { uploadMultipleFiles } from '../services/fileService'

function CreateTicket() {
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('medium')
  const [files, setFiles] = useState([])
  const [uploadingFiles, setUploadingFiles] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [ticketId, setTicketId] = useState('')
  const [loading, setLoading] = useState(false)
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  function handleFileSelect(e) {
    const selectedFiles = Array.from(e.target.files)
    const validFiles = []
    const errors = []

    selectedFiles.forEach((file) => {
      try {
        validateFile(file)
        validFiles.push(file)
      } catch (error) {
        errors.push(error.message)
      }
    })

    if (errors.length > 0) {
      setError(errors.join('\n'))
    }

    if (validFiles.length > 0) {
      setFiles([...files, ...validFiles])
    }

    // Reset input
    e.target.value = ''
  }

  function handleRemoveFile(index) {
    setFiles(files.filter((_, i) => i !== index))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (subject.trim().length < 5) {
      setError('Subject must be at least 5 characters')
      return
    }

    if (description.trim().length < 10) {
      setError('Description must be at least 10 characters')
      return
    }

    setLoading(true)
    setUploadingFiles(true)

    try {
      // Upload files if any
      let attachments = []
      if (files.length > 0) {
        attachments = await uploadMultipleFiles(files, 'tickets')
      }

      const result = await createTicket(
        currentUser.uid,
        currentUser.email,
        subject,
        description,
        priority,
        attachments
      )
      setTicketId(result.ticketId)
      setSuccess(true)
      setTimeout(() => {
        navigate(`/customer/ticket/${result.id}`)
      }, 2000)
    } catch (err) {
      setError(err.message || 'Failed to create ticket. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
      setUploadingFiles(false)
    }
  }

  return (
    <Layout>
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Create Support Ticket
        </Typography>

        <Paper elevation={2} sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Ticket created successfully! Ticket ID: {ticketId}. Redirecting...
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              margin="normal"
              placeholder="Brief summary of your issue..."
              helperText={`${subject.length} characters (minimum 5)`}
            />

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={8}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              margin="normal"
              placeholder="Please provide detailed information about your issue..."
              helperText={`${description.length} characters (minimum 10)`}
            />

            <Box sx={{ mt: 2, mb: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">Priority (Optional)</FormLabel>
                    <RadioGroup
                      row
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <FormControlLabel value="low" control={<Radio />} label="Low" />
                      <FormControlLabel value="medium" control={<Radio />} label="Medium" />
                      <FormControlLabel value="high" control={<Radio />} label="High" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <FormLabel component="legend" sx={{ mb: 1 }}>Status</FormLabel>
                    <TextField
                      select
                      value="open"
                      disabled
                      size="small"
                      helperText="Status will be set to 'Open' when ticket is created"
                    >
                      <MenuItem value="open">Open</MenuItem>
                    </TextField>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ mt: 3, mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ mb: 1, fontWeight: 600 }}>
                Attachments (Optional)
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  border: '2px dashed',
                  borderColor: 'divider',
                  bgcolor: 'grey.50',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <input
                  accept="image/*,application/pdf,.txt"
                  style={{ display: 'none' }}
                  id="file-upload-ticket"
                  multiple
                  type="file"
                  onChange={handleFileSelect}
                  disabled={uploadingFiles}
                />
                <label htmlFor="file-upload-ticket">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUpload />}
                    disabled={uploadingFiles}
                    sx={{ mb: 1 }}
                  >
                    Choose Files
                  </Button>
                </label>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                  Maximum file size: <strong>5MB</strong> per file
                </Typography>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                  Supported formats: Images (JPG, PNG, GIF, WEBP), PDF, Text files
                </Typography>
              </Paper>

              {files.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom sx={{ fontWeight: 600 }}>
                    Selected Files ({files.length})
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {files.map((file, index) => (
                      <Paper
                        key={index}
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          bgcolor: 'background.paper',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                          <AttachFile color="action" />
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                              {file.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {formatFileSize(file.size)}
                            </Typography>
                          </Box>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveFile(index)}
                          sx={{ ml: 1 }}
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      </Paper>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/customer/dashboard')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || subject.trim().length < 5 || description.trim().length < 10}
              >
                {loading ? <CircularProgress size={24} /> : 'Create Ticket'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Layout>
  )
}

export default CreateTicket

