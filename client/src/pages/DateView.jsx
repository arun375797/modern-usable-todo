import React, { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus } from 'lucide-react'
import TaskForm from '../components/TaskForm'
import TaskCard from '../components/TaskCard'
import { getTimeRemaining, formatDuration } from '../utils/timeUtils'
import { formatTime, formatCountdownTime, calculateElapsedTime, calculateRemainingTime, parseDurationToSeconds, formatDurationFromSeconds } from '../utils/timerUtils'
import { taskAPI } from '../api/tasks'
import { useAuth } from '../contexts/AuthContext'
import LoginPrompt from '../components/LoginPrompt'


export default function DateView() {
  const { date } = useParams()
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [taskTimers, setTaskTimers] = useState({})
  const [loading, setLoading] = useState(true)
  const [editingTask, setEditingTask] = useState(null)
  const { user } = useAuth()

  // Load tasks for the specific date
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true)
        const tasksData = await taskAPI.getTasksByDate(date)
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
  }, [date, user])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
      
      // Update running timers
      setTaskTimers(prev => {
        const updated = { ...prev }
        Object.keys(updated).forEach(taskId => {
          const timer = updated[taskId]
          if (timer.isRunning) {
            updated[taskId] = {
              ...timer,
              currentTime: new Date().getTime()
            }
          }
        })
        return updated
      })
    }, 1000) // Update every second for timer accuracy

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
        // First sort by status: finished tasks go to bottom
        if (a.status === 'finish' && b.status !== 'finish') return 1
        if (b.status === 'finish' && a.status !== 'finish') return -1
        
        // Then sort by start time
        if (!a.startTime && !b.startTime) return 0
        if (!a.startTime) return 1
        if (!b.startTime) return -1
        return a.startTime.localeCompare(b.startTime)
      })
  }, [tasks, date])

  const handleAddTask = async (taskData) => {
    try {
      const newTask = await taskAPI.createTask({
        ...taskData,
        status: 'start' // Default status
      })
      setTasks(prev => [...prev, newTask])
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const handleFormSubmit = async (taskData) => {
    if (editingTask) {
      // Editing existing task
      await handleSaveTask({
        ...editingTask,
        ...taskData
      })
    } else {
      // Creating new task
      await handleAddTask(taskData)
    }
    // Reset editing state
    setEditingTask(null)
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await taskAPI.deleteTask(taskId)
      setTasks(prev => prev.filter(task => task._id !== taskId))
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  const handleSaveTask = async (updatedTask) => {
    try {
      const savedTask = await taskAPI.updateTask(updatedTask._id, updatedTask)
      setTasks(prev => prev.map(task => 
        task._id === updatedTask._id ? savedTask : task
      ))
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingTask(null)
  }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const now = new Date().getTime()
      const currentTimer = taskTimers[taskId]
      
      // Handle timer logic based on status
      if (newStatus === 'start') {
        if (currentTimer && !currentTimer.isRunning) {
          // Resume from where we left off
          setTaskTimers(prev => ({
            ...prev,
            [taskId]: { ...currentTimer, isRunning: true }
          }))
        } else {
          // Start fresh
          setTaskTimers(prev => ({
            ...prev,
            [taskId]: { startTime: now, pauseTime: 0, isRunning: true }
          }))
        }
      } else if (newStatus === 'pause') {
        if (currentTimer && currentTimer.isRunning) {
          // Calculate and save the elapsed time when pausing
          const elapsed = Math.floor((Date.now() - currentTimer.startTime) / 1000)
          setTaskTimers(prev => ({
            ...prev,
            [taskId]: { ...currentTimer, isRunning: false, elapsedTime: elapsed }
          }))
        }
      } else if (newStatus === 'finish') {
        if (currentTimer && currentTimer.isRunning) {
          // Calculate and save the final elapsed time when finishing
          const elapsed = Math.floor((Date.now() - currentTimer.startTime) / 1000)
          setTaskTimers(prev => ({
            ...prev,
            [taskId]: { ...currentTimer, isRunning: false, elapsedTime: elapsed }
          }))
        }
      }
      
      // Update task status via API
      const updatedTask = await taskAPI.updateTaskStatus(taskId, newStatus)
      setTasks(prev => prev.map(task => 
        task._id === taskId ? updatedTask : task
      ))
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Show login prompt if not authenticated */}
      {!user ? (
        <LoginPrompt action="view and manage tasks for this date" />
      ) : (
        <>
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
        {loading ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white/5 rounded-2xl border border-white/10"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-400 text-lg">Loading tasks...</p>
            <p className="text-gray-500 mt-2">Please wait while we fetch your tasks</p>
          </motion.div>
        ) : dayTasks.length === 0 ? (
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
            
            // Calculate timer information
            const currentTimer = taskTimers[task._id]
            const isRunning = currentTimer && currentTimer.isRunning
            let elapsedTime = 0
            
            if (currentTimer) {
              if (isRunning) {
                // Timer is running, calculate current elapsed time from start time
                elapsedTime = Math.floor((Date.now() - currentTimer.startTime) / 1000)
              } else {
                // Timer is paused, use the saved elapsed time
                elapsedTime = currentTimer.elapsedTime || 0
              }
            } else {
              // No timer, use task's stored elapsed time
              elapsedTime = task.timerPauseTime || 0
            }
            
            const totalDuration = parseDurationToSeconds(duration)
            const remainingTime = totalDuration > 0 ? calculateRemainingTime(totalDuration, elapsedTime) : null
            
            return (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <TaskCard
                  task={task}
                  onStatusChange={handleStatusChange}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  isRunning={isRunning}
                  elapsedTime={elapsedTime}
                  remainingTime={remainingTime}
                />
              </motion.div>
            )
          })
        )}
      </div>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        selectedDate={date}
        editingTask={editingTask}
      />
        </>
      )}
    </div>
  )
}


