// Hooks
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
// Custom Hooks
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useExercisesContext } from '../hooks/useExercisesContext'
import { useAuthContext } from '../hooks/useAuthContext'
//components
import ExerciseComponent from '../components/ExerciseComponent'
import { FaArrowLeft } from 'react-icons/fa'

const WorkoutPage = () => {
  const { workoutId } = useParams()
  const { workouts } = useWorkoutsContext()
  const { exercises, dispatch } = useExercisesContext()
  const { user } = useAuthContext()
  const navigate = useNavigate()

  const workout = workouts.find((w) => w._id === workoutId)

  useEffect(() => {
   
    const fetchExercises = async () => {

      const res = await fetch(`http://localhost:3000/${workoutId}/exercises`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      const data = await res.json()
      console.log('Fetched exercises:', data)
      if (res.ok) {
        dispatch({ type: 'SET_EXERCISES', payload: data })
      } else {
        console.error('Error fetching exercises:', data.error)
      }
    }
    if (user) {
      fetchExercises()
    }
  }, [dispatch, user, workoutId])

  return (
    <div className='workout-page'>
        <button type='button' onClick={() => navigate(`/`)} className='button-back'>
          <FaArrowLeft size={25} />
        </button>

        <h2 className='main-title'>{workout && workout.title}</h2>

        <div className='exercises'>
          {exercises.length > 0 ? (
            exercises.map((exercise) => <ExerciseComponent key={exercise._id} exercise={exercise} workoutId={workoutId} />)
          ) : (
            <p className='no-exercises'>No exercises found for this workout</p>
          )}
        </div>

        <div className='button-container'>
          <button className='secondary-button' onClick={() => navigate(`/${workoutId}/exercises/create-exercise`)}>
            Create New Exercise
          </button>
        </div>
      </div>
  )
}
export default WorkoutPage
