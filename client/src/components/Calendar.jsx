import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function Calendar({ tasks = [], view = 'month' }) {
  const navigate = useNavigate()
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const { year, month } = useMemo(() => ({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth()
  }), [currentDate])

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

  const days = useMemo(() => {
    const daysArray = []
    
    // Previous month days
    const prevMonthDays = new Date(year, month, 0).getDate()
    for (let i = startDay - 1; i >= 0; i--) {
      daysArray.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false
      })
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      })
    }
    
    // Next month days
    const remainingDays = 42 - daysArray.length
    for (let i = 1; i <= remainingDays; i++) {
      daysArray.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      })
    }
    
    return daysArray
  }, [year, month, daysInMonth, startDay])

  const getTasksForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return tasks.filter(task => task.date === dateStr)
  }

  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1))
  }

  const handleDateClick = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    navigate(`/date/${dateStr}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.h2 
          className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {MONTHS[month]} {year}
        </motion.h2>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevMonth}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextMonth}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-4">
        {/* Day headers */}
        {DAYS.map(day => (
          <div key={day} className="text-center py-3 text-sm font-medium text-gray-400">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {days.map((day, idx) => {
          const dayTasks = getTasksForDate(day.date)
          const today = isToday(day.date)
          
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.01 }}
              onClick={() => handleDateClick(day.date)}
              className={`
                relative min-h-[140px] p-4 rounded-lg cursor-pointer transition-all
                ${day.isCurrentMonth ? 'bg-white/5 hover:bg-white/10' : 'bg-white/[0.02] text-gray-600'}
                ${today ? 'ring-2 ring-cyan-400' : 'border border-white/10'}
              `}
            >
              <div className={`text-base font-medium ${today ? 'text-cyan-400' : ''}`}>
                {day.date.getDate()}
              </div>
              
              {/* Tasks preview */}
              <div className="mt-3 space-y-2">
                {dayTasks.slice(0, 4).map((task, i) => (
                  <div
                    key={i}
                    className="text-xs px-2 py-1.5 rounded truncate"
                    style={{ 
                      backgroundColor: task.color ? `${task.color}20` : '#8b5cf620',
                      borderLeft: `3px solid ${task.color || '#8b5cf6'}`
                    }}
                  >
                    {task.title}
                  </div>
                ))}
                {dayTasks.length > 4 && (
                  <div className="text-xs text-gray-400 px-2">
                    +{dayTasks.length - 4} more
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

