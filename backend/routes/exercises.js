const express = require('express')
const router = express.Router({ mergeParams: true })
//const upload = require('../middleware/multer')
const { 
  getExercises, 
  getExercise, 
  createExercise, 
  deleteExercises,
  deleteExercise, 
  updateExercise 
  } = require('../controllers/exerciseController')
 
 //GET all exercises
router.get('/', getExercises)
 
//GET a single exercise
router.get('/:exerciseId', getExercise)

//POST a new exercise
router.post('/', createExercise) 

//DELETE all exercises (of a specific workout)
router.delete('/', deleteExercises)

//DELETE a single exercise
router.delete('/:exerciseId', deleteExercise)

//PATCH
router.patch('/:exerciseId/edit', updateExercise)



module.exports = router