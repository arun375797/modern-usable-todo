import { Router } from 'express'
import Task from '../models/Task.js'
import { auth } from '../middleware/auth.js'

const r = Router()

r.get('/', auth, async (req, res) => {
  const { view } = req.query
  const q = { userId: req.user._id, archived: { $ne: true } }
  const tasks = await Task.find(q).sort({ priority: 1, 'when.due': 1 }).limit(200)
  res.json(tasks)
})

r.post('/', auth, async (req, res) => {
  const payload = { ...req.body, userId: req.user._id }
  const t = await Task.create(payload)
  res.status(201).json(t)
})

export default r
