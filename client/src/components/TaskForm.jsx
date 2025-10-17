import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Briefcase, Home, Heart, BookOpen, ShoppingCart, Car, Gamepad2, Palette } from 'lucide-react'

const COLOR_OPTIONS = [
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Green', value: '#10b981' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Yellow', value: '#eab308' },
]

const PRIORITY_OPTIONS = [
  { name: 'High', value: 'high', color: '#ef4444', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30' },
  { name: 'Medium', value: 'medium', color: '#f97316', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/30' },
  { name: 'Low', value: 'low', color: '#10b981', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30' },
]

const STATUS_OPTIONS = [
  { name: 'Start', value: 'start', color: '#10b981', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30' },
  { name: 'Pause', value: 'pause', color: '#f59e0b', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/30' },
  { name: 'Finish', value: 'finish', color: '#8b5cf6', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/30' },
]

const CATEGORY_OPTIONS = [
  { name: 'Work', value: 'work', icon: Briefcase, color: '#3b82f6' },
  { name: 'Personal', value: 'personal', icon: Home, color: '#8b5cf6' },
  { name: 'Health', value: 'health', icon: Heart, color: '#10b981' },
  { name: 'Learning', value: 'learning', icon: BookOpen, color: '#f59e0b' },
  { name: 'Shopping', value: 'shopping', icon: ShoppingCart, color: '#ec4899' },
  { name: 'Travel', value: 'travel', icon: Car, color: '#06b6d4' },
  { name: 'Entertainment', value: 'entertainment', icon: Gamepad2, color: '#8b5cf6' },
  { name: 'Other', value: 'other', icon: Palette, color: '#6b7280' },
]

export default function TaskForm({ isOpen, onClose, onSubmit, selectedDate }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    startTime: '',
    endTime: '',
    resources: '',
    color: COLOR_OPTIONS[0].value,
    priority: PRIORITY_OPTIONS[1].value, // Default to Medium
    category: CATEGORY_OPTIONS[0].value, // Default to Work
    date: selectedDate || new Date().toISOString().split('T')[0]
  })
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({
      title: '',
      description: '',
      url: '',
      startTime: '',
      endTime: '',
      resources: '',
      color: COLOR_OPTIONS[0].value,
      priority: PRIORITY_OPTIONS[1].value,
      category: CATEGORY_OPTIONS[0].value,
      date: selectedDate || new Date().toISOString().split('T')[0]
    })
    onClose()
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleClose = () => {
    // Check if form has any data
    const hasData = formData.title || formData.description || formData.url || 
                   formData.startTime || formData.endTime || formData.resources
    if (hasData) {
      setShowConfirmModal(true)
    } else {
      onClose()
    }
  }

  const handleConfirmClose = () => {
    setShowConfirmModal(false)
    onClose()
  }

  const handleCancelClose = () => {
    setShowConfirmModal(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-br from-gray-900 to-gray-800 border-b border-white/10 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Create New Task
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Task Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Task Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    placeholder="Enter task name..."
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                    placeholder="Add task description..."
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => handleChange('startTime', e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => handleChange('endTime', e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    />
                  </div>
                </div>

                {/* URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Task URL
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => handleChange('url', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    placeholder="https://..."
                  />
                </div>

                {/* Resources */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Resources
                  </label>
                  <textarea
                    value={formData.resources}
                    onChange={(e) => handleChange('resources', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                    placeholder="Add links, files, or notes..."
                  />
                </div>

                {/* Priority, Status, and Category */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => handleChange('priority', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-white"
                    >
                      {PRIORITY_OPTIONS.map((priority) => (
                        <option key={priority.value} value={priority.value}>
                          {priority.name}
                        </option>
                      ))}
                    </select>
                  </div>


                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-white"
                    >
                      {CATEGORY_OPTIONS.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Task Color
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {COLOR_OPTIONS.map((color) => (
                      <motion.button
                        key={color.value}
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleChange('color', color.value)}
                        className={`
                          w-10 h-10 rounded-lg transition-all
                          ${formData.color === color.value ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''}
                        `}
                        style={{ backgroundColor: color.value }}
                      />
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg font-semibold text-white shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Task
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Confirmation Modal */}
          <AnimatePresence>
            {showConfirmModal && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-white/10 p-6 max-w-md w-full">
                    <h3 className="text-xl font-bold text-white mb-4">Discard Changes?</h3>
                    <p className="text-gray-400 mb-6">
                      You have unsaved changes. Are you sure you want to close without saving?
                    </p>
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleConfirmClose}
                        className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                      >
                        Discard
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCancelClose}
                        className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
                      >
                        Keep Editing
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  )
}

