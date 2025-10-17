// Timer utility functions for task time tracking

export const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  } else if (minutes > 0) {
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  } else {
    return `${secs.toString().padStart(2, '0')}s`
  }
}

export const formatCountdownTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export const calculateElapsedTime = (startTime, pauseTime = 0) => {
  if (!startTime) return 0
  const now = new Date().getTime()
  const elapsed = Math.floor((now - startTime) / 1000)
  return Math.max(0, elapsed - pauseTime)
}

export const calculateRemainingTime = (totalDuration, elapsedTime) => {
  if (!totalDuration) return null
  const remaining = totalDuration - elapsedTime
  return Math.max(0, remaining)
}

export const parseDurationToSeconds = (duration) => {
  if (!duration) return 0
  
  // Handle formats like "9h 57m", "57m", "30s"
  const hourMatch = duration.match(/(\d+)h/)
  const minuteMatch = duration.match(/(\d+)m/)
  const secondMatch = duration.match(/(\d+)s/)
  
  const hours = hourMatch ? parseInt(hourMatch[1]) : 0
  const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0
  const seconds = secondMatch ? parseInt(secondMatch[1]) : 0
  
  return hours * 3600 + minutes * 60 + seconds
}

export const formatDurationFromSeconds = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else if (minutes > 0) {
    return `${minutes}m`
  } else {
    return `${seconds}s`
  }
}
