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
    <div className='exercise-card'>
      <div className='exercise-header'>
        <div className='exercise-number'>
          <h2>1</h2>
        </div>

        <div className='exercise-title'>
          <h4>{exercise.title}</h4>
        </div>

        <span className='exercise-icon exercise-trash' onClick={handleDelete}>
          <FaTrashAlt size={20} />
        </span>
      </div>

      <div className='exercise-info'>
        <div className='exercise-info-labels'>
          <p>
            <strong>Load (kg): </strong>
          </p>
          <p>
            <strong>Reps: </strong>
          </p>
          <p>
            <strong>Time </strong>
          </p>
        </div>

        <div className='exercise-info-values'>
          <p>{exercise.load}</p>
          <p>{exercise.reps}</p>
          <p>{exercise.time}</p>
        </div>
      </div>

      <div className='exercise-btn-container'>
        <div></div>
        <button className='primary-button' onClick={() => navigate(`/${workoutId}/exercises/${exerciseId}/show-details`)}>
          Show Details
        </button>

        <span className='exercise-icon exercise-edit'>
          <FaEdit size={20} onClick={handleEdit} />
        </span>
      </div>
    </div>
  )
  // <div className='exercise-container'>
  //   <div className='exercise-item'>
  //     <div className='exercise-info'>
  //       <h4 className='exercise-title'>{exercise.title}</h4>
  //       <p className='exercise-description'>
  //         Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis, asperiores non. Quas molestias sit aliquid facere, a, dignissimos molestiae doloremque
  //         voluptas ab, placeat eius officiis magnam id consequatur! Quo, quae.*2
  //       </p>
  //     </div>
  //     <div className='exercise-details'>
  //       <div className='exercise-detail'>
  //         <strong>Sets:</strong> {exercise.sets}
  //       </div>
  //       <div className='exercise-detail'>
  //         <strong>Reps:</strong> {exercise.reps}
  //       </div>
  //       <div className='exercise-detail'>
  //         <strong>Rest:</strong> {exercise.rest} seconds
  //       </div>
  //     </div>
  //   </div>
  // </div> 
}
export default exerciseComponent


