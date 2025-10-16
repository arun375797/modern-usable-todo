import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { usePlanner } from '../store/usePlanner'

const tabs = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'year', label: 'Year' }
]

export default function Planner(){
  const [active, setActive] = useState('day')
  const reset = usePlanner((state) => state.reset)

  function handleReset(){
    if(window.confirm('Reset planner data?')){
      reset()
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Planner"
        subtitle="Capture the essentials for each horizon. Everything stays simple and editable."
        actions={
          <button
            onClick={handleReset}
            className="rounded-lg border border-rose-400/40 px-3 py-1 text-xs text-rose-200 hover:bg-rose-500/10"
            type="button"
          >
            Reset data
          </button>
        }
      />

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`rounded-lg border px-3 py-2 text-sm ${
              active === tab.id ? 'border-brand-400/60 bg-brand-500/15 text-white' : 'border-white/10 bg-slate-900/50 text-slate-300'
            }`}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {active === 'day' ? <DayView /> : null}
      {active === 'week' ? <WeekView /> : null}
      {active === 'month' ? <MonthView /> : null}
      {active === 'year' ? <YearView /> : null}
    </div>
  )
}

function DayView(){
  const focus = usePlanner((state) => state.day.focus)
  const blocks = usePlanner((state) => state.day.blocks)
  const events = usePlanner((state) => state.events)
  const addFocus = usePlanner((state) => state.addFocus)
  const removeFocus = usePlanner((state) => state.removeFocus)
  const addBlock = usePlanner((state) => state.addBlock)
  const removeBlock = usePlanner((state) => state.removeBlock)
  const addEvent = usePlanner((state) => state.addEvent)
  const removeEvent = usePlanner((state) => state.removeEvent)

  const [focusInput, setFocusInput] = useState('')
  const [blockForm, setBlockForm] = useState({ time: '', label: '' })
  const [eventForm, setEventForm] = useState({
    title: '',
    date: new Date().toISOString().slice(0, 10),
    start: '',
    end: ''
  })

  function handleFocusSubmit(e){
    e.preventDefault()
    if(!focusInput.trim()) return
    addFocus(focusInput.trim())
    setFocusInput('')
  }

  function handleBlockSubmit(e){
    e.preventDefault()
    if(!blockForm.time || !blockForm.label.trim()) return
    addBlock({ ...blockForm, label: blockForm.label.trim() })
    setBlockForm({ time: '', label: '' })
  }

  function handleEventSubmit(e){
    e.preventDefault()
    if(!eventForm.title.trim() || !eventForm.date || !eventForm.start || !eventForm.end) return
    addEvent({ ...eventForm, title: eventForm.title.trim() })
    setEventForm((prev) => ({ ...prev, title: '', start: '', end: '' }))
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Section title="Focus items">
        <form onSubmit={handleFocusSubmit} className="flex gap-2">
          <input
            value={focusInput}
            onChange={(e) => setFocusInput(e.target.value)}
            placeholder="Add a focus item"
            className="flex-1 rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm outline-none focus:border-brand-400/40 focus:ring-2 focus:ring-brand-400/30"
          />
          <button className="rounded-lg bg-brand-500 px-3 py-2 text-sm text-white hover:bg-brand-600">
            Add
          </button>
        </form>
        <ul className="mt-3 space-y-2 text-sm">
          {focus.length === 0 ? (
            <li className="rounded-lg border border-dashed border-white/10 p-3 text-slate-400">
              Nothing yet. Add up to three.
            </li>
          ) : (
            focus.map((item) => (
              <li key={item.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-900/60 p-3">
                <span>{item.title}</span>
                <button onClick={() => removeFocus(item.id)} className="text-xs text-rose-200 hover:text-rose-100" type="button">
                  Remove
                </button>
              </li>
            ))
          )}
        </ul>
      </Section>
      <Section title="Time blocks">
        <form onSubmit={handleBlockSubmit} className="grid gap-2 md:grid-cols-[7rem,1fr,auto]">
          <input
            type="time"
            value={blockForm.time}
            onChange={(e) => setBlockForm((prev) => ({ ...prev, time: e.target.value }))}
            className="rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm outline-none focus:border-brand-400/40 focus:ring-2 focus:ring-brand-400/30"
          />
          <input
            value={blockForm.label}
            onChange={(e) => setBlockForm((prev) => ({ ...prev, label: e.target.value }))}
            placeholder="What happens here?"
            className="rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm outline-none focus:border-brand-400/40 focus:ring-2 focus:ring-brand-400/30"
          />
          <button className="rounded-lg bg-brand-500 px-3 py-2 text-sm text-white hover:bg-brand-600">
            Add
          </button>
        </form>
        <ul className="mt-3 space-y-2 text-sm">
          {blocks.length === 0 ? (
            <li className="rounded-lg border border-dashed border-white/10 p-3 text-slate-400">
              Add blocks to structure the day.
            </li>
          ) : (
            blocks
              .slice()
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((block) => (
                <li key={block.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-900/60 p-3">
                  <span>
                    <strong className="text-slate-100">{block.time}</strong> — {block.label}
                  </span>
                  <button onClick={() => removeBlock(block.id)} className="text-xs text-rose-200 hover:text-rose-100" type="button">
                    Remove
                  </button>
                </li>
              ))
          )}
        </ul>
      </Section>
      <Section title="Events">
        <form onSubmit={handleEventSubmit} className="grid gap-2 md:grid-cols-[minmax(0,1fr),10rem,7rem,7rem,auto]">
          <input
            value={eventForm.title}
            onChange={(e) => setEventForm((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Meeting or activity"
            className="rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm outline-none focus:border-brand-400/40 focus:ring-2 focus:ring-brand-400/30"
          />
          <input
            type="date"
            value={eventForm.date}
            onChange={(e) => setEventForm((prev) => ({ ...prev, date: e.target.value }))}
            className="rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm outline-none focus:border-brand-400/40 focus:ring-2 focus:ring-brand-400/30"
          />
          <input
            type="time"
            value={eventForm.start}
            onChange={(e) => setEventForm((prev) => ({ ...prev, start: e.target.value }))}
            className="rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm outline-none focus:border-brand-400/40 focus:ring-2 focus:ring-brand-400/30"
          />
          <input
            type="time"
            value={eventForm.end}
            onChange={(e) => setEventForm((prev) => ({ ...prev, end: e.target.value }))}
            className="rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm outline-none focus:border-brand-400/40 focus:ring-2 focus:ring-brand-400/30"
          />
          <button className="rounded-lg bg-brand-500 px-3 py-2 text-sm text-white hover:bg-brand-600">
            Add
          </button>
        </form>
        <ul className="mt-3 space-y-2 text-sm">
          {events.length === 0 ? (
            <li className="rounded-lg border border-dashed border-white/10 p-3 text-slate-400">
              No events yet.
            </li>
          ) : (
            events
              .slice()
              .sort((a, b) => `${a.date}T${a.start}`.localeCompare(`${b.date}T${b.start}`))
              .map((event) => (
                <li key={event.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-900/60 p-3">
                  <span>
                    <strong className="text-slate-100">{event.title}</strong> — {event.date} {event.start}-{event.end}
                  </span>
                  <button onClick={() => removeEvent(event.id)} className="text-xs text-rose-200 hover:text-rose-100" type="button">
                    Remove
                  </button>
                </li>
              ))
          )}
        </ul>
      </Section>
    </div>
  )
}

function WeekView(){
  const week = usePlanner((state) => state.week)
  const setWeekTheme = usePlanner((state) => state.setWeekTheme)

  return (
    <Section title="Week themes">
      <div className="grid gap-3 md:grid-cols-2">
        {week.map((day) => (
          <div key={day.id} className="space-y-2 rounded-lg border border-white/10 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">{day.day}</p>
            <input
              value={day.theme}
              onChange={(e) => setWeekTheme(day.id, e.target.value)}
              placeholder="Theme for the day"
              className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm outline-none focus:border-brand-400/40 focus:ring-2 focus:ring-brand-400/30"
            />
          </div>
        ))}
      </div>
    </Section>
  )
}

function MonthView(){
  const month = usePlanner((state) => state.month)
  const setIntent = usePlanner((state) => state.setMonthIntent)
  const addRitual = usePlanner((state) => state.addRitual)
  const removeRitual = usePlanner((state) => state.removeRitual)

  const [ritualInput, setRitualInput] = useState('')

  function handleSubmit(e){
    e.preventDefault()
    if(!ritualInput.trim()) return
    addRitual(ritualInput.trim())
    setRitualInput('')
  }

  return (
    <Section title="Monthly focus">
      <label className="text-xs uppercase tracking-wide text-slate-400">Intent</label>
      <textarea
        value={month.intent}
        onChange={(e) => setIntent(e.target.value)}
        rows={3}
        placeholder="Write a short sentence about the month."
        className="mt-2 w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm outline-none focus:border-brand-400/40 focus:ring-2 focus:ring-brand-400/30"
      />
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          value={ritualInput}
          onChange={(e) => setRitualInput(e.target.value)}
          placeholder="Add a recurring ritual"
          className="flex-1 rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm outline-none focus:border-brand-400/40 focus:ring-2 focus:ring-brand-400/30"
        />
        <button className="rounded-lg bg-brand-500 px-3 py-2 text-sm text-white hover:bg-brand-600">
          Add
        </button>
      </form>
      <ul className="mt-3 space-y-2 text-sm">
        {month.rituals.length === 0 ? (
          <li className="rounded-lg border border-dashed border-white/10 p-3 text-slate-400">
            No rituals yet.
          </li>
        ) : (
          month.rituals.map((ritual) => (
            <li key={ritual.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-900/60 p-3">
              <span>{ritual.text}</span>
              <button onClick={() => removeRitual(ritual.id)} className="text-xs text-rose-200 hover:text-rose-100" type="button">
                Remove
              </button>
            </li>
          ))
        )}
      </ul>
    </Section>
  )
}

function YearView(){
  const year = usePlanner((state) => state.year)
  const setYearWord = usePlanner((state) => state.setYearWord)
  const addBucketItem = usePlanner((state) => state.addBucketItem)
  const removeBucketItem = usePlanner((state) => state.removeBucketItem)

  const [bucketInput, setBucketInput] = useState('')

  function handleSubmit(e){
    e.preventDefault()
    if(!bucketInput.trim()) return
    addBucketItem(bucketInput.trim())
    setBucketInput('')
  }

  return (
    <Section title="Year lens">
      <label className="text-xs uppercase tracking-wide text-slate-400">Word of the year</label>
      <input
        value={year.word}
        onChange={(e) => setYearWord(e.target.value)}
        placeholder="e.g. Focus"
        className="mt-1 w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm outline-none focus:border-brand-400/40 focus:ring-2 focus:ring-brand-400/30"
      />

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          value={bucketInput}
          onChange={(e) => setBucketInput(e.target.value)}
          placeholder="Add a bucket list item"
          className="flex-1 rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm outline-none focus:border-brand-400/40 focus:ring-2 focus:ring-brand-400/30"
        />
        <button className="rounded-lg bg-brand-500 px-3 py-2 text-sm text-white hover:bg-brand-600">
          Add
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        {year.bucketList.length === 0 ? (
          <span className="rounded-full border border-dashed border-white/10 px-3 py-1 text-slate-400">
            Empty for now.
          </span>
        ) : (
          year.bucketList.map((item) => (
            <span key={item.id} className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900 px-3 py-1">
              {item.text}
              <button onClick={() => removeBucketItem(item.id)} className="text-xs text-rose-200 hover:text-rose-100" type="button">
                Remove
              </button>
            </span>
          ))
        )}
      </div>
    </Section>
  )
}
