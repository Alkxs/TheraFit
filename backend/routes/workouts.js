const express = require('express')
const router = express.Router()
//const upload = require('../middleware/multer')
const exercisesRoutes = require('./exercises')

const { 
  getWorkouts,
  createWorkout,
  deleteWorkout,
  updateWorkout
   } = require('../controllers/workoutController')

const requireAuth = require('../middleware/requireAuth')

//GET all workouts
router.get('/', requireAuth, getWorkouts)

//POST a new workout
router.post('/', requireAuth, createWorkout) 

//DELETE
router.delete('/:workoutId', requireAuth, deleteWorkout)

//PATCH
router.patch('/:workoutId/edit', requireAuth, updateWorkout)

// EXERCISES ROUTES
router.use('/:workoutId/exercises', requireAuth, exercisesRoutes)


module.exports = router