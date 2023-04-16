import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import { useExercisesContext } from '../hooks/useExercisesContext'
import { useAuthContext } from "../hooks/useAuthContext"
import { useParams } from 'react-router-dom'
import { FaArrowLeft } from "react-icons/fa"

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
    imageStartLink: '',
    imageStartFile: '',
    imageEndLink: '',
    imageEndFile: '',
    explanation: '',
    video: '',  
    })
  
  const [error, setError] = useState('')
  const [emptyFields, setEmptyFields] = useState([])

  const handleInputChange = (e) => {
    const { name, value, files } = e.target
    
    if (files) {
    setOptions({
      ...options,
      [name]: files[0],
    })
    } else {
      setOptions({
        ...options,
        [name]: value,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      setError('You must be logged in')
      return
    }

    const { title, load, reps, time, imageStartLink, imageStartFile, imageEndLink, imageEndFile, explanation, video } = options

    // const exercise = { title, load, reps, time, imageStart, imageEnd, explanation, video, workoutId }

    const formData = new FormData()
    formData.append("title", title)
    formData.append("load", load)
    formData.append("reps", reps)
    formData.append("time", time)
    formData.append("explanation", explanation)
    formData.append("video", video)
    formData.append("workoutId", workoutId)
    formData.append("imageStartLink", imageStartLink)
    if (imageStartFile) {
      formData.append('imageStartFile', imageStartFile)
    }
    formData.append("imageEndLink", imageEndLink)
    if (imageEndFile) {
      formData.append('imageEndFile', imageEndFile)
    }

    const res = await fetch(`http://localhost:3000/${workoutId}/exercises`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
      setEmptyFields(data.emptyFields || [])
    }
    if (res.ok) {
      setError('')
      setOptions({
        title: '',
        load: '',
        reps: '',
        time: '',
        imageStartLink: '',
        imageStartFile: '',
        imageEndLink: '',
        imageEndFile: '',
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
    <div className='form-container'>
      <div className='card'>
        <button type='button' onClick={() => navigate(`/${workoutId}/exercises`)} className='button-back'>
          <FaArrowLeft size={25} />
        </button>

        <form className='form-section' onSubmit={handleSubmit}>
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
                <label>Initial body position (Image URL)</label>
                <input
                  type='text'
                  name='imageStartLink'
                  value={options.imageStartLink}
                  onChange={handleInputChange}
                  className={emptyFields.includes('imageStartLink') ? 'error' : ''}
                />
              </div>

              <div>
                <label>Initial body position (Upload Image):</label>
                <input
                  type='file'
                  name='imageStartFile'
                  onChange={handleInputChange}
                  className={emptyFields.includes('imageStartFile') ? 'error' : ''}
                />
              </div>

              <div>
                <label>Final body position (Image URL)</label>
                <input
                  type='text'
                  name='imageEndLink'
                  value={options.imageEndLink}
                  onChange={handleInputChange}
                  className={emptyFields.includes('imageEndLink') ? 'error' : ''}
                />
              </div>

              <div>
                <label>Final body position (Upload Image):</label>
                <input
                  type='file'
                  name='imageEndFile'
                  onChange={handleInputChange}
                  className={emptyFields.includes('imageEndFile') ? 'error' : ''}
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
            Add Exercise
          </button>
          {error && <div className='error'>{error}</div>}
        </form>
      </div>
    </div>
  )
}
export default ExerciseForm
