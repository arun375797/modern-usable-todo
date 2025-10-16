import { useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { useTasks } from '../hooks/useTasks'
import { usePlanner } from '../store/usePlanner'
import { getMonthMatrix, getMonthLabel, getWeekdays, toKey } from '../utils/calendar'

export default function Calendar(){
  const [viewDate, setViewDate] = useState(new Date())
  const { data: tasks, error } = useTasks({ view: 'calendar' })
  const events = usePlanner((state) => state.events)

  const monthMatrix = useMemo(
    () => getMonthMatrix(viewDate.getFullYear(), viewDate.getMonth()),
    [viewDate]
  )
  const tasksByDate = useMemo(() => groupTasks(tasks), [tasks])
  const eventsByDate = useMemo(() => groupEvents(events), [events])
  const upcomingTasks = useMemo(() => getUpcomingTasks(tasks, 5), [tasks])
  const upcomingEvents = useMemo(() => getUpcomingEvents(events, 5), [events])

  function moveMonth(delta){
    const next = new Date(viewDate)
    next.setMonth(viewDate.getMonth() + delta)
    setViewDate(next)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        subtitle="A clear month grid plus quick lists of what is coming up."
        actions={
          <div className="flex gap-2 text-xs text-slate-300">
            <button onClick={() => moveMonth(-1)} className="rounded-lg border border-white/10 px-3 py-1 hover:border-brand-400/40" type="button">
              Prev
            </button>
            <button onClick={() => setViewDate(new Date())} className="rounded-lg border border-white/10 px-3 py-1 hover:border-brand-400/40" type="button">
              Today
            </button>
            <button onClick={() => moveMonth(1)} className="rounded-lg border border-white/10 px-3 py-1 hover:border-brand-400/40" type="button">
              Next
            </button>
          </div>
        }
      />

      <Section title={getMonthLabel(viewDate)} right={<span className="text-xs text-slate-400">Week starts Monday</span>}>
        <div className="grid gap-1 text-xs text-slate-400 sm:grid-cols-7">
          {getWeekdays().map((weekday) => (
            <div key={weekday} className="hidden rounded-lg px-3 py-2 text-center uppercase tracking-wide sm:block">
              {weekday}
            </div>
          ))}
        </div>
        <div className="grid gap-1 sm:grid-cols-7">
          {monthMatrix.flat().map((cell) => {
            const key = toKey(cell.date)
            const dayTasks = tasksByDate.get(key) || []
            const dayEvents = eventsByDate.get(key) || []
            const isToday = isSameDay(cell.date, new Date())
            return (
              <div
                key={key + cell.inMonth}
                className={`rounded-lg border p-3 text-xs ${
                  cell.inMonth ? 'border-white/10 bg-slate-900/60' : 'border-transparent bg-slate-900/20 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={cell.inMonth ? 'text-sm font-semibold text-slate-100' : 'text-sm text-slate-500'}>
                    {cell.date.getDate()}
                  </span>
                  {isToday ? (
                    <span className="rounded-full bg-brand-500/20 px-2 py-0.5 text-[10px] font-semibold text-brand-100">
                      Today
                    </span>
                  ) : null}
                </div>
                <div className="mt-2 space-y-1">
                  {dayTasks.slice(0, 2).map((task) => (
                    <div key={task._id} className="rounded bg-brand-500/10 px-2 py-1 text-brand-100">
                      {task.title}
                    </div>
                  ))}
                  {dayEvents.slice(0, 2).map((event) => (
                    <div key={event.id} className="rounded bg-emerald-500/10 px-2 py-1 text-emerald-100">
                      {event.start} {event.title}
                    </div>
                  ))}
                  {dayTasks.length + dayEvents.length > 4 ? (
                    <div className="text-[10px] text-slate-400">
                      + {dayTasks.length + dayEvents.length - 4} more
                    </div>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Upcoming tasks" right={<span className="text-xs text-slate-400">{upcomingTasks.length} items</span>}>
          {error ? (
            <p className="rounded-lg border border-dashed border-white/10 p-4 text-sm text-amber-200">
              Unable to load tasks. Sign in to see live data.
            </p>
          ) : null}
          {!error && upcomingTasks.length === 0 ? (
            <p className="rounded-lg border border-dashed border-white/10 p-4 text-sm text-slate-400">
              Add due dates to tasks so they appear here.
            </p>
          ) : null}
          <ul className="space-y-2 text-sm">
            {upcomingTasks.map((task) => (
              <li key={task._id} className="rounded-lg border border-white/10 bg-slate-900/70 p-4">
                <p className="font-medium text-slate-100">{task.title}</p>
                <p className="text-xs text-slate-400">
                  {task.when?.due ? formatDateTime(task.when.due) : 'No due date'}
                </p>
              </li>
            ))}
          </ul>
        </Section>
        <Section title="Upcoming events" right={<span className="text-xs text-slate-400">{upcomingEvents.length} items</span>}>
          {upcomingEvents.length === 0 ? (
            <p className="rounded-lg border border-dashed border-white/10 p-4 text-sm text-slate-400">
              Add events from Planner → Day to see them here.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {upcomingEvents.map((event) => (
                <li key={event.id} className="rounded-lg border border-white/10 bg-slate-900/70 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-100">{event.title}</span>
                    <span className="text-xs text-slate-400">{formatDate(event.date)}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    {event.start} - {event.end}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </div>
  )
}

function groupTasks(list = []){
  const map = new Map()
  list?.forEach((task) => {
    if(!task.when?.due) return
    const key = toKey(new Date(task.when.due))
    if(!map.has(key)) map.set(key, [])
    map.get(key).push(task)
  })
  return map
}

function groupEvents(list = []){
  const map = new Map()
  list.forEach((event) => {
    if(!event.date) return
    if(!map.has(event.date)) map.set(event.date, [])
    map.get(event.date).push(event)
  })
  return map
}

function getUpcomingTasks(list = [], limit = 5){
  return (list ?? [])
    .filter((task) => task.when?.due)
    .sort((a, b) => new Date(a.when.due) - new Date(b.when.due))
    .slice(0, limit)
}

function getUpcomingEvents(list = [], limit = 5){
  const now = new Date().toISOString()
  return list
    .filter((event) => event.date)
    .filter((event) => `${event.date}T${event.start || '00:00'}` >= now)
    .sort((a, b) => `${a.date}T${a.start || '00:00'}`.localeCompare(`${b.date}T${b.start || '00:00'}`))
    .slice(0, limit)
}

function isSameDay(a, b){
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function formatDate(value){
  return new Date(value).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

function formatDateTime(value){
  return new Date(value).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
