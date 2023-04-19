import { useParams } from "react-router-dom"
import { useExercisesContext } from '../hooks/useExercisesContext'
import { useNavigate } from "react-router-dom"
import { FaArrowLeft } from "react-icons/fa"
import ReactPlayer from 'react-player'

const ExerciseDetails = () => {
  const { workoutId, exerciseId } = useParams()
  const { exercises } = useExercisesContext()
  const navigate = useNavigate()

  const exercise = exercises.find((e) => e._id === exerciseId)

    if (!exercise) {
      return <div>Exercise not found</div>
    }

  return (
    <>
      <button type='button' onClick={() => navigate(`/${workoutId}/exercises`)} className='button-small'>
        <FaArrowLeft size={25} />
        <span className='small-text'> Back to Exercises</span>
      </button>

      <div className='exercise-details-container'>
        <div className='exercise-details-card'>
          <div className='exercise-details-title'>
            <h4>{exercise.title}</h4>
          </div>

          {(exercise.imageStartFile || exercise.imageEndFile) && (
            <div className='imgs-container'>
              <div className='img-container'>
                <img className='exercise-image' src={exercise.imageStartFile} alt='image start' />
              </div>

              <div className='img-container'>
                <img className='exercise-image' src={exercise.imageEndFile} alt='imageEnd' />
              </div>
            </div>
          )}

          {exercise.description && (
            <div className='description-container'>
              <p className='description'>{exercise.description}</p>
            </div>
          )}

          <div className='exercise-details-info'>
            <div className='exercise-details-info-labels'>
              {exercise.sets && (
                <div className='p-label'>
                  <p>
                    <strong>Sets </strong>
                  </p>
                </div>
              )}
              {exercise.reps && (
                <div className='p-label'>
                  <p>
                    <strong>Reps </strong>
                  </p>
                </div>
              )}
              {exercise.load && (
                <div className='p-label'>
                  <p>
                    <strong>
                      Load <span className='small-text'>(kg)</span>{' '}
                    </strong>
                  </p>
                </div>
              )}
              {exercise.time && (
                <div className='p-label'>
                  <p>
                    <strong>Time </strong>
                  </p>
                </div>
              )}
            </div>

            <div className='exercise-details-info-values'>
              <div className='p-value'>
                <p>{exercise.sets}</p>
              </div>
              <div className='p-value'>
                <p>{exercise.reps}</p>
              </div>
              <div className='p-value'>
                <p>{exercise.load}</p>
              </div>
              <div className='p-value'>
                <p>
                  {exercise.time} {exercise.timeUnit}
                </p>
              </div>
            </div>
          </div>

          {exercise.video && (
            <div className='video-container'>
              <ReactPlayer
                className='video'
                url={exercise.video}
                width='100%'
                height='100%'
                controls
                config={{
                  youtube: {
                    playerVars: { showinfo: 1 },
                  },
                  vimeo: {
                    playerOptions: { controls: 1 },
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
export default ExerciseDetails
