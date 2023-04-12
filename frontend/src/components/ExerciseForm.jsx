import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import { useExercisesContext } from '../hooks/useExercisesContext'
import { useAuthContext } from "../hooks/useAuthContext"
import { useParams } from 'react-router-dom'

const ExerciseForm = () => {
  const { workoutId } = useParams()
  const { dispatch } = useExercisesContext()
  const { user } = useAuthContext()
  const navigate = useNavigate()

  const [options, setOptions] = useState({
    title: '',
    load: '',
    reps: '',
    time: '',
    imageStart: '',
    imageEnd: '',
    explanation: '',
    video: '',  
    })
  
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setOptions({
      ...options,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      setError('You must be logged in')
      return
    }

    const { title, load, reps, time, imageStart, imageEnd, explanation, video } = options

    const exercise = { title, load, reps, time, imageStart, imageEnd, explanation, video, workoutId }

    const res = await fetch(`http://localhost:3000/${workoutId}/exercises`, {
      method: 'POST',
      body: JSON.stringify(exercise),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
      setEmptyFields(data.emptyFields || [])
    }
    if (res.ok) {
      setError(null)
      setOptions({
        title: '',
        load: '',
        reps: '',
        time: '',
        imageStart: '',
        imageEnd: '',
        explanation: '',
        video: '',
      })
      setEmptyFields([])
      console.log('new exercise added:', data)
      dispatch({ type: 'CREATE_EXERCISE', payload: data })

      navigate(`/${workoutId}/exercises`)
    }
  }

  return (
    <div className='container'>
      <button type='button' onClick={() => navigate(`/${workoutId}/exercises`)}>
        Back
      </button>
      <form className='create' onSubmit={handleSubmit}>
        <h1>Add a New Exercise</h1>
        <div className='main-section'>
          <div className='choices'>

            <div>
              <label>Title:</label>
              <input type='text' name='title' value={options.title} onChange={handleInputChange} className={emptyFields.includes('title') ? 'error' : ''} />
            </div>
            
            <div>
            <label>Exercise Load</label>
              <input type='number' name='load' value={options.load} onChange={handleInputChange} className={emptyFields.includes('load') ? 'error' : ''} />
            </div>
            
            <div>
            <label>Exercise Reps</label>
              <input type='number' name='reps' value={options.reps} onChange={handleInputChange} className={emptyFields.includes('reps') ? 'error' : ''} />
            </div>
           
            <div>
            <label>Exercise Time</label>
              <input type='number' name='time' value={options.time} onChange={handleInputChange} className={emptyFields.includes('time') ? 'error' : ''} />
            </div>

            <div>
            <label>Initial body position</label>
              <input type='text' name='imageStart' value={options.imageStart} onChange={handleInputChange} className={emptyFields.includes('imageStart') ? 'error' : ''} />
            </div>

            <div>
            <label>Final body position</label>
              <input type='text' name='imageEnd' value={options.imageEnd} onChange={handleInputChange} className={emptyFields.includes('imageEnd') ? 'error' : ''} />
            </div>

            <div>
            <label>Exercise explanation</label>
              <input type='text' name='explanation' value={options.explanation} onChange={handleInputChange} className={emptyFields.includes('explanation') ? 'error' : ''} />
            </div>

            <div>
            <label>Exercise Video</label>
              <input type='text' name='video' value={options.video} onChange={handleInputChange} className={emptyFields.includes('video') ? 'error' : ''} />
            </div>

          </div>
        </div>
       
        <button type="submit">Add Exercise</button>
        {error && <div className='error'>{error}</div>}
      </form>
    </div>
  )
}
export default ExerciseForm
