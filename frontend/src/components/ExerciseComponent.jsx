import { useExercisesContext } from '../hooks/useExercisesContext'
import { FaTrashAlt, FaEdit, FaGripVertical } from 'react-icons/fa'
import { useAuthContext } from '../hooks/useAuthContext'
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

  const handleDelete = async () => {
    if (!user) {
      return
    }

    const shouldDelete = window.confirm('Are you sure you want to delete this exercise?')

    if (!shouldDelete) {
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
        
        <span className='exercise-icon exercise-grip'>
          <FaGripVertical size={20} />
        </span>

        <button className='primary-button' onClick={() => navigate(`/${workoutId}/exercises/${exerciseId}/show-details`)}>
          Show Details
        </button>

        <span className='exercise-icon exercise-edit'>
          <FaEdit size={20} onClick={handleEdit} />
        </span>
      </div>
    </div>
  )
}
export default exerciseComponent


