import mongoose from 'mongoose'
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  name: String,
  passwordHash: String,
  settings: {
    theme: { type: String, default: 'dark' },
    startOfWeek: { type: Number, default: 1 },
    defaultView: { type: String, default: 'today' },
    timeZone: { type: String, default: 'Asia/Kolkata' }
  }
}, { timestamps: true })

export default mongoose.model('User', UserSchema)
