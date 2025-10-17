import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const r = Router()

r.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body
    
    // Validate required fields
    if (!email || !password || !name) {
      return res.status(400).json({ 
        error: 'Name, email, and password are required' 
      })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)
    
    // Create user (no duplicate check as requested)
    const user = await User.create({ 
      email, 
      passwordHash, 
      name 
    })
    
    // Generate JWT token
    const token = jwt.sign(
      { sub: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    )
    
    console.log(`✅ New user registered: ${name} (${email})`)
    
    res.status(201).json({ 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    console.error('❌ Registration error:', error.message)
    res.status(500).json({ error: 'Registration failed' })
  }
})

r.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      })
    }

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      console.log(`❌ Login attempt with non-existent email: ${email}`)
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash || '')
    if (!isValidPassword) {
      console.log(`❌ Invalid password attempt for: ${email}`)
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate JWT token
    const token = jwt.sign(
      { sub: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    )

    console.log(`✅ User logged in: ${user.name} (${email})`)

    res.json({ 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    console.error('❌ Login error:', error.message)
    res.status(500).json({ error: 'Login failed' })
  }
})

export default r
