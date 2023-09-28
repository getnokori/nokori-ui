export function timeSince(timeStamp: string): string {
  if (!timeStamp) return ''
  const dateFromDb = new Date(timeStamp) // Convert to UTC
  const now = new Date() // Local time
  const secondsPast = (now.getTime() - dateFromDb.getTime()) / 1000

  if (secondsPast < 60) {
    const roundSeconds = Math.round(secondsPast)
    return `${roundSeconds} second${roundSeconds > 1 ? 's' : ''} ago`
  }

  if (secondsPast < 3600) {
    const roundMinutes = Math.round(secondsPast / 60)
    return `${roundMinutes} minute${roundMinutes > 1 ? 's' : ''} ago`
  }

  if (secondsPast <= 86400) {
    const roundHours = Math.round(secondsPast / 3600)
    return `${roundHours} hour${roundHours > 1 ? 's' : ''} ago`
  }

  if (secondsPast <= 604800) {
    const roundDays = Math.round(secondsPast / 86400)
    return `${roundDays} day${roundDays > 1 ? 's' : ''} ago`
  }

  if (secondsPast <= 2592000) {
    const roundWeeks = Math.round(secondsPast / 604800)
    return `${roundWeeks} week${roundWeeks > 1 ? 's' : ''} ago`
  }

  if (secondsPast <= 31536000) {
    const roundMonths = Math.round(secondsPast / 2592000)
    return `${roundMonths} month${roundMonths > 1 ? 's' : ''} ago`
  }

  const roundYears = Math.round(secondsPast / 31536000)
  return `${roundYears} year${roundYears > 1 ? 's' : ''} ago`
}

export default {
  timeSince
}
