export function getTimeRemaining(date, startTime, endTime) {
  if (!date || !startTime) return null;

  const now = new Date();
  const taskDateTime = new Date(`${date}T${startTime}`);
  const diff = taskDateTime - now;

  if (diff < 0) {
    // Task has started or passed
    if (endTime) {
      const endDateTime = new Date(`${date}T${endTime}`);
      const endDiff = endDateTime - now;
      
      if (endDiff > 0) {
        return { status: 'in-progress', text: 'In Progress', color: 'text-yellow-400' };
      } else {
        return { status: 'completed', text: 'Completed', color: 'text-gray-500' };
      }
    }
    return { status: 'started', text: 'Started', color: 'text-green-400' };
  }

  // Task is upcoming
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return { 
      status: 'upcoming', 
      text: `${days}d ${hours}h remaining`,
      color: 'text-cyan-400'
    };
  } else if (hours > 0) {
    return { 
      status: 'upcoming', 
      text: `${hours}h ${minutes}m remaining`,
      color: 'text-cyan-400'
    };
  } else if (minutes > 0) {
    return { 
      status: 'upcoming', 
      text: `${minutes}m remaining`,
      color: 'text-orange-400'
    };
  } else {
    return { 
      status: 'upcoming', 
      text: 'Starting soon',
      color: 'text-red-400'
    };
  }
}

export function formatDuration(startTime, endTime) {
  if (!startTime || !endTime) return null;

  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  const diff = end - start;

  if (diff <= 0) return null;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${minutes}m`;
  }
}

