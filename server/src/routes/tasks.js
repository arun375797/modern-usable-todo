import { Router } from 'express'
import Task from '../models/Task.js'
import { auth } from '../middleware/auth.js'

const r = Router()

// Get all tasks for a user
r.get('/', auth, async (req, res) => {
  try {
    const { date, status } = req.query
    const query = { userId: req.user._id }
    
    if (date) {
      query.date = date
    }
    
    if (status) {
      query.status = status
    }
    
    const tasks = await Task.find(query)
      .sort({ 
        status: 1, // finished tasks last
        startTime: 1, // then by start time
        createdAt: 1 // then by creation time
      })
    
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get tasks for a specific date
r.get('/date/:date', auth, async (req, res) => {
  try {
    const { date } = req.params
    const tasks = await Task.find({ 
      userId: req.user._id, 
      date: date 
    }).sort({ 
      status: 1, // finished tasks last
      startTime: 1, // then by start time
      createdAt: 1 // then by creation time
    })
    
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create a new task
r.post('/', auth, async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      userId: req.user._id
    }
    
    const task = await Task.create(taskData)
    res.status(201).json(task)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Update a task
r.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    )
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }
    
    res.json(task)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Update task status
r.patch('/:id/status', auth, async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    
    const updateData = { status }
    const now = new Date().getTime()
    
    if (status === 'start') {
      updateData.timerStartTime = now
      updateData.timerPauseTime = 0
    } else if (status === 'finish') {
      updateData.finishedAt = now
    }
    
    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      updateData,
      { new: true }
    )
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }
    
    res.json(task)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Delete a task
r.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    const task = await Task.findOneAndDelete({ 
      _id: id, 
      userId: req.user._id 
    })
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }
    
    res.json({ message: 'Task deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default r
