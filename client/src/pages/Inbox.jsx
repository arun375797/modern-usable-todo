import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import TaskCard from '../components/TaskCard'
import { useUI } from '../store/useUI'
import { useTasks } from '../hooks/useTasks'
import { parseQuick } from '../utils/parseQuick'
import { api } from '../api/client'

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Inbox</h1>
        <p className="text-gray-600 mt-1">Capture your thoughts</p>
      </div>

      <div>
        <form onSubmit={handleAdd} className="space-y-3">
          <div className="flex gap-2">
            <input
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder="What's on your mind?"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Add
            </button>
          </div>
          {localMessage ? <div className="text-sm text-red-600">{localMessage}</div> : null}
          {error ? (
            <div className="text-sm text-red-600">
              Please sign in to sync tasks
            </div>
          ) : null}
        </form>
        <div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-500">
          <span>Try:</span>
          {templates.map((example) => (
            <button
              key={example}
              onClick={() => setQuickInput(example)}
              type="button"
              className="text-blue-600 hover:underline"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Tasks</h2>
          <span className="text-sm text-gray-500">
            {isFetching ? 'Loading...' : `${tasks?.length ?? 0} items`}
          </span>
        </div>
        {error ? (
          <div className="text-gray-500 py-4">
            Please sign in to see your tasks
          </div>
        ) : null}
        {!error && (!tasks || tasks.length === 0) ? (
          <div className="text-gray-400 py-4 text-center">
            Your inbox is empty
          </div>
        ) : null}
        <div className="space-y-2">
          {tasks?.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      </div>
    </div>
  )
}

