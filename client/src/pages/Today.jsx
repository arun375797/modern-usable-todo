import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, ExternalLink, Plus, Timer } from 'lucide-react'
import TaskForm from '../components/TaskForm'
import { getTimeRemaining, formatDuration } from '../utils/timeUtils'

export default function Today(){
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks')
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }

    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const todayTasks = useMemo(() => {
    return tasks
      .filter(task => task.date === today)
      .sort((a, b) => {
        if (!a.startTime) return 1
        if (!b.startTime) return -1
        return a.startTime.localeCompare(b.startTime)
      })
  }, [tasks, today])

  const handleAddTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    const updatedTasks = [...tasks, newTask]
    setTasks(updatedTasks)
    localStorage.setItem('tasks', JSON.stringify(updatedTasks))
    window.dispatchEvent(new Event('tasksUpdated'))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Today
          </h1>
          <p className="text-gray-400 mt-1">{todayTasks.length} tasks scheduled</p>
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

      {/* Tasks */}
      <div className="space-y-4">
        {todayTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white/5 rounded-2xl border border-white/10"
          >
            <p className="text-gray-400 text-lg">No tasks for today</p>
            <p className="text-gray-500 mt-2">Click "Add Task" to create one</p>
          </motion.div>
        ) : (
          todayTasks.map((task, idx) => {
            const timeRemaining = getTimeRemaining(task.date, task.startTime, task.endTime)
            const duration = formatDuration(task.startTime, task.endTime)

            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => navigate(`/date/${task.date}`)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-6 transition-all cursor-pointer"
                style={{ borderLeftColor: task.color, borderLeftWidth: '4px' }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
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
                    {task.description && (
                      <p className="text-gray-400">{task.description}</p>
                    )}
                    {task.url && (
                      <a
                        href={task.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors mt-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open Link
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      <TaskForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddTask}
        selectedDate={today}
      />
    </div>
  )
}
