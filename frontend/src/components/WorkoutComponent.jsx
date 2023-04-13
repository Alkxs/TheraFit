import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { FaTrashAlt, FaEdit } from 'react-icons/fa'
import { useAuthContext } from '../hooks/useAuthContext'
import { format, formatDistanceToNow } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { workoutImage } from '../data/data'

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

  const workoutImg = workoutImage[workout.type]

  return (
    <div className='workout-card'>
      <div className='workout-img'>
        <img src={workoutImg} alt={workout.title} onClick={()=>console.log(workoutId)}/>
      </div>

      <div className='workout-details'>
        <div className='workout-title'>
          <h4>{workout.title}</h4>
        </div>

        <div className='workout-info'>
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

          <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}
          </p>
        </div>

        <div className='workout-btn-container'>
          <button className='workout-btn' onClick={() => navigate(`/workoutpage/${workoutId}/exercises`)}>
            See workout
          </button>
        </div>

        <div className='workout-icons'>
          <span className='workout-icon' onClick={handleClickDelete}>
            <FaTrashAlt />
          </span>
          <span className='workout-icon'>
            <FaEdit onClick={handleClickEdit} />
          </span>
        </div>
      </div>
    </div>
  )
}
export default WorkoutComponent
