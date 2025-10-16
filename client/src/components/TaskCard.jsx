export default function TaskCard({ task }){
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-start gap-3">
      <input 
        type="checkbox" 
        className="mt-1 accent-blue-600" 
        defaultChecked={task.status === 'done'} 
      />
      <div className="flex-1">
        <h3 className="font-medium">{task.title}</h3>
        {task.when?.due ? (
          <p className="text-sm text-gray-500 mt-1">Due {formatDue(task.when.due)}</p>
        ) : null}
        {task.tags?.length ? (
          <div className="flex flex-wrap gap-1 mt-2">
            {task.tags.map((tag) => (
              <span key={tag} className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
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
