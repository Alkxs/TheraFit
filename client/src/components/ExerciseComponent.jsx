import { useExercisesContext } from '../hooks/useExercisesContext'
import { FaTrashAlt, FaEdit, FaGripVertical } from 'react-icons/fa'
import { useAuthContext } from '../hooks/useAuthContext'
import { useContext } from 'react'
import DemoUserContext from '../context/DemoUserContext'
import { useNavigate } from 'react-router-dom'
import { useDrag, useDrop } from 'react-dnd'

const itemTypes = {
  EXERCISE: 'exercise',
}

const exerciseComponent = ({ exercise, workoutId, index, moveExercise}) => {
  const { _id: exerciseId } = exercise
  const { dispatch } = useExercisesContext()
  const { user } = useAuthContext()
  const navigate = useNavigate()
  const { isDemoUser, setIsDemoUser } = useContext(DemoUserContext)

  const handleDelete = async () => {
    if (!user) {
      return
    }

    const shouldDelete = window.confirm('Are you sure you want to delete this exercise?')

    if (!shouldDelete) {
      return
    }

    const res = await fetch(`https://therafit.onrender.com/${workoutId}/exercises/${exerciseId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
    const data = await res.json()

    if (res.ok) {
      dispatch({ type: 'DELETE_EXERCISE', payload: data })
    }  else {

    console.error("Failed to delete exercise:", data.error);
  }
  }

  const handleEdit = async () => {
    navigate(`/${workoutId}/exercises/${exerciseId}/edit`)
  }

  const [, dragRef] = useDrag({
    type: itemTypes.EXERCISE,
    item: { id: exercise._id, index },
  })

  const [, dropRef] = useDrop({
    accept: itemTypes.EXERCISE,
    hover(item, monitor) {
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      moveExercise(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  const ref = (node) => {
    dragRef(node)
    dropRef(node)
  }

  return (
    <div className='exercise-card' ref={ref}>
      <div className='exercise-header'>
        <div className='exercise-number'>
          <h2>{index + 1}</h2>
        </div>

        <div className='exercise-title'>
          <h4>{exercise.title}</h4>
        </div>

        <span
          className='exercise-icon exercise-trash'
          onClick={
            !isDemoUser
              ? handleDelete
              : () =>
                  alert(
                    'Demo mode active: The current features are not available for use. To access full functionality, please create a new account and log in.'
                  )
          }
        >
          <FaTrashAlt size={20} />
        </span>
      </div>

      {(exercise.sets || exercise.reps || exercise.load || exercise.time) && (
        <div className='exercise-info'>
          <div className='exercise-info-labels'>
            {exercise.sets && (
              <div className='exercise-label'>
                <p>
                  <strong>Sets: </strong>
                </p>
              </div>
            )}
            {exercise.reps && (
              <div className='exercise-label'>
                <p>
                  <strong>Reps: </strong>
                </p>
              </div>
            )}
            {exercise.load && (
              <div className='exercise-label'>
                <p>
                  <strong>Load: </strong>
                </p>
              </div>
            )}
            {exercise.time && (
              <div className='exercise-label'>
                <p className='exercise-label-time'>
                  <strong>Time: </strong>
                </p>
              </div>
            )}
          </div>

          <div className='exercise-info-values'>
            {exercise.sets && (
              <div className='exercise-value'>
                <p>{exercise.sets}</p>
              </div>
            )}
            {exercise.reps && (
              <div className='exercise-value'>
                <p>{exercise.reps}</p>
              </div>
            )}
            {exercise.load && (
              <div className='exercise-value '>
                <p>
                  {exercise.load} <span>kg</span>
                </p>
              </div>
            )}
            {exercise.time && (
              <div className='exercise-value'>
                <p>
                  {exercise.time} <span>{exercise.timeUnit}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className='exercise-btn-container'>
        <span className='exercise-icon exercise-grip'>
          <FaGripVertical size={20} />
        </span>

        <button className='primary-button' onClick={() => navigate(`/${workoutId}/exercises/${exerciseId}/show-details`)}>
          Show Details
        </button>

        <span className='exercise-icon exercise-edit'>
          <FaEdit
            size={20}
            onClick={
              !isDemoUser
                ? handleEdit
                : () =>
                    alert(
                      'Demo mode active: The current features are not available for use. To access full functionality, please create a new account and log in.'
                    )
            }
          />
        </span>
      </div>
    </div>
  )
}
export default exerciseComponent


