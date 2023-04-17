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
      
    const shouldDelete = window.confirm('Are you sure you want to delete this workout?')

      if (!shouldDelete) {
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
          <img src={workoutImg} alt={workout.title} onClick={() => console.log(workoutId)} />
        </div>

        <div className='workout-details'>
          <div className='workout-title'>
            <h4>{workout.title}</h4>
          </div>

          <div className='workout-info'>
            <div className='workout-info-labels'>
              {workout.startDate && (
                <p>
                  <strong>Start Date:</strong>
                </p>
              )}
              {workout.endDate && (
                <p>
                  <strong>End Date:</strong>
                </p>
              )}
              {workout.frequency !== null && (
                <p>
                  <strong>Frequency:</strong>
                </p>
              )}
              <p>
                <strong>Type:</strong>
              </p>
              <p>
                <strong>Created at:</strong>
              </p>
            </div>

            <div className='workout-info-values'>
              {workout.startDate && <p>{formattedStartDate}</p>}
              {workout.endDate && <p>{formattedEndDate}</p>}
              {workout.frequency !== null && <p>{`${workout.frequency} days per week`}</p>}
              <p>{workout.type}</p>
              <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>
            </div>
          </div>

          <div className='workout-btn-container'>
            <span className='workout-icon trash' onClick={handleClickDelete}>
              <FaTrashAlt size={20} />
            </span>

            <button className='primary-button' onClick={() => navigate(`/${workoutId}/exercises`)}>
              See workout
            </button>

            <span className='workout-icon edit'>
              <FaEdit onClick={handleClickEdit} size={20} />
            </span>
          </div>
        </div>
      </div>
    )
}
export default WorkoutComponent
