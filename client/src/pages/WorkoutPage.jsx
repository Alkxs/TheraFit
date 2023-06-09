
import { useEffect, useContext } from 'react'
import DemoUserContext from '../context/DemoUserContext'
import { useNavigate, useParams } from 'react-router-dom'
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useExercisesContext } from '../hooks/useExercisesContext'
import { useAuthContext } from '../hooks/useAuthContext'
import ExerciseComponent from '../components/ExerciseComponent'
import { FaArrowLeft } from 'react-icons/fa'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { apiUrl } from '../api.js'

const WorkoutPage = () => {
  const { workoutId } = useParams()
  const { workouts } = useWorkoutsContext()
  const { exercises, dispatch } = useExercisesContext()
  const { user } = useAuthContext()
  const navigate = useNavigate()
  const { isDemoUser, setIsDemoUser } = useContext(DemoUserContext)

  const workout = workouts.find((w) => w._id === workoutId)

  useEffect(() => {
   
    const fetchExercises = async () => {

      const res = await fetch(`${apiUrl}/${workoutId}/exercises`, {
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

  const moveExercise = (dragIndex, hoverIndex) => {
    const dragExercise = exercises[dragIndex]
    const updatedExercises = [...exercises]
    updatedExercises.splice(dragIndex, 1)
    updatedExercises.splice(hoverIndex, 0, dragExercise)

    dispatch({ type: 'SET_EXERCISES', payload: updatedExercises })
  }

  return (
    <>
      <button type='button' onClick={() => navigate(`/`)} className='button-small'>
        <FaArrowLeft size={25} />
        <span className='small-text'> Back to Workouts</span>
      </button>

      <div className='workout-page'>
        <h2 className='main-title'>{workout && workout.title}</h2>

        {exercises.length > 0 ? (
          <DndProvider backend={HTML5Backend}>
            <div className='exercises-container'>
              <p className='drag-instructions'>Rearrange exercises by clicking and dragging them</p>
              <div className='exercises'>
                {exercises.map((exercise, index) => (
                  <ExerciseComponent key={exercise._id} exercise={exercise} workoutId={workoutId} index={index} moveExercise={moveExercise} />
                ))}
              </div>
            </div>
          </DndProvider>
        ) : (
          <p className='no-exercises'>No exercises found for this workout</p>
        )}

        <div className='button-container'>
          <button
            className='secondary-button'
            onClick={
              !isDemoUser
                ? () => navigate(`/${workoutId}/exercises/create-exercise`)
                : () =>
                    alert(
                      'Demo mode active: The current features are not available for use. To access full functionality, please create a new account and log in.'
                    )
            }
          >
            Create New Exercise
          </button>
        </div>
      </div>
    </>
  )
}
export default WorkoutPage
