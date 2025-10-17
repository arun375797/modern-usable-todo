import { useState, useEffect, useMemo } from 'react'
import Calendar from '../components/Calendar'
import { motion } from 'framer-motion'
import { Clock, TrendingUp } from 'lucide-react'
import { getTimeRemaining } from '../utils/timeUtils'
import { taskAPI } from '../api/tasks'
import { useAuth } from '../contexts/AuthContext'
import LoginPrompt from '../components/LoginPrompt'

export default function Overview(){
  const [tasks, setTasks] = useState([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeFilter, setActiveFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  // Load all tasks
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true)
        const tasksData = await taskAPI.getAllTasks()
        setTasks(tasksData)
      } catch (error) {
        console.error('Error loading tasks:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      loadTasks()
    }

    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [user])

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

  // Filter tasks based on active filter
  const filteredTasks = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    
    switch (activeFilter) {
      case 'today':
        return tasks.filter(t => t.date === today)
      case 'week':
        return tasks.filter(t => t.date >= today && t.date <= weekFromNow)
      case 'overdue':
        return tasks.filter(t => t.date < today && (t.status !== 'finish'))
      case 'completed':
        return tasks.filter(t => t.status === 'finish')
      default:
        return tasks
    }
  }, [tasks, activeFilter])

  const filterButtons = [
    { key: 'all', label: 'All Tasks', count: tasks.length },
    { key: 'today', label: 'Today', count: tasks.filter(t => t.date === new Date().toISOString().split('T')[0]).length },
    { key: 'week', label: 'This Week', count: tasks.filter(t => {
      const today = new Date().toISOString().split('T')[0]
      const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      return t.date >= today && t.date <= weekFromNow
    }).length },
    { key: 'overdue', label: 'Overdue', count: tasks.filter(t => t.date < new Date().toISOString().split('T')[0] && t.status !== 'finish').length },
    { key: 'completed', label: 'Completed', count: tasks.filter(t => t.status === 'finish').length },
  ]

  return (
    <div className="w-full space-y-6">
      {/* Show login prompt if not authenticated */}
      {!user ? (
        <LoginPrompt action="view and manage your tasks" />
      ) : (
        <>
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

      {/* Quick Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {filterButtons.map((filter) => (
          <motion.button
            key={filter.key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveFilter(filter.key)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2
              ${activeFilter === filter.key 
                ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg shadow-purple-500/50' 
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
              }
            `}
          >
            {filter.label}
            <span className={`
              px-2 py-0.5 rounded-full text-xs
              ${activeFilter === filter.key ? 'bg-white/20' : 'bg-white/10'}
            `}>
              {filter.count}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Full-width Calendar */}
      <Calendar tasks={filteredTasks} />
        </>
      )}
    </div>
  )
}
