const express = require('express')
const router = express.Router({ mergeParams: true })
const upload = require('../config/cloudinary')
const { 
  getExercises, 
  createExercise, 
  deleteExercises,
  deleteExercise, 
  updateExercise 
  } = require('../controllers/exerciseController')

const requireAuth = require('../middleware/requireAuth')

const uploadFile = upload
 
 //GET all exercises
router.get('/', requireAuth, getExercises)

//POST a new exercise
router.post('/', requireAuth, uploadFile.fields([{ name: 'imageStartFile', maxCount: 1 }, { name: 'imageEndFile', maxCount: 1 }]), createExercise) 

//DELETE all exercises (of a specific workout)
router.delete('/', requireAuth, deleteExercises)

//DELETE a single exercise
router.delete('/:exerciseId', requireAuth, deleteExercise)

//PATCH
router.patch(
  '/:exerciseId/edit',
  requireAuth, 
  upload.fields([
    { name: 'imageStartFile', maxCount: 1 },
    { name: 'imageEndFile', maxCount: 1 },
  ]),
  updateExercise
)

module.exports = router