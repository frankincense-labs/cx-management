import { Box, IconButton } from '@mui/material'
import { Star, StarBorder } from '@mui/icons-material'

function StarRating({ value, onChange, readOnly = false, size = 'medium' }) {
  const iconSize = size === 'small' ? 'small' : 'medium'
  const stars = [1, 2, 3, 4, 5]

  if (readOnly) {
    return (
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {stars.map((star) => (
          <Star
            key={star}
            sx={{
              color: star <= value ? '#ffc107' : '#e0e0e0',
              fontSize: iconSize === 'small' ? '1.2rem' : '1.5rem',
            }}
          />
        ))}
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      {stars.map((star) => (
        <IconButton
          key={star}
          onClick={() => onChange(star)}
          size="small"
          sx={{ p: 0.5 }}
        >
          {star <= value ? (
            <Star sx={{ color: '#ffc107', fontSize: iconSize === 'small' ? '1.2rem' : '1.5rem' }} />
          ) : (
            <StarBorder sx={{ color: '#e0e0e0', fontSize: iconSize === 'small' ? '1.2rem' : '1.5rem' }} />
          )}
        </IconButton>
      ))}
    </Box>
  )
}

export default StarRating

