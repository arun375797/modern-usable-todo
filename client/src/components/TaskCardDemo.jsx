import React from 'react'
import TaskCard from './TaskCard'

// Demo component to showcase the enhanced TaskCard with duration display
export default function TaskCardDemo() {
  const demoTasks = [
    {
      _id: '1',
      title: 'watching netflix',
      startTime: '07:22',
      endTime: '07:22', // Same time for demo
      priority: 'low',
      status: 'pause',
      category: 'entertainment',
      color: '#8b5cf6',
      tags: ['relaxation', 'entertainment']
    },
    {
      _id: '2',
      title: 'Project Planning Meeting',
      startTime: '09:00',
      endTime: '11:30',
      priority: 'high',
      status: 'start',
      category: 'work',
      color: '#3b82f6',
      tags: ['meeting', 'planning']
    },
    {
      _id: '3',
      title: 'Gym Workout',
      startTime: '18:00',
      endTime: '19:30',
      priority: 'medium',
      status: 'finish',
      category: 'health',
      color: '#10b981',
      tags: ['fitness', 'health']
    },
    {
      _id: '4',
      title: 'Study Session',
      startTime: '14:00',
      endTime: '16:45',
      priority: 'high',
      status: 'start',
      category: 'learning',
      color: '#f59e0b',
      tags: ['study', 'learning']
    }
  ]

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Enhanced TaskCard with Duration Display
        </h1>
        
        <div className="space-y-6">
          {demoTasks.map((task, idx) => (
            <div key={task._id}>
              <h3 className="text-lg font-semibold text-gray-300 mb-3">
                Example {idx + 1}: {task.title}
              </h3>
              <TaskCard 
                task={task}
                onStatusChange={(taskId, status) => {
                  console.log('Status change:', taskId, status)
                }}
                onEdit={(task) => {
                  console.log('Edit task:', task)
                  alert(`Edit task: ${task.title}`)
                }}
                isRunning={task.status === 'start'}
                elapsedTime={task.status === 'pause' ? 1800 : 0} // 30 minutes for demo
                remainingTime={task.status === 'start' ? 3600 : null} // 1 hour remaining for demo
              />
            </div>
          ))}
        </div>
        
        <div className="mt-12 p-6 bg-gray-800/50 rounded-2xl border border-gray-700/50">
          <h2 className="text-xl font-bold text-white mb-4">Duration Display Features:</h2>
          <ul className="space-y-2 text-gray-300">
            <li>• <span className="text-cyan-400 font-medium">Prominent Duration Badge</span> - Shows total planned time in the header</li>
            <li>• <span className="text-purple-400 font-medium">Smart Formatting</span> - Displays hours and minutes (e.g., "2h 30m", "45m")</li>
            <li>• <span className="text-green-400 font-medium">Cross-Day Support</span> - Handles tasks that span midnight</li>
            <li>• <span className="text-yellow-400 font-medium">Visual Integration</span> - Matches the card's color scheme and design</li>
            <li>• <span className="text-blue-400 font-medium">Conditional Display</span> - Only shows when both start and end times are available</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
