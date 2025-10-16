import { Router } from 'express'
import Project from '../models/Project.js'
import { auth } from '../middleware/auth.js'

const r = Router()

r.get('/', auth, async (req, res) => {
  const list = await Project.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(200)
  res.json(list)
})

r.post('/', auth, async (req, res) => {
  const p = await Project.create({ ...req.body, userId: req.user._id })
  res.status(201).json(p)
})

export default r
