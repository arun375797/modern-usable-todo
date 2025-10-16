// Very light parser: "Pay bill tomorrow 9am #finance @home"
export function parseQuick(input){
  const tagMatches = [...input.matchAll(/#(\w+)/g)]
  const ctxMatches = [...input.matchAll(/@(\w+)/g)]
  const tags = tagMatches.map(m => m[1])
  const contexts = ctxMatches.map(m => m[1])
  const title = input.replace(/[#@]\w+/g, '').trim()
  const due = null // plug chrono/date-fns later
  return { title, tags, contexts, due }
}
