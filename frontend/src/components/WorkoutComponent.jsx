import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { FaTrashAlt, FaEdit } from 'react-icons/fa'
import { useAuthContext } from '../hooks/useAuthContext'
import { format, formatDistanceToNow } from 'date-fns'
import { useNavigate } from 'react-router-dom'

const WorkoutComponent = ({ workout }) => {
  const { _id: workoutId } = workout
  const { dispatch } = useWorkoutsContext()
  const { user } = useAuthContext()
  const navigate = useNavigate()

  const handleClickDelete = async () => {
    if (!user) {
      return
    }
  const deleteExercisesRes = await fetch(`http://localhost:3000/${workoutId}/exercises`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  })
  if (!deleteExercisesRes.ok) {
    console.log('Exercises relative to this workout could not be deleted')
  }
  const deletedExercises = await deleteExercisesRes.json()
  dispatch({ type: 'DELETE_EXERCISES', payload: deletedExercises })

  const deleteWorkoutRes = await fetch(`http://localhost:3000/${workoutId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })

    if (!deleteWorkoutRes.ok) {
      console.log('Workout could not be deleted')
    }

    const deletedWorkout = await deleteWorkoutRes.json();
    dispatch({ type: 'DELETE_WORKOUT', payload: deletedWorkout })
}

    const handleClickEdit = async () => {
      navigate(`/${workoutId}/edit`)
    }

  const formattedStartDate = format(new Date(workout.startDate), 'dd-MM-yyyy')
  const formattedEndDate = format(new Date(workout.endDate), 'dd-MM-yyyy')

  return (
    <div className='workout-details'>
      <h4>{workout.title}</h4>
      <p>
        <strong>Starting Date:</strong> {formattedStartDate}
      </p>
      <p>
        <strong>Ending Date:</strong> {formattedEndDate}
      </p>
      <p>
        <strong>Frequency:</strong> {workout.frequency}
      </p>
      <p>
        <strong>Type:</strong> {workout.type}
      </p>

      <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>

      <span className='trash-icon' onClick={handleClickDelete}>
        <FaTrashAlt />
      </span>
      <span className='edit-icon'>
        <FaEdit onClick={handleClickEdit} />
      </span>

      <div className='navbtn-container'>
        <button className='navbtn' onClick={() => navigate(`/workoutpage/${workoutId}/exercises`)}>
          See workout
        </button>
      </div>
    </div>
  )
}
export default WorkoutComponent
