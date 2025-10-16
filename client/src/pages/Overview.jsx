import { useState, useEffect, useMemo } from 'react'
import Calendar from '../components/Calendar'
import { motion } from 'framer-motion'
import { Clock, TrendingUp } from 'lucide-react'
import { getTimeRemaining } from '../utils/timeUtils'

export default function Overview(){
  const [tasks, setTasks] = useState([])
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks')
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }

    // Listen for storage changes
    const handleStorageChange = () => {
      const storedTasks = localStorage.getItem('tasks')
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks))
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('tasksUpdated', handleStorageChange)

    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('tasksUpdated', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    const todayTasks = tasks.filter(t => t.date === today)
    const upcomingTasks = tasks.filter(t => new Date(t.date) > new Date())
    
    // Get next upcoming task
    const nextTask = todayTasks
      .filter(t => t.startTime)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
      .find(t => {
        const taskTime = new Date(`${t.date}T${t.startTime}`)
        return taskTime > currentTime
      })

    return {
      total: tasks.length,
      today: todayTasks.length,
      upcoming: upcomingTasks.length,
      nextTask
    }
  }, [tasks, currentTime])

  const nextTaskTime = stats.nextTask ? getTimeRemaining(stats.nextTask.date, stats.nextTask.startTime, stats.nextTask.endTime) : null

  return (
    <div className="w-full space-y-6">
      {/* Stats Cards at Top */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <p className="text-purple-300 text-sm font-medium">Total Tasks</p>
          </div>
          <p className="text-4xl font-bold bg-gradient-to-br from-purple-300 to-purple-100 bg-clip-text text-transparent">
            {stats.total}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <p className="text-cyan-300 text-sm font-medium">Today</p>
          </div>
          <p className="text-4xl font-bold bg-gradient-to-br from-cyan-300 to-cyan-100 bg-clip-text text-transparent">
            {stats.today}
          </p>
          {nextTaskTime && (
            <div className="mt-4 pt-4 border-t border-cyan-500/20">
              <p className="text-xs text-cyan-400/60 mb-1">Next Task</p>
              <p className="text-sm font-medium text-cyan-300 truncate">{stats.nextTask.title}</p>
              <p className={`text-xs mt-1 ${nextTaskTime.color}`}>{nextTaskTime.text}</p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-violet-500/20 to-violet-600/20 backdrop-blur-xl border border-violet-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <p className="text-violet-300 text-sm font-medium">Upcoming</p>
          </div>
          <p className="text-4xl font-bold bg-gradient-to-br from-violet-300 to-violet-100 bg-clip-text text-transparent">
            {stats.upcoming}
          </p>
        </motion.div>
      </div>

      {/* Full-width Calendar */}
      <Calendar tasks={tasks} />
    </div>
  )
}
