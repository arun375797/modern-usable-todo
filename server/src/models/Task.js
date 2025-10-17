import mongoose from 'mongoose'

const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, index: true, required: true },
  title: { type: String, required: true },
  description: String,
  url: String,
  startTime: String, // Format: "HH:MM"
  endTime: String,   // Format: "HH:MM"
  resources: String,
  color: { type: String, default: '#8b5cf6' },
  priority: { 
    type: String, 
    enum: ['high', 'medium', 'low'], 
    default: 'medium' 
  },
  status: { 
    type: String, 
    enum: ['start', 'pause', 'finish'], 
    default: 'start' 
  },
  category: { 
    type: String, 
    enum: ['work', 'personal', 'health', 'education', 'shopping', 'travel', 'entertainment', 'other'], 
    default: 'other' 
  },
  date: { type: String, required: true }, // Format: "YYYY-MM-DD"
  timerStartTime: Number, // Timestamp when timer started
  timerPauseTime: Number, // Total paused time in milliseconds
  finishedAt: Number,     // Timestamp when task was finished
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true })

// Index for efficient queries
TaskSchema.index({ userId: 1, date: 1 })
TaskSchema.index({ userId: 1, status: 1 })

export default mongoose.model('Task', TaskSchema)
