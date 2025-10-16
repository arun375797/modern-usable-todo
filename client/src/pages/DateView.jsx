import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Clock, ExternalLink, Timer } from 'lucide-react'
import TaskForm from '../components/TaskForm'
import { getTimeRemaining, formatDuration } from '../utils/timeUtils'

// Using localStorage for now
const getTasks = () => {
  const tasks = localStorage.getItem('tasks')
  return tasks ? JSON.parse(tasks) : []
}

const saveTasks = (tasks) => {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

export default function DateView() {
  const { date } = useParams()
  const navigate = useNavigate()
  const [tasks, setTasks] = useState(getTasks())
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const formattedDate = useMemo(() => {
    const d = new Date(date + 'T00:00:00')
    return d.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }, [date])

  const dayTasks = useMemo(() => {
    return tasks
      .filter(task => task.date === date)
      .sort((a, b) => {
        if (!a.startTime) return 1
        if (!b.startTime) return -1
        return a.startTime.localeCompare(b.startTime)
      })
  }, [tasks, date])

  const handleAddTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    const updatedTasks = [...tasks, newTask]
    setTasks(updatedTasks)
    saveTasks(updatedTasks)
  }

  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId)
    setTasks(updatedTasks)
    saveTasks(updatedTasks)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {formattedDate}
            </h1>
            <p className="text-gray-400 mt-1">{dayTasks.length} tasks scheduled</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFormOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/50"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </motion.button>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {dayTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white/5 rounded-2xl border border-white/10"
          >
            <p className="text-gray-400 text-lg">No tasks scheduled for this day</p>
            <p className="text-gray-500 mt-2">Click "Add Task" to create one</p>
          </motion.div>
        ) : (
          dayTasks.map((task, idx) => {
            const timeRemaining = getTimeRemaining(task.date, task.startTime, task.endTime)
            const duration = formatDuration(task.startTime, task.endTime)
            
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-6 transition-all"
                style={{ borderLeftColor: task.color, borderLeftWidth: '4px' }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Title and Time */}
                    <div className="flex items-center flex-wrap gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{task.title}</h3>
                      {(task.startTime || task.endTime) && (
                        <div className="flex items-center gap-1 text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full">
                          <Clock className="w-4 h-4" />
                          {task.startTime && <span>{task.startTime}</span>}
                          {task.startTime && task.endTime && <span>-</span>}
                          {task.endTime && <span>{task.endTime}</span>}
                          {duration && <span className="ml-1 text-gray-500">({duration})</span>}
                        </div>
                      )}
                      {timeRemaining && (
                        <div className={`flex items-center gap-1 text-sm ${timeRemaining.color} bg-white/5 px-3 py-1 rounded-full`}>
                          <Timer className="w-4 h-4" />
                          <span>{timeRemaining.text}</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {task.description && (
                      <p className="text-gray-400 mb-3">{task.description}</p>
                    )}

                    {/* URL */}
                    {task.url && (
                      <a
                        href={task.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors mb-3"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open Link
                      </a>
                    )}

                    {/* Resources */}
                    {task.resources && (
                      <div className="mt-3 p-3 bg-white/5 rounded-lg border border-white/5">
                        <p className="text-sm text-gray-400 mb-1">Resources:</p>
                        <p className="text-sm text-gray-300">{task.resources}</p>
                      </div>
                    )}
                  </div>

                  {/* Delete Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddTask}
        selectedDate={date}
      />
    </div>
  )
}

function X({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

