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
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'], credentials: true }))

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString()
  console.log(`📝 ${timestamp} - ${req.method} ${req.path}`)
  next()
})

app.get('/', (_,res)=>res.json({ ok:true }))

app.use('/auth', authRoutes)
app.use('/tasks', taskRoutes)
app.use('/projects', projectRoutes)

const PORT = process.env.PORT || 4000

console.log('🚀 Starting TaskFlow Server...')
console.log('📡 Attempting to connect to MongoDB...')

// Check environment variables
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI environment variable is not set!')
  console.error('💡 Please create a .env file with MONGO_URI=mongodb://localhost:27017/taskflow')
  process.exit(1)
}

console.log('🔧 Environment check:')
console.log(`   MONGO_URI: ${process.env.MONGO_URI}`)
console.log(`   PORT: ${process.env.PORT || 4000}`)
console.log(`   CORS_ORIGIN: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`)

// MongoDB connection event listeners
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB')
})

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err)
})

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected from MongoDB')
})

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT. Graceful shutdown...')
  await mongoose.connection.close()
  console.log('✅ MongoDB connection closed.')
  process.exit(0)
})

mongoose.connect(process.env.MONGO_URI).then(()=>{
  console.log('✅ MongoDB connection successful!')
  console.log(`📊 Connected to database: ${mongoose.connection.name}`)
  console.log(`🌐 Server running on http://localhost:${PORT}`)
  console.log('🎯 API endpoints available:')
  console.log('   GET    /tasks - Get all tasks')
  console.log('   GET    /tasks/date/:date - Get tasks by date')
  console.log('   POST   /tasks - Create new task')
  console.log('   PUT    /tasks/:id - Update task')
  console.log('   PATCH  /tasks/:id/status - Update task status')
  console.log('   DELETE /tasks/:id - Delete task')
  console.log('🔗 CORS enabled for:', process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'])
  
  app.listen(PORT, () => {
    console.log('🎉 TaskFlow Server is ready!')
  })
}).catch(err=>{
  console.error('❌ MongoDB connection failed!')
  console.error('🔍 Error details:', err.message)
  console.error('💡 Make sure MongoDB is running and MONGO_URI is correct')
  console.error('📝 Check your .env file for MONGO_URI setting')
  process.exit(1)
})
