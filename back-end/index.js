const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')

const app = express()
dotenv.config()

console.log('Environment variables loaded:')
console.log('MongoDB_URI:', process.env.MongoDB_URI)
console.log('SECRET_KEY:', process.env.SECRET_KEY ? 'Set' : 'Not set')
console.log('password:', process.env.password ? 'Set' : 'Not set')

async function connectToMongoDB() {
    try {
        await mongoose.connect(process.env.MongoDB_URI, {
            serverSelectionTimeoutMS: 5000,
        })
        console.log('MongoDB connected successfully!')
        console.log('Database:', mongoose.connection.name)
        return true
    } catch (error) {
        console.error('MongoDB connection failed:', error.message)
        console.log('Falling back to in-memory storage')
        return false
    }
}

app.use(express.json())
app.use(cors())

async function startServer() {
    const connected = await connectToMongoDB()
    
    if (connected) {
        const UserRouter = require('./routes/userRouter')
        console.log('Using MongoDB for persistent data storage')
        app.use('/User', UserRouter)
    } else {
        const UserRouter = require('./routes/userRouter-memory')
        console.log('Using IN-MEMORY storage - data will be lost on restart')
        app.use('/User', UserRouter)
    }
    
    app.listen(5000, () => {
        console.log('Server running on port 5000')
        console.log('Frontend can connect to: http://localhost:5000')
    })
}

startServer()

process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...')
    if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close()
        console.log('MongoDB connection closed')
    }
    process.exit(0)
})