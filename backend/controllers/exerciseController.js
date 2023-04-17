const Exercise = require('../models/exerciseModel')
const mongoose = require('mongoose')
const cloudinary = require('../config/cloudinaryInstance')


// GET all exercises
const getExercises = async (req, res) => {
  // workout Id
  const { workoutId } = req.params
  if (!mongoose.Types.ObjectId.isValid(workoutId)) {
    return res.status(404).json({ error: 'No such workout' })
  }
  // user Id
  const user_id = req.user._id

  const exercises = await Exercise.find({ user_id, workoutId }).sort({ createdAt: +1 })

  res.status(200).json(exercises)
}

// POST new exercise
const createExercise = async (req, res) => {
   const { title, load, reps, time, imageStartLink, imageEndLink, explanation, video, workoutId } = req.body

   let imageStartFile, imageEndFile

    let imageStartPublicId, imageEndPublicId

   if (req.files.imageStartFile) {
     imageStartFile = req.files.imageStartFile[0].path
     imageStartPublicId = req.files.imageStartFile[0].filename
   } else {
     imageStartFile = imageStartLink
   }

   if (req.files.imageEndFile) {
     imageEndFile = req.files.imageEndFile[0].path
     imageEndPublicId = req.files.imageEndFile[0].filename
   } else {
     imageEndFile = imageEndLink
   }

  let emptyFields = []

  if(!title) {
    emptyFields.push('title')
  }
  
  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in the title', emptyFields })
  }

// add doc to db
   try {
    const user_id = req.user._id 

     const exercise = await Exercise.create({
       title,
       load,
       reps,
       time,
       imageStartFile,
       imageEndFile,
       imageStartPublicId,
       imageEndPublicId,
       explanation,
       video,
       workoutId,
       user_id,
     })
     res.status(200).send(exercise)
   } catch (error) {
     res.status(400).json({ error: error.message })
   }
}

// DELETE all exercises
const deleteExercises = async (req, res) => {
  const { workoutId } = req.params

  if (!mongoose.Types.ObjectId.isValid(workoutId)) {
    return res.status(404).json({ error: 'Invalid workout ID' })
  }

  try {
    const result = await Exercise.deleteMany({ workoutId})
    res.status(200).json({ message: `${result.deletedCount} exercises have been deleted` })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to delete exercises' })
  }
}


// DELETE an exercise
const deleteExercise = async (req, res) => {
  const { exerciseId } = req.params

  if (!mongoose.Types.ObjectId.isValid(exerciseId)) {
    return res.status(404).json({ error: 'No such exercise' })
  }

  const exercise = await Exercise.findOneAndDelete({ _id: exerciseId }).lean()

  if (!exercise) {
    return res.status(404).json({ error: 'No such exercise' })
  }

  if (exercise.imageStartPublicId) {
    await cloudinary.uploader.destroy(exercise.imageStartPublicId)
  }

  if (exercise.imageEndPublicId) {
    await cloudinary.uploader.destroy(exercise.imageEndPublicId)
  }

  res.status(200).json(exercise)
}

// PATCH an exercise
  const updateExercise = async (req, res) => {
    const { exerciseId } = req.params

    if (!mongoose.Types.ObjectId.isValid(exerciseId)) {
      return res.status(404).json({ error: 'No such exercise' })
    }

    const { title, load, reps, time, imageStartLink, imageEndLink, explanation, video, workoutId } = req.body

    let imageStartFile, imageEndFile
    let imageStartPublicId, imageEndPublicId

     if (req.files.imageStartFile) {
       imageStartFile = req.files.imageStartFile[0].path
       imageStartPublicId = req.files.imageStartFile[0].filename
     } else {
       imageStartFile = imageStartLink
     }

     if (req.files.imageEndFile) {
       imageEndFile = req.files.imageEndFile[0].path
       imageEndPublicId = req.files.imageEndFile[0].filename
     } else {
       imageEndFile = imageEndLink
     }

     const exerciseData = {
       title,
       load,
       reps,
       time,
       imageStartFile,
       imageEndFile,
       imageStartPublicId,
       imageEndPublicId,
       explanation,
       video,
       workoutId,
     }

    const exercise = await Exercise.findOneAndUpdate({ _id: exerciseId }, exerciseData, {
      new: true, // Return the updated document
      runValidators: true, // Validate the update operation
    }
    )

    if (!exercise) {
      return res.status(404).json({ error: 'No such exercise' })
    }

    res.status(200).json(exercise)
  }

  module.exports = {
    getExercises,
    createExercise,
    deleteExercises,
    deleteExercise,
    updateExercise,
  }