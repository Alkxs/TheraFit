const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const connectDB = require('./config/database')
const userRoutes = require('./routes/user')
const workoutRoutes = require('./routes/workouts')
require('dotenv').config({path: './config/.env'})
const app = express()

const frontendUrl = process.env.NODE_ENV === 'production' ? 'https://therafit.netlify.app' : 'http://localhost:5173'

//middleware
app.use(express.json())
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [frontendUrl]

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
  })
)

app.use((error, req, res, next) => {
  res.status(500).json({ error: error.message })
})


//routes
app.use('/', workoutRoutes)
app.use('/api/user', userRoutes)

// connect to DB
connectDB()

//listen for requests
 app.listen(process.env.PORT || 3000, () => {
  console.log(`server is running on port ${process.env.PORT}, you better catch it!`)
 })
 