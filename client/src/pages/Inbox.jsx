import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import TaskCard from '../components/TaskCard'
import TaskForm from '../components/TaskForm'
import { useUI } from '../store/useUI'
import { useTasks } from '../hooks/useTasks'
import { parseQuick } from '../utils/parseQuick'
import { api } from '../api/client'
import { useAuth } from '../contexts/AuthContext'
import LoginPrompt from '../components/LoginPrompt'

const templates = [
  'Plan next week #planning @home',
  'Research summer travel #ideas @laptop',
  'Share launch update with team #work @slack'
]

export default function Inbox(){
  const { quickInput, setQuickInput } = useUI()
  const qc = useQueryClient()
  const { data: tasks, isFetching, error } = useTasks({ view: 'inbox' })
  const [localMessage, setLocalMessage] = useState('')
  const [editingTask, setEditingTask] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { user } = useAuth()

  async function handleAdd(e){
    e.preventDefault()
    setLocalMessage('')
    const parsed = parseQuick(quickInput)
    if(!parsed.title){
      setLocalMessage('Add a title or thought before saving.')
      return
    }
    try{
      await api.post('/tasks', {
        title: parsed.title,
        tags: parsed.tags,
        when: { due: parsed.due }
      })
      setQuickInput('')
      qc.invalidateQueries({ queryKey: ['tasks'] })
    }catch(err){
      const message = err.response?.data?.error || 'Unable to save. Sign in and try again.'
      setLocalMessage(message)
    }
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  const handleSaveTask = async (updatedTask) => {
    try {
      // Update task via API
      await api.put(`/tasks/${updatedTask._id}`, updatedTask)
      qc.invalidateQueries({ queryKey: ['tasks'] })
      setEditingTask(null)
      setIsFormOpen(false)
    } catch (error) {
      console.error('Error updating task:', error)
      setLocalMessage('Failed to update task. Please try again.')
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
      await handleAdd({ preventDefault: () => {} })
    }
    // Reset editing state
    setEditingTask(null)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingTask(null)
  }

  const handleDeleteTask = async (task) => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      try {
        await api.delete(`/tasks/${task._id}`)
        qc.invalidateQueries({ queryKey: ['tasks'] })
      } catch (error) {
        console.error('Error deleting task:', error)
        setLocalMessage('Failed to delete task. Please try again.')
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* Show login prompt if not authenticated */}
      {!user ? (
        <LoginPrompt action="capture your thoughts and manage tasks" />
      ) : (
        <>
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Inbox
            </h1>
            <p className="text-gray-400 mt-1">Capture your thoughts and ideas</p>
          </div>

          {/* Quick Input Form */}
          <div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="flex gap-3">
                <input
                  value={quickInput}
                  onChange={(e) => setQuickInput(e.target.value)}
                  placeholder="What's on your mind?"
                  className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all backdrop-blur-sm"
                />
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Add
                </motion.button>
              </div>
              {localMessage ? (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 px-3 py-2 rounded-lg"
                >
                  {localMessage}
                </motion.div>
              ) : null}
              {error ? (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 px-3 py-2 rounded-lg"
                >
                  Please sign in to sync tasks
                </motion.div>
              ) : null}
            </form>
            
            {/* Templates */}
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-400">
              <span>Try:</span>
              {templates.map((example) => (
                <motion.button
                  key={example}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setQuickInput(example)}
                  type="button"
                  className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 px-2 py-1 rounded-lg transition-all"
                >
                  {example}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Tasks Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Tasks</h2>
              <span className="text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700/50">
                {isFetching ? 'Loading...' : `${tasks?.length ?? 0} items`}
              </span>
            </div>
            
            {error ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 bg-white/5 rounded-2xl border border-white/10"
              >
                <p className="text-gray-400 text-lg">Please sign in to see your tasks</p>
              </motion.div>
            ) : null}
            
            {!error && (!tasks || tasks.length === 0) ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 bg-white/5 rounded-2xl border border-white/10"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-700/50 rounded-full flex items-center justify-center">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-400 text-lg">Your inbox is empty</p>
                <p className="text-gray-500 mt-2">Add a task above to get started</p>
              </motion.div>
            ) : null}
            
            <div className="space-y-4">
              {tasks?.map((task, idx) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <TaskCard 
                    task={task} 
                    onStatusChange={(taskId, status) => {
                      // Handle status change if needed
                      console.log('Status change:', taskId, status)
                    }}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        selectedDate={new Date().toISOString().split('T')[0]}
        editingTask={editingTask}
      />
    </div>
  )
}

