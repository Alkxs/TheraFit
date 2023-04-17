const express = require('express')
const router = express.Router({ mergeParams: true })
const upload = require('../config/cloudinary')
const { 
  getExercises, 
  getExercise, 
  createExercise, 
  deleteExercises,
  deleteExercise, 
  updateExercise 
  } = require('../controllers/exerciseController')

  const uploadFile = upload
 
 //GET all exercises
router.get('/', getExercises)
 
//GET a single exercise
router.get('/:exerciseId', getExercise)

//POST a new exercise
router.post('/', uploadFile.fields([{ name: 'imageStartFile' }, { name: 'imageEndFile' }]), createExercise) 

//DELETE all exercises (of a specific workout)
router.delete('/', deleteExercises)

//DELETE a single exercise
router.delete('/:exerciseId', deleteExercise)

//PATCH
router.patch(
  '/:exerciseId/edit',upload.fields([
    { name: 'imageStartFile', maxCount: 1 },
    { name: 'imageEndFile', maxCount: 1 },
  ]),
  updateExercise
)

module.exports = router