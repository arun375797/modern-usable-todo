import { useState } from 'react'
import { useNotes } from '../store/useNotes'

const categories = ['Reflection', 'Ideation', 'Backlog', 'Scratchpad']

export default function Notes(){
  const notes = useNotes((state) => state.notes)
  const addNote = useNotes((state) => state.addNote)
  const removeNote = useNotes((state) => state.removeNote)

  const [draft, setDraft] = useState({ title: '', category: categories[0], content: '' })

  function handleAdd(e){
    e.preventDefault()
    if(!draft.title.trim()){
      return
    }
    const lines = draft.content
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
    addNote({
      title: draft.title.trim(),
      category: draft.category,
      content: lines.length ? lines : [draft.content.trim()].filter(Boolean)
    })
    setDraft({ title: '', category: categories[0], content: '' })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Notes</h1>
        <p className="text-gray-600 mt-1">Capture your ideas</p>
      </div>

      <div>
        <form onSubmit={handleAdd} className="space-y-3">
          <div className="flex gap-2">
            <input
              value={draft.title}
              onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Note title"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <select
              value={draft.category}
              onChange={(e) => setDraft((prev) => ({ ...prev, category: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {categories.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <textarea
            value={draft.content}
            onChange={(e) => setDraft((prev) => ({ ...prev, content: e.target.value }))}
            placeholder="Write your thoughts..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Save
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">{notes.length} Notes</h2>
        {notes.length === 0 ? (
          <div className="text-gray-400 py-8 text-center">
            No notes yet
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {notes.map((note) => (
              <div key={note.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xs text-gray-500">{note.category}</span>
                    <h3 className="font-semibold mt-1">{note.title}</h3>
                  </div>
                  <button
                    onClick={() => removeNote(note.id)}
                    className="text-sm text-red-600 hover:text-red-700"
                    type="button"
                  >
                    Delete
                  </button>
                </div>
                <ul className="space-y-1 text-sm text-gray-600">
                  {note.content?.map((line) => (
                    <li key={line}>• {line}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
