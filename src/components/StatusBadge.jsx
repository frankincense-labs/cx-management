import { Chip } from '@mui/material'

function StatusBadge({ status }) {
  const getColor = () => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'primary'
      case 'in progress':
      case 'in-progress':
        return 'warning'
      case 'resolved':
        return 'success'
      case 'reviewed':
        return 'success'
      case 'submitted':
        return 'default'
      default:
        return 'default'
    }
  }

  const formatStatus = (status) => {
    if (!status) return 'Unknown'
    return status
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <Chip
      label={formatStatus(status)}
      color={getColor()}
      size="small"
    />
  )
}

export default StatusBadge

