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
                <h5 className='imgs-title'>Initial Body Position</h5>
                <img className='exercise-image' src={exercise.imageStartFile} alt='image start' />
              </div>

              <div className='img-container'>
                <h5 className='imgs-title'>Final Body Position</h5>
                <img className='exercise-image' src={exercise.imageEndFile} alt='imageEnd' />
              </div>
            </div>
          )}

          {exercise.description && (
            <div className='description-container'>
              <h5 className='description-title'>Description</h5>
              <pre className='description'>{exercise.description}</pre>
            </div>
          )}

          {(exercise.sets || exercise.reps || exercise.load || exercise.time) && (
            <div className='exercise-details-info'>
              <h5 className='exercise-details-info-title'>Exercise Parameters</h5>
              <div className='parameters-container'>
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
                        <strong>Load</strong>
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
                  {exercise.sets && (
                    <div className='p-value'>
                      <p>{exercise.sets}</p>
                    </div>
                  )}
                  {exercise.reps && (
                    <div className='p-value'>
                      <p>{exercise.reps}</p>
                    </div>
                  )}
                  {exercise.load && (
                    <div className='p-value'>
                      <p>
                        {exercise.load} <span className='load-unit'>kg</span>
                      </p>
                    </div>
                  )}
                  {exercise.time && (
                    <div className='p-value time-value'>
                      <p>
                        {exercise.time}
                        <span className='time-unit'>{exercise.timeUnit}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {exercise.video && (
            <div className='video-container'>
              <h5 className="video-title">Video</h5>
              <div className='video-wrapper'>
              <ReactPlayer
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
            </div>
          )}
        </div>
      </div>
    </>
  )
}
export default ExerciseDetails
