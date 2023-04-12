const express = require('express')
const router = express.Router()
//const upload = require('../middleware/multer')
const exercisesRoutes = require('./exercises')

const { 
  getWorkouts,
  getWorkout,
  createWorkout,
  deleteWorkout,
  updateWorkout
   } = require('../controllers/workoutController')

const requireAuth = require('../middleware/requireAuth')


// router.use(requireAuth)
 
//GET all workouts
router.get('/', requireAuth, getWorkouts)
 
//GET a single workout
router.get('/:workoutId', getWorkout)

//POST a new workout
router.post('/', requireAuth, createWorkout) 

//DELETE
router.delete('/:workoutId', requireAuth, deleteWorkout)

//PATCH
router.patch('/:workoutId/edit', requireAuth, updateWorkout)

// EXERCISES ROUTES
router.use('/:workoutId/exercises', requireAuth, exercisesRoutes)


module.exports = router