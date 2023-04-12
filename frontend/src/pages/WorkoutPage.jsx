// Hooks
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
// Custom Hooks
import { useExercisesContext } from '../hooks/useExercisesContext'
import { useAuthContext } from '../hooks/useAuthContext'
//components
import ExerciseComponent from '../components/ExerciseComponent'

const WorkoutPage = () => {
  const { workoutId } = useParams()
  const { exercises, dispatch } = useExercisesContext()
  const { user } = useAuthContext()
  const navigate = useNavigate()

  useEffect(() => {
   
    const fetchExercises = async () => {

      const res = await fetch(`http://localhost:3000/${workoutId}/exercises`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      const data = await res.json()
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
    <div className='home'>
      <div className='main'>
        <button type='button' onClick={() => navigate(`/`)}>
          Back
        </button>
        <div className='workouts'>
          {exercises ? (
            exercises.map((exercise) => <ExerciseComponent key={exercise._id} exercise={exercise} workoutId={workoutId} />)
          ) : (
            <p>No exercises yet for this workout</p>
          )}
        </div>
        <button className='create-exercise' onClick={() => navigate(`/${workoutId}create-exercise`)}>
          Create New Exercise
        </button>
      </div>
    </div>
  )
}
export default WorkoutPage
