import { useExercisesContext } from '../hooks/useExercisesContext'
import { FaTrashAlt, FaEdit } from 'react-icons/fa'
import { useAuthContext } from '../hooks/useAuthContext'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { useNavigate } from 'react-router-dom'

const exerciseComponent = ({ exercise, workoutId }) => {
  const { _id: exerciseId } = exercise
  const { dispatch } = useExercisesContext()
  const { user } = useAuthContext()
  const navigate = useNavigate()

  const handleDelete = async () => {
    if (!user) {
      return
    }
    const res = await fetch(`http://localhost:3000/${workoutId}/exercises/${exerciseId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
    const data = await res.json()

    if (res.ok) {
      dispatch({ type: 'DELETE_EXERCISE', payload: data })
    }
  }

  const handleEdit = async () => {
    navigate(`/${workoutId}/exercises/${exerciseId}/edit`)
  }

  return (
    <div className='workout-card'>
      <div className='workout-details'>
        <h4>{exercise.title}</h4>
        <p>
          <strong>Load (kg): </strong> {exercise.load}
        </p>
        <p>
          <strong>Reps: </strong> {exercise.reps}
        </p>
        <p>
          <strong>Time </strong> {exercise.time}
        </p>

        <p>{formatDistanceToNow(new Date(exercise.createdAt), { addSuffix: true })}</p>

        <span className='workout-icon trash' onClick={handleDelete}>
          <FaTrashAlt />
        </span>

        <span className='workout-icon edit'>
          <FaEdit onClick={handleEdit}/>
        </span>

        <button onClick={() => navigate(`/${workoutId}/exercises/${exerciseId}/show-details`)}>Show Details</button>
      </div>
    </div>
  )
}
export default exerciseComponent


