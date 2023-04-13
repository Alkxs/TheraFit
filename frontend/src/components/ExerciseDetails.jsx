import { useParams } from "react-router-dom"
import { useExercisesContext } from '../hooks/useExercisesContext'
import { useNavigate } from "react-router-dom"

const ExerciseDetails = () => {
  const { workoutid } = useParams()
  const { exercises } = useExercisesContext()
  const navigate = useNavigate()

  return (
    <div className='container'>
      <h4>{exercises.title}</h4>
      <p>
        <strong>Load (kg): </strong> {exercises.load}
      </p>
      <p>
        <strong>Reps: </strong> {exercises.reps}
      </p>
      <p>
        <strong>Time </strong> {exercises.time}
      </p>

      <div className='img-container'>
        <img className='imageStart' src={exercises.imageStart} alt='image start' />
      </div>

      <div className='img-container'>
        <img className='imageEnd' src={exercises.imageEnd} alt='imageEnd' />
      </div>

      <p className='explanation'>{exercises.explanation}</p>

      <div className='video'>{exercises.video}</div>

      <button type='button' onClick={() => navigate(`/${workoutid}/exercises`)}>
        Back
      </button>
    </div>
  )
}
export default ExerciseDetails


// title, load, reps, time, imageStart, imageEnd, explanation, video 