const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const connectDB = require('./config/database')
const userRoutes = require('./routes/user')
const workoutRoutes = require('./routes/workouts')
require('dotenv').config({path: './config/.env'})
const morgan = require('morgan')
const app = express()


const frontendUrl = process.env.NODE_ENV === 'production' ? 'https://therafit.netlify.app' : 'http://localhost:5173'

app.use(morgan('dev'))

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

// app.use((req, res, next) => {
//   console.log(req.path, req.method)
//   next()
// })

//routes
app.use('/', workoutRoutes)
app.use('/api/user', userRoutes)

// connect to DB
connectDB()

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

//listen for requests
 app.listen(process.env.PORT || 3000, () => {
  console.log(`server is running, you better catch it!`)
 })
 