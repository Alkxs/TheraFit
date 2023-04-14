import { useState, useEffect } from 'react'
import { useExercisesContext } from '../hooks/useExercisesContext'
import { useAuthContext } from '../hooks/useAuthContext'
import { useNavigate, useParams } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'

const EditExerciseForm = () => {

  const { workoutId, exerciseId } = useParams()
  const { exercises, dispatch } = useExercisesContext()
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

  const [error, setError] = useState('')
  const [emptyFields, setEmptyFields] = useState([])

  useEffect(() => {
    const exercise = exercises.find((exercise) => exercise._id === exerciseId)

    if (exercise) {
      setOptions(exercise)
    } else {
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
    }
  }, [exerciseId, exercises])

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

    // handle form submission here
    const { title, load, reps, time, imageStart, imageEnd, explanation, video } = options

    const exercise = { title, load, reps, time, imageStart, imageEnd, explanation, video }

    const res = await fetch(`http://localhost:3000/${workoutId}/exercises/${exerciseId}/edit`, {
      method: 'PATCH',
      body: JSON.stringify(exercise),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
      setEmptyFields(data.emptyFields || [])
    }
    if (res.ok) {
      setError('')
      setEmptyFields([])
      console.log('exercise updated:', data)
      dispatch({ type: 'EDIT_EXERCISE', payload: data })

      navigate(`/${workoutId}/exercises/`)
    }
  }

  return (
    <div className='form-container'>
      <div className='card'>
      <button type='button' onClick={() => navigate(`/${workoutId}/exercises`)} className='button-back'>
        <FaArrowLeft size={25} />
      </button>

      <form className='form-section' onSubmit={handleSubmit}>
        <h1>Edit Exercise</h1>
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
              <input
                type='text'
                name='imageStart'
                value={options.imageStart}
                onChange={handleInputChange}
                className={emptyFields.includes('imageStart') ? 'error' : ''}
              />
            </div>

            <div>
              <label>Final body position</label>
              <input
                type='text'
                name='imageEnd'
                value={options.imageEnd}
                onChange={handleInputChange}
                className={emptyFields.includes('imageEnd') ? 'error' : ''}
              />
            </div>

            <div>
              <label>Exercise explanation</label>
              <input
                type='text'
                name='explanation'
                value={options.explanation}
                onChange={handleInputChange}
                className={emptyFields.includes('explanation') ? 'error' : ''}
              />
            </div>

            <div>
              <label>Exercise Video</label>
              <input type='text' name='video' value={options.video} onChange={handleInputChange} className={emptyFields.includes('video') ? 'error' : ''} />
            </div>
          </div>
        </div>

        <button type='submit' className='primary-button'>
          Edit Exercise
          </button>
        {error && <div className='error'>{error}</div>}
      </form>
    </div>
    </div>
  )
}
export default EditExerciseForm