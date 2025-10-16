import { usePlanner } from '../store/usePlanner'

const typeStyles = {
  focus: 'bg-brand-500/20 text-brand-50 border-brand-500/30',
  build: 'bg-emerald-500/15 text-emerald-100 border-emerald-500/30',
  collab: 'bg-sky-500/15 text-sky-100 border-sky-500/30',
  ritual: 'bg-amber-500/15 text-amber-100 border-amber-500/30',
  health: 'bg-rose-500/15 text-rose-100 border-rose-500/30'
}

export default function TimeBlocks(){
  const blocks = usePlanner((state) => state.day.blocks)

  if(!blocks.length){
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/40 p-5 text-sm text-slate-400">
        No time blocks yet. Add them in the Planner → Day view.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 text-sm">
      {blocks
        .slice()
        .sort((a, b) => a.time.localeCompare(b.time))
        .map((block) => (
          <div
            key={block.id}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 shadow-sm shadow-slate-950/40"
          >
            <div className="rounded-xl bg-slate-900/80 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
              {block.time}
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-100">{block.label}</p>
              {block.type ? (
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  {block.type}
                </p>
              ) : null}
            </div>
            {block.type ? (
              <div
                className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
                  typeStyles[block.type] || 'bg-slate-800 text-slate-200 border-white/10'
                }`}
              >
                {block.type}
              </div>
            ) : null}
          </div>
        ))}
    </div>
  )
}
