# TaskFlow MongoDB Setup Guide

## Prerequisites
1. **MongoDB**: Install MongoDB locally or use MongoDB Atlas
2. **Node.js**: Version 16 or higher
3. **npm**: Package manager

## Quick Setup

### 1. Install MongoDB
- **Windows**: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
- **macOS**: `brew install mongodb-community`
- **Linux**: Follow [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)

### 2. Start MongoDB
```bash
# Start MongoDB service
mongod

# Or if installed via Homebrew (macOS)
brew services start mongodb-community
```

### 3. Create Environment File
Create a `.env` file in the `server` directory:
```env
MONGO_URI=mongodb://localhost:27017/taskflow
PORT=4000
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
```

### 4. Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 5. Start the Application
```bash
# Terminal 1 - Start MongoDB (if not running as service)
mongod

# Terminal 2 - Start server
cd server
npm run dev

# Terminal 3 - Start client
cd client
npm run dev
```

## Expected Console Output

### Successful Connection:
```
🚀 Starting TaskFlow Server...
📡 Attempting to connect to MongoDB...
🔧 Environment check:
   MONGO_URI: mongodb://localhost:27017/taskflow
   PORT: 4000
   CORS_ORIGIN: http://localhost:5173
🔗 Mongoose connected to MongoDB
✅ MongoDB connection successful!
📊 Connected to database: taskflow
🌐 Server running on http://localhost:4000
🎯 API endpoints available:
   GET    /tasks - Get all tasks
   GET    /tasks/date/:date - Get tasks by date
   POST   /tasks - Create new task
   PUT    /tasks/:id - Update task
   PATCH  /tasks/:id/status - Update task status
   DELETE /tasks/:id - Delete task
🔗 CORS enabled for: http://localhost:5173
🎉 TaskFlow Server is ready!
```

### Connection Failed:
```
🚀 Starting TaskFlow Server...
📡 Attempting to connect to MongoDB...
❌ MongoDB connection failed!
🔍 Error details: connect ECONNREFUSED 127.0.0.1:27017
💡 Make sure MongoDB is running and MONGO_URI is correct
📝 Check your .env file for MONGO_URI setting
```

## Troubleshooting

### MongoDB Not Running
- **Error**: `ECONNREFUSED 127.0.0.1:27017`
- **Solution**: Start MongoDB service or run `mongod`

### Wrong Connection String
- **Error**: `Invalid connection string`
- **Solution**: Check your `.env` file MONGO_URI format

### Port Already in Use
- **Error**: `EADDRINUSE :::4000`
- **Solution**: Change PORT in `.env` file or kill existing process

### CORS Issues
- **Error**: Frontend can't connect to API
- **Solution**: Verify CORS_ORIGIN matches your frontend URL

## MongoDB Atlas (Cloud Alternative)

If you prefer cloud MongoDB:

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string
4. Update `.env`:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taskflow
```

## Testing the Connection

Once running, test the API:
```bash
# Test server health
curl http://localhost:4000

# Expected response: {"ok":true}
```

## Next Steps

1. Open `http://localhost:5173` in your browser
2. Navigate to `/login` to sign in
3. Start creating and managing tasks!

Happy coding! 🚀
