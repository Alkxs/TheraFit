const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const connectDB = require('./config/database')
require('dotenv').config({path: './config/.env'})
const userRoutes = require('./routes/user')
const workoutRoutes = require('./routes/workouts')

//middleware
app.use(express.json())
//app.use(express.urlencoded({extended: true}))

app.use(cors())

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

//routes
app.use('/', workoutRoutes)
app.use('/api/user', userRoutes)

// connect to DB
connectDB()

//listen for requests
 app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}, you better catch it!`)
 })
 