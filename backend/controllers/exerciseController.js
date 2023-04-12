const Exercise = require('../models/exerciseModel')
const mongoose = require('mongoose')

// GET all exercises
const getExercises = async (req, res) => {
  // workout Id
  const { workoutid } = req.params

  if (!mongoose.Types.ObjectId.isValid(workoutid)) {
    return res.status(404).json({ error: 'No such workout' })
  }
  // user Id
  const user_id = req.user._id

  const exercises = await Exercise.find({ user_id, workoutid }).sort({ createdAt: -1 })

  res.status(200).json(exercises)
}

// GET a single exercise

const getExercise = async (req, res) => {
  // exercise Id
  const { id } = req.params 

  if(!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such exercise'})
  }

  const exercise = await Exercise.findById(id)

  if (!exercise) {
    return res.status(404).json({error: 'No such exercise'})
  }

  res.status(200).send(exercise)
}

// POST new exercise
const createExercise = async (req, res) => {
   const { title, load, reps, time, imageStart, imageEnd, explanation, video, workoutid } = req.body

  let emptyFields = []

  if(!title) {
    emptyFields.push('title')
  }
  if(!load) {
    emptyFields.push('load')
  }
  if(!reps) {
    emptyFields.push('reps')
  }
  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in title, load and reps fields', emptyFields })
  } else {
    emptyFields = []
  }

// add doc to db
   try {
    const user_id = req.user._id 
     const exercise = await Exercise.create({ title, load, reps, time, imageStart, imageEnd, explanation, video, workoutid, user_id })
     res.status(200).send(exercise)
   } catch (error) {
     res.status(400).json({ error: error.message })
   }
}

// DELETE all exercises
const deleteExercises = async (req, res) => {
  const { workoutid } = req.params
console.log(req.params)
  if (!mongoose.Types.ObjectId.isValid(workoutid)) {
    return res.status(404).json({ error: 'Invalid workout ID' })
  }

  try {
    const result = await Exercise.deleteMany({ workoutid})
    res.status(200).json({ message: `${result.deletedCount} exercises have been deleted` })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to delete exercises' })
  }
}


// DELETE an exercise
const deleteExercise = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such exercise' })
  }

  const exercise = await Exercise.findOneAndDelete({_id: id})

  if (!exercise) {
    return res.status(404).json({ error: 'No such exercise' })
  }

  res.status(200).send(exercise)
}

// PATCH an exercise
  const updateExercise = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'No such exercise' })
    }

    const exercise = await Exercise.findOneAndUpdate({_id: id}, {
      ...req.body
    })

    if (!exercise) {
      return res.status(404).json({ error: 'No such exercise' })
    }

    res.status(200).send(exercise)
  }

  module.exports = {
    getExercises,
    getExercise,
    createExercise,
    deleteExercises,
    deleteExercise,
    updateExercise,
  }