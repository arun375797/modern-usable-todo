import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const r = Router()

r.post('/register', async (req, res) => {
  const { email, password, name } = req.body
  if(!email || !password) return res.status(400).json({ error: 'email & password required' })
  const existing = await User.findOne({ email })
  if(existing) return res.status(409).json({ error: 'Email exists' })
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ email, passwordHash, name })
  const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.json({ token })
})

r.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if(!user) return res.status(401).json({ error: 'Invalid creds' })
  const ok = await bcrypt.compare(password, user.passwordHash || '')
  if(!ok) return res.status(401).json({ error: 'Invalid creds' })
  const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.json({ token })
})

export default r
