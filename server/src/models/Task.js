import mongoose from 'mongoose'
const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, index: true, required: true },
  projectId: { type: mongoose.Types.ObjectId, ref: 'Project' },
  title: { type: String, required: true },
  descriptionMD: String,
  status: { type: String, enum: ['todo','doing','done','blocked'], default: 'todo' },
  priority: { type: Number, min:1, max:5, default:3 },
  when: {
    start: Date,
    due: { type: Date, index: true },
    scheduled: Date
  },
  repeat: {
    type: { type: String, enum: ['none','daily','weekly','monthly','yearly','custom'], default: 'none' },
    rrule: String,
    timezone: { type: String, default: 'Asia/Kolkata' }
  },
  checklist: [{ title: String, done: Boolean }],
  estimateMin: Number,
  actualMin: Number,
  tags: [String],
  dependsOn: [{ type: mongoose.Types.ObjectId, ref: 'Task' }],
  links: [{ label: String, url: String }],
  archived: { type: Boolean, default: false }
}, { timestamps: true })

export default mongoose.model('Task', TaskSchema)
