const Workout = require('../models/workoutModel')
const mongoose = require('mongoose')

// GET all workouts
const getWorkouts = async (req, res) => {

  const user_id = req.user._id

  const workouts = await Workout.find({ user_id }).sort({createdAt: -1})

  res.status(200).json(workouts)
}

// GET a single workout

const getWorkout = async (req, res) => {
  // workout Id
  const { id } = req.params 

  if(!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such workout'})
  }

  const workout = await Workout.findById(id)

  if (!workout) {
    return res.status(404).json({error: 'No such workout'})
  }

  res.status(200).json(workout)
}

// POST new workout
const createWorkout = async (req, res) => {
   const { title, startDate, endDate, frequency, type } = req.body

  let emptyFields = []

  if(!title) {
    emptyFields.push('title')
  }
  if(!startDate) {
    emptyFields.push('startDate')
  }
  if(!endDate) {
    emptyFields.push('endDate')
  }
  if(!frequency) {
    emptyFields.push('frequency')
  }
  if(!type) {
    emptyFields.push('type')
  }

  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all fields', emptyFields })
  } else {
    emptyFields = []
  }

// add doc to db
   try {
    const user_id = req.user._id 
    const workout = await Workout.create({ title, startDate, endDate, frequency, type, user_id })
    res.status(200).json(workout)
   } catch (error) {
     res.status(400).json({ error: error.message, emptyFields: [] })
   }
}

// DELETE a workout
const deleteWorkout = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such workout' })
  }
 
  const workout = await Workout.findOneAndDelete({_id: id})

  if (!workout) {
    return res.status(404).json({ error: 'No such workout' })
  }

  res.status(200).json(workout)
}


// PATCH a workout
  const updateWorkout = async (req, res) => {
    const { id } = req.params
console.log('Workout ID:', id)
    if (!mongoose.Types.ObjectId.isValid(id)) {

      return res.status(404).json({ error: 'No such workout' })
    }

    const workout = await Workout.findOneAndUpdate(
      { _id: id },
      {
        ...req.body,
      },
      {
        new: true,
      }
    )

    if (!workout) {
      return res.status(404).json({ error: 'No such workout' })
    }

    res.status(200).json(workout)
  }

module.exports = {
  getWorkouts,
  getWorkout,
  createWorkout,
  deleteWorkout,
  updateWorkout
}