import { useParams } from "react-router-dom"
import { useExercisesContext } from '../hooks/useExercisesContext'
import { useNavigate } from "react-router-dom"
import { FaArrowLeft } from "react-icons/fa"

const ExerciseDetails = () => {
  const { workoutId, exerciseId } = useParams()
  const { exercises } = useExercisesContext()
  const navigate = useNavigate()

  const exercise = exercises.find((e) => e._id === exerciseId)

    if (!exercise) {
      return <div>Exercise not found</div>
    }

  return (
    <div className='exercise-details-container'>
      <button type='button' onClick={() => navigate(`/${workoutId}/exercises`)} className='button-back'>
        <FaArrowLeft size={25} />
      </button>

      <div className='exercise-details-card'>
        <div className='workout-title'>
          <h4>{exercise.title}</h4>
        </div>

        {exercise.imageStart && (<div className='imgs-container'>
          <div className='img-container'>
            <img className='imageStart' src={exercise.imageStart} alt='image start' />
          </div>

          <div className='img-container'>
            <img className='imageEnd' src={exercise.imageEnd} alt='imageEnd' />
          </div>
        </div>
        )}

        <div className='explanation-container'>
          <p className='explanation'>{exercise.explanation}</p>
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

        {exercise.video && (<div className='video-container'>
          <div className='video'>{exercise.video}</div>
        </div>
        )}
        
      </div>
    </div>
  )
}
export default ExerciseDetails
