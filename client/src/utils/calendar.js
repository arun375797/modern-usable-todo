const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function getMonthMatrix(year, month){
  const firstDay = new Date(year, month, 1)
  const start = new Date(firstDay)
  const startOffset = (firstDay.getDay() + 6) % 7 // Monday as first day
  start.setDate(start.getDate() - startOffset)

  const matrix = []
  for(let week = 0; week < 6; week++){
    const row = []
    for(let day = 0; day < 7; day++){
      row.push({
        date: new Date(start),
        inMonth: start.getMonth() === month
      })
      start.setDate(start.getDate() + 1)
    }
    matrix.push(row)
  }
  return matrix
}

export function getMonthLabel(date){
  return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}

export function getWeekdays(){
  return WEEKDAYS
}

export function toKey(date){
  return date.toISOString().slice(0, 10)
}
