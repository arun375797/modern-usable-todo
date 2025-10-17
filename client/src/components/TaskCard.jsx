import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Clock, 
  ExternalLink, 
  Timer, 
  Play, 
  Pause, 
  CheckCircle, 
  Circle, 
  Briefcase, 
  Home, 
  Heart, 
  BookOpen, 
  ShoppingCart, 
  Car, 
  Gamepad2, 
  Palette,
  Edit3,
  X,
  Minimize2,
  Maximize2
} from 'lucide-react'

export default function TaskCard({ task, onStatusChange, onTimerToggle, onEdit, onDelete, isRunning = false, elapsedTime = 0, remainingTime = null }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)

  // Helper functions for styling
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

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  const formatCountdownTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    } else {
      return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
  }

  const calculateTaskDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return null
    
    // Parse time strings (assuming format like "07:22" or "19:30")
    const parseTime = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number)
      return hours * 60 + minutes
    }
    
    const startMinutes = parseTime(startTime)
    const endMinutes = parseTime(endTime)
    
    // Handle case where end time is next day
    let durationMinutes = endMinutes - startMinutes
    if (durationMinutes < 0) {
      durationMinutes += 24 * 60 // Add 24 hours
    }
    
    return durationMinutes
  }

  const formatDuration = (minutes) => {
    if (minutes === null || minutes === undefined) return null
    
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`.trim()
    } else if (mins > 0) {
      return `${mins}m`
    } else {
      return '0m'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`
        relative bg-gray-800/20 backdrop-blur-md border border-gray-700/30 rounded-2xl p-6 
        transition-all duration-300 cursor-pointer group
        ${task.status === 'finish' 
          ? 'border-green-500/40 bg-green-500/3' 
          : 'hover:bg-gray-700/30 hover:border-gray-600/40'
        }
        ${isHovered ? 'shadow-2xl shadow-purple-500/15' : 'shadow-lg shadow-black/10'}
      `}
      style={{ 
        borderLeftColor: task.status === 'finish' ? '#10b981' : task.color || '#8b5cf6', 
        borderLeftWidth: '4px' 
      }}
    >
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-2xl pointer-events-none" />
      
      <div className="relative z-10">
        {/* Enhanced Header with title and status */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-3xl font-black text-white group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500 leading-tight mb-3">
                  {task.title}
                </h3>
                
                {/* Enhanced Total Duration Display */}
                {(() => {
                  const duration = calculateTaskDuration(task.startTime, task.endTime)
                  const taskDuration = task.duration || task.estimatedDuration
                  const displayDuration = duration !== null ? duration : taskDuration
                  
                  // Debug logging
                  console.log('Task duration calculation:', {
                    startTime: task.startTime,
                    endTime: task.endTime,
                    calculatedDuration: duration,
                    taskDuration: taskDuration,
                    displayDuration: displayDuration
                  })
                  
                  return (
                    <div className="flex items-center gap-3 text-xl font-bold text-cyan-200 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-6 py-3 rounded-2xl border-2 border-cyan-400/40 shadow-xl shadow-cyan-500/10 backdrop-blur-sm">
                      <Timer className="w-6 h-6" />
                      <span className="text-3xl font-black text-cyan-100">
                        {displayDuration !== null && displayDuration !== undefined ? formatDuration(displayDuration) : 'No time set'}
                      </span>
                      <span className="text-base font-bold text-cyan-300">TOTAL TIME</span>
                    </div>
                  )
                })()}

                {/* Priority Badge for Minimized View */}
                <div className="mt-4">
                  <div className={`inline-flex items-center gap-2 text-sm px-4 py-2 rounded-2xl border font-bold shadow-lg backdrop-blur-sm ${getPriorityColor(task.priority || 'medium')}`}>
                    <div className={`w-3 h-3 rounded-full ${task.priority === 'high' ? 'bg-red-400' : task.priority === 'medium' ? 'bg-orange-400' : 'bg-green-400'}`}></div>
                    <span className="capitalize text-base">{task.priority || 'Medium'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Integrated in Header */}
          <div className="flex items-start gap-2 ml-4">
            {/* Minimize/Maximize Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(!isExpanded)
              }}
              className="w-10 h-10 bg-gray-800/40 hover:bg-blue-500/60 border border-gray-600/30 hover:border-blue-400/40 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 backdrop-blur-sm"
              title={isExpanded ? "Minimize Card" : "Maximize Card"}
            >
              {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </motion.button>

            {/* Edit Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                onEdit?.(task)
              }}
              className="w-10 h-10 bg-gray-800/40 hover:bg-purple-500/60 border border-gray-600/30 hover:border-purple-400/40 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 backdrop-blur-sm"
              title="Edit Task"
            >
              <Edit3 className="w-5 h-5" />
            </motion.button>

            {/* Close/Delete Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.(task)
              }}
              className="w-10 h-10 bg-gray-800/40 hover:bg-red-500/60 border border-gray-600/30 hover:border-red-400/40 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 backdrop-blur-sm"
              title="Delete Task"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Collapsible Content */}
        <motion.div
          initial={false}
          animate={{ 
            height: isExpanded ? "auto" : 0,
            opacity: isExpanded ? 1 : 0
          }}
          transition={{ 
            duration: 0.3, 
            ease: "easeInOut" 
          }}
          className="overflow-hidden"
        >
          {/* Restructured Button Sections */}
        <div className="space-y-4 mb-6">
          {/* Category Row */}
          <div className="flex items-center justify-center gap-4">
            {/* Category Badge */}
            <div className="flex items-center gap-2 text-sm text-gray-300 bg-gradient-to-r from-gray-700/30 to-gray-800/30 px-4 py-2 rounded-2xl border border-gray-600/30 shadow-lg backdrop-blur-sm">
              {React.createElement(getCategoryIcon(task.category || 'other'), { className: "w-4 h-4" })}
              <span className="capitalize text-base font-bold">{task.category || 'Other'}</span>
            </div>
          </div>

          {/* Status Control Buttons */}
          <div className="flex justify-center gap-3">
            {[
              { value: 'start', label: 'Start', icon: Play, color: 'green' },
              { value: 'pause', label: 'Pause', icon: Pause, color: 'yellow' },
              { value: 'finish', label: 'Finish', icon: CheckCircle, color: 'purple' }
            ].map((status) => {
              const Icon = status.icon
              return (
                <motion.button
                  key={status.value}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onStatusChange?.(task._id, status.value)
                  }}
                  className={`
                    px-6 py-3 text-base rounded-2xl border transition-all flex items-center gap-2 font-bold shadow-lg backdrop-blur-sm min-w-[100px] justify-center
                    ${task.status === status.value 
                      ? `bg-gradient-to-r from-${status.color}-500/25 to-${status.color}-600/20 border-${status.color}-400/50 text-${status.color}-200 shadow-${status.color}-500/20` 
                      : 'bg-gradient-to-r from-gray-700/30 to-gray-800/30 border-gray-600/30 text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-gray-600/40 hover:to-gray-700/40 hover:border-gray-500/40'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-base font-bold">{status.label}</span>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Structured Time Information */}
        <div className="bg-gradient-to-r from-gray-700/20 to-gray-800/20 rounded-2xl p-4 border border-gray-600/20 backdrop-blur-sm mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-gray-300 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Schedule
            </h4>
            {remainingTime !== null && (
              <div className="flex items-center gap-2 text-sm text-cyan-300 bg-gradient-to-r from-cyan-500/15 to-blue-500/15 px-3 py-1 rounded-xl border border-cyan-400/30">
                <Timer className="w-4 h-4" />
                <span className="font-bold">{formatCountdownTime(remainingTime)}</span>
                <span className="text-cyan-400/80 font-medium">remaining</span>
              </div>
            )}
          </div>
          
          {(task.startTime || task.endTime) && (
            <div className="flex items-center justify-center gap-4 text-lg">
              {task.startTime && (
                <div className="text-center">
                  <div className="text-xs text-gray-400 font-medium mb-1">START</div>
                  <div className="text-white font-bold text-xl">{task.startTime}</div>
                </div>
              )}
              {task.startTime && task.endTime && (
                <div className="text-gray-400 text-2xl font-bold">→</div>
              )}
              {task.endTime && (
                <div className="text-center">
                  <div className="text-xs text-gray-400 font-medium mb-1">END</div>
                  <div className="text-white font-bold text-xl">{task.endTime}</div>
                </div>
              )}
            </div>
          )}
        </div>


        {/* Structured Timer Display */}
        {isRunning && (
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-400/30 backdrop-blur-sm mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-blue-300 text-lg font-bold tracking-wider">TIMER RUNNING</span>
              </div>
              
              {/* Main timer display */}
              <div className="text-5xl font-mono font-black text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text mb-2 tracking-wider">
                {remainingTime !== null ? formatCountdownTime(remainingTime) : formatTime(elapsedTime)}
              </div>
              
              {/* Timer label */}
              {remainingTime !== null && (
                <div className="text-sm text-blue-300/80 font-bold tracking-widest">
                  COUNTDOWN
                </div>
              )}
            </div>
          </div>
        )}

        {/* Structured Paused Timer Display */}
        {task.status === 'pause' && elapsedTime > 0 && (
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl p-6 border border-yellow-400/30 backdrop-blur-sm mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Pause className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-300 text-lg font-bold tracking-wider">TIMER PAUSED</span>
              </div>
              
              {/* Main time display */}
              <div className="text-5xl font-mono font-black text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-amber-400 bg-clip-text mb-2 tracking-wider">
                {formatTime(elapsedTime)}
              </div>
              
              {/* Paused label */}
              <div className="text-sm text-yellow-300/80 font-bold tracking-widest">
                ELAPSED TIME
              </div>
            </div>
          </div>
        )}

        {/* Structured Finished Timer Display */}
        {task.status === 'finish' && elapsedTime > 0 && (
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-400/30 backdrop-blur-sm mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-green-300 text-lg font-bold tracking-wider">TASK COMPLETED</span>
              </div>
              
              {/* Main time display */}
              <div className="text-5xl font-mono font-black text-transparent bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text mb-2 tracking-wider">
                {formatTime(elapsedTime)}
              </div>
              
              {/* Total time label */}
              <div className="text-sm text-green-300/80 font-bold tracking-widest">
                TOTAL TIME
              </div>
            </div>
          </div>
        )}

        {/* Enhanced External Link */}
        {task.url && (
          <a
            href={task.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-base text-cyan-300 hover:text-cyan-200 transition-all duration-300 mt-6 group/link bg-gradient-to-r from-cyan-500/8 to-blue-500/8 hover:from-cyan-500/15 hover:to-blue-500/15 px-4 py-2 rounded-2xl border border-cyan-400/20 hover:border-cyan-400/30 shadow-lg hover:shadow-cyan-500/10 backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-5 h-5 group-hover/link:scale-110 transition-transform" />
            <span className="font-bold">Open Link</span>
          </a>
        )}

        {/* Enhanced Tags */}
        {task.tags?.length ? (
          <div className="flex flex-wrap gap-2 mt-6">
            {task.tags.map((tag) => (
              <span key={tag} className="text-sm text-gray-300 bg-gradient-to-r from-gray-700/30 to-gray-800/30 px-3 py-1.5 rounded-2xl border border-gray-600/30 font-medium shadow-lg backdrop-blur-sm">
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
        </motion.div>
      </div>
    </motion.div>
  )
}

function formatDue(input){
  return new Date(input).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
