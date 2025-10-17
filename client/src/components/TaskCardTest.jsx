import React from 'react'
import TaskCard from './TaskCard'

// Simple test component to verify TaskCard edit buttons
export default function TaskCardTest() {
  const testTask = {
    _id: 'test-1',
    title: 'Test Task with Edit Buttons',
    startTime: '09:00',
    endTime: '11:00',
    priority: 'high',
    status: 'start',
    category: 'work',
    color: '#8b5cf6',
    tags: ['test', 'debug']
  }

  const handleEdit = (task) => {
    console.log('Edit button clicked!', task)
    alert(`Edit task: ${task.title}`)
  }

  const handleStatusChange = (taskId, status) => {
    console.log('Status change:', taskId, status)
  }

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          TaskCard Edit Button Test
        </h1>
        
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <h2 className="text-yellow-400 font-semibold mb-2">Look for these edit buttons:</h2>
          <ul className="text-yellow-300 text-sm space-y-1">
            <li>1. Purple "Edit" badge in the badges section (below title)</li>
            <li>2. Three-dot menu (⋮) in the top-right corner</li>
          </ul>
        </div>

        <TaskCard 
          task={testTask}
          onEdit={handleEdit}
          onStatusChange={handleStatusChange}
          isRunning={false}
          elapsedTime={0}
          remainingTime={null}
        />

        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <h3 className="text-blue-400 font-semibold mb-2">Debug Info:</h3>
          <pre className="text-blue-300 text-sm overflow-auto">
            {JSON.stringify(testTask, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}

