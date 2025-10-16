import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.js'
import taskRoutes from './routes/tasks.js'
import projectRoutes from './routes/projects.js'

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'], credentials: true }))

app.get('/', (_,res)=>res.json({ ok:true }))

app.use('/auth', authRoutes)
app.use('/tasks', taskRoutes)
app.use('/projects', projectRoutes)

const PORT = process.env.PORT || 4000
mongoose.connect(process.env.MONGO_URI).then(()=>{
  app.listen(PORT, ()=> console.log('API on http://localhost:'+PORT))
}).catch(err=>{
  console.error('Mongo connect error', err)
  process.exit(1)
})
