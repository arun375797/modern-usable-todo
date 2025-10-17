import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, ExternalLink, Plus, Timer, Briefcase, Home, Heart, BookOpen, ShoppingCart, Car, Gamepad2, Palette, CheckCircle, Circle, PlayCircle, Pause, Play } from 'lucide-react'
import TaskForm from '../components/TaskForm'
import { getTimeRemaining, formatDuration } from '../utils/timeUtils'
import { formatTime, formatCountdownTime, calculateElapsedTime, calculateRemainingTime, parseDurationToSeconds, formatDurationFromSeconds } from '../utils/timerUtils'
import { taskAPI } from '../api/tasks'
import { useAuth } from '../contexts/AuthContext'
import LoginPrompt from '../components/LoginPrompt'

// Helper functions for task display
const getPriorityColor = (priority) => {
  const colors = {
    high: 'text-red-400 bg-red-500/10 border-red-500/30',
    medium: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
    low: 'text-green-400 bg-green-500/10 border-green-500/30'
  }
  return colors[priority] || colors.medium
}

const getStatusColor = (status) => {
  const colors = {
    'start': 'text-green-400 bg-green-500/10 border-green-500/30',
    'pause': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    'finish': 'text-purple-400 bg-purple-500/10 border-purple-500/30'
  }
  return colors[status] || colors['start']
}

const getStatusIcon = (status) => {
  const icons = {
    'start': Circle,
    'pause': PlayCircle,
    'finish': CheckCircle
  }
  return icons[status] || Circle
}

const getCategoryIcon = (category) => {
  const icons = {
    work: Briefcase,
    personal: Home,
    health: Heart,
    learning: BookOpen,
    shopping: ShoppingCart,
    travel: Car,
    entertainment: Gamepad2,
    other: Palette
  }
  return icons[category] || Palette
}

