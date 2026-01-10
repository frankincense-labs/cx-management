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
  Chip,
  IconButton,
  Grid,
} from '@mui/material'
import { AttachFile, Close, CloudUpload } from '@mui/icons-material'
import { formatFileSize, MAX_FILE_SIZE, validateFile } from '../services/fileService'
import Layout from '../components/Layout'
import StarRating from '../components/StarRating'
import { useAuth } from '../context/AuthContext'
import { submitFeedback } from '../services/feedbackService'
import { uploadMultipleFiles } from '../services/fileService'

const categories = ['General', 'Service Quality', 'Technical Issue', 'Feature Request', 'Other']

function SubmitFeedback() {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [category, setCategory] = useState('')
  const [files, setFiles] = useState([])
  const [uploadingFiles, setUploadingFiles] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
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

    if (rating === 0) {
      setError('Please select a rating')
      return
    }

    if (comment.trim().length < 10) {
      setError('Please provide a comment with at least 10 characters')
      return
    }

    setLoading(true)
    setUploadingFiles(true)

    try {
      // Upload files if any
      let attachments = []
      if (files.length > 0) {
        attachments = await uploadMultipleFiles(files, 'feedback')
      }

      await submitFeedback(
        currentUser.uid,
        currentUser.email,
        rating,
        comment,
        category,
        attachments
      )
      setSuccess(true)
      setTimeout(() => {
        navigate('/customer/my-feedback')
      }, 2000)
    } catch (err) {
      setError(err.message || 'Failed to submit feedback. Please try again.')
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
          Submit Feedback
        </Typography>

        <Paper elevation={2} sx={{ p: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Feedback submitted successfully! Redirecting...
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                How would you rate your experience?
              </Typography>
              <StarRating value={rating} onChange={setRating} />
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Category (Optional)"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  margin="normal"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  value="submitted"
                  disabled
                  margin="normal"
                  helperText="Status will be set to 'Submitted' when feedback is created"
                >
                  <MenuItem value="submitted">Submitted</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Your Feedback"
              multiline
              rows={6}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              margin="normal"
              placeholder="Please share your experience in detail..."
              helperText={`${comment.length} characters (minimum 10)`}
            />

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
                  id="file-upload-feedback"
                  multiple
                  type="file"
                  onChange={handleFileSelect}
                  disabled={uploadingFiles}
                />
                <label htmlFor="file-upload-feedback">
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
                disabled={loading || rating === 0 || comment.trim().length < 10}
              >
                {loading ? <CircularProgress size={24} /> : 'Submit Feedback'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Layout>
  )
}

export default SubmitFeedback

