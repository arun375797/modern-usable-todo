import mongoose from 'mongoose'
const ProjectSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, index: true, required: true },
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['active','paused','done'], default: 'active' },
  color: String,
  tags: [String]
}, { timestamps: true })
export default mongoose.model('Project', ProjectSchema)