export default function Today(){
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [taskTimers, setTaskTimers] = useState({})
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const today = new Date().toISOString().split('T')[0]

  // Load today's tasks
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true)
        const tasksData = await taskAPI.getTasksByDate(today)
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
  }, [today, user])

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

  const todayTasks = useMemo(() => {
    return tasks
      .filter(task => task.date === today)
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
  }, [tasks, today])

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

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const now = new Date().getTime()
      
      // Handle timer logic based on status
      if (newStatus === 'start') {
        setTaskTimers(prev => ({
          ...prev,
          [taskId]: { startTime: now, pauseTime: 0, isRunning: true }
        }))
      } else if (newStatus === 'pause') {
        const currentTimer = taskTimers[taskId]
        if (currentTimer && currentTimer.isRunning) {
          const elapsed = calculateElapsedTime(currentTimer.startTime, currentTimer.pauseTime)
          setTaskTimers(prev => ({
            ...prev,
            [taskId]: { ...currentTimer, isRunning: false }
          }))
        }
      } else if (newStatus === 'finish') {
        const currentTimer = taskTimers[taskId]
        if (currentTimer && currentTimer.isRunning) {
          setTaskTimers(prev => ({
            ...prev,
            [taskId]: { ...currentTimer, isRunning: false }
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
        <LoginPrompt action="view and manage today's tasks" />
      ) : (
        <>
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
        ) : todayTasks.length === 0 ? (
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
            
            // Calculate timer information
            const currentTimer = taskTimers[task._id]
            const isRunning = currentTimer && currentTimer.isRunning
            const elapsedTime = isRunning ? calculateElapsedTime(currentTimer.startTime, currentTimer.pauseTime) : (task.timerPauseTime || 0)
            const totalDuration = parseDurationToSeconds(duration)
            const remainingTime = totalDuration > 0 ? calculateRemainingTime(totalDuration, elapsedTime) : null
            
            return (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => navigate(`/date/${task.date}`)}
                className={`bg-white/5 hover:bg-white/10 border rounded-xl p-6 transition-all cursor-pointer ${
                  task.status === 'finish' 
                    ? 'border-green-500/50 bg-green-500/5' 
                    : 'border-white/10'
                }`}
                style={{ borderLeftColor: task.status === 'finish' ? '#10b981' : task.color, borderLeftWidth: '4px' }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Title and Badges */}
                    <div className="mb-3">
                      <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
                      
                      {/* Priority, Status, and Category Badges */}
                      <div className="flex items-center flex-wrap gap-2 mb-3">
                        {/* Priority Badge */}
                        <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority || 'medium')}`}>
                          <div className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-400' : task.priority === 'medium' ? 'bg-orange-400' : 'bg-green-400'}`}></div>
                          <span className="capitalize">{task.priority || 'Medium'}</span>
                        </div>

                        {/* Status Buttons */}
                        <div className="flex gap-1">
                          {[
                            { value: 'start', label: 'Start', color: 'green' },
                            { value: 'pause', label: 'Pause', color: 'yellow' },
                            { value: 'finish', label: 'Finish', color: 'purple' }
                          ].map((status) => (
                            <motion.button
                              key={status.value}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStatusChange(task._id, status.value)
                              }}
                              className={`
                                px-2 py-1 text-xs rounded-full border transition-all flex items-center gap-1
                                ${task.status === status.value 
                                  ? `bg-${status.color}-500/20 border-${status.color}-500/50 text-${status.color}-400` 
                                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                                }
                              `}
                            >
                              <div className={`w-2 h-2 rounded-full ${task.status === status.value ? `bg-${status.color}-400` : 'bg-gray-500'}`}></div>
                              <span>{status.label}</span>
                            </motion.button>
                          ))}
                        </div>

                        {/* Category Badge */}
                        <div className="flex items-center gap-1 text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-full border border-white/10">
                          {React.createElement(getCategoryIcon(task.category || 'other'), { className: "w-3 h-3" })}
                          <span className="capitalize">{task.category || 'Other'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Time Information */}
                    <div className="flex items-center flex-wrap gap-3 mb-3">
                      {(task.startTime || task.endTime) && (
                        <div className="flex items-center gap-1 text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full">
                          <Clock className="w-4 h-4" />
                          {task.startTime && <span>{task.startTime}</span>}
                          {task.startTime && task.endTime && <span>-</span>}
                          {task.endTime && <span>{task.endTime}</span>}
                        </div>
                      )}
                      {duration && (
                        <div className="flex items-center gap-1 text-sm text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
                          <Clock className="w-4 h-4" />
                          <span>Total: {duration}</span>
                        </div>
                      )}
                      {timeRemaining && (
                        <div className={`flex items-center gap-1 text-sm ${timeRemaining.color} bg-white/5 px-3 py-1 rounded-full`}>
                          <Timer className="w-4 h-4" />
                          <span>{timeRemaining.text}</span>
                        </div>
                      )}
                    </div>
                            {/* Timer Display */}
                            {isRunning && (
                              <div className="mt-4 flex justify-center">
                                <div className="relative">
                                  {/* Outer glow ring */}
                                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg animate-pulse"></div>
                                  
                                  {/* Timer container */}
                                  <div className="relative bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-400/50 rounded-2xl p-6 backdrop-blur-sm">
                                    <div className="text-center">
                                      <div className="flex items-center justify-center gap-2 mb-2">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                                        <span className="text-blue-300 text-sm font-medium">TIMER RUNNING</span>
                                      </div>
                                      
                                      {/* Main countdown display */}
                                      <div className="text-4xl font-mono font-bold text-blue-400 mb-1 tracking-wider">
                                        {remainingTime !== null ? formatCountdownTime(remainingTime) : formatTime(elapsedTime)}
                                      </div>
                                      
                                      {/* Countdown label */}
                                      {remainingTime !== null && (
                                        <div className="text-xs text-blue-300/80 font-medium">
                                          COUNTDOWN
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Paused Timer Display */}
                            {task.status === 'pause' && task.timerPauseTime > 0 && (
                              <div className="mt-4 flex justify-center">
                                <div className="relative">
                                  {/* Outer glow ring */}
                                  <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-lg"></div>
                                  
                                  {/* Timer container */}
                                  <div className="relative bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-400/50 rounded-2xl p-6 backdrop-blur-sm">
                                    <div className="text-center">
                                      <div className="flex items-center justify-center gap-2 mb-2">
                                        <Pause className="w-3 h-3 text-yellow-400" />
                                        <span className="text-yellow-300 text-sm font-medium">TIMER PAUSED</span>
                                      </div>
                                      
                                      {/* Main countdown display */}
                                      <div className="text-4xl font-mono font-bold text-yellow-400 mb-1 tracking-wider">
                                        {remainingTime !== null ? formatCountdownTime(remainingTime) : formatTime(task.timerPauseTime)}
                                      </div>
                                      
                                      {/* Countdown label */}
                                      {remainingTime !== null && (
                                        <div className="text-xs text-yellow-300/80 font-medium">
                                          COUNTDOWN
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Finished Timer Display */}
                            {task.status === 'finish' && task.timerPauseTime > 0 && (
                              <div className="mt-4 flex justify-center">
                                <div className="relative">
                                  {/* Outer glow ring */}
                                  <div className="absolute inset-0 bg-green-500/20 rounded-full blur-lg"></div>
                                  
                                  {/* Timer container */}
                                  <div className="relative bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-400/50 rounded-2xl p-6 backdrop-blur-sm">
                                    <div className="text-center">
                                      <div className="flex items-center justify-center gap-2 mb-2">
                                        <CheckCircle className="w-3 h-3 text-green-400" />
                                        <span className="text-green-300 text-sm font-medium">TASK COMPLETED</span>
                                      </div>
                                      
                                      {/* Main time display */}
                                      <div className="text-4xl font-mono font-bold text-green-400 mb-1 tracking-wider">
                                        {formatTime(task.timerPauseTime)}
                                      </div>
                                      
                                      {/* Total time label */}
                                      <div className="text-xs text-green-300/80 font-medium">
                                        TOTAL TIME
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
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
        </>
      )}
    </div>
  )
}
