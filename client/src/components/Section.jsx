export default function Section({ title, children, right, className = '' }){
  return (
    <section className={`card space-y-3 p-4 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
        {right}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  )
}
