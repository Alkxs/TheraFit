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
  const [loading, setLoading] = useState(false)
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
    setLoading(true)

    if (!user) {
      setError('You must be logged in')
      setLoading(false)
      return
    }

    if (options.imageStartLink && options.imageStartFile) {
      setError('Please choose between pasting an image URL or uploading an image for the initial body position.')
      setLoading(false)
      return
    }

    if (options.imageEndLink && options.imageEndFile) {
      setError('Please choose between pasting an image URL or uploading an image for the final body position.')
      setLoading(false)
      return
    }

    const { title, load, reps, time, imageStartLink, imageStartFile, imageEndLink, imageEndFile, explanation, video } = options


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
      setLoading(false)
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
    <>
      <button type='button' onClick={() => navigate(`/${workoutId}/exercises`)} className='button-small'>
        <FaArrowLeft size={25} />
        <span className='small-text'> Back to Exercises</span>
      </button>

      <div className='form-container'>
        {loading && (
          <div className='loader-container'>
            <div className='loader'></div>
            <p className='loader-text'>Creating exercise, please wait...</p>
          </div>
        )}

        <div className='card'>
          <form className='form-section' onSubmit={handleSubmit}>
            <h1>Add a New Exercise</h1>
            <div className='main-section'>
              <div className='choices'>
                <h3>General Information</h3>
                <div>
                  <label>Title</label>
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

                <h3>Images</h3>
                <div className='input-container'>
                  <label>Initial body position</label>
                  <div className='input-group'>
                    <input
                      type='text'
                      name='imageStartLink'
                      value={options.imageStartLink}
                      onChange={handleInputChange}
                      className={emptyFields.includes('imageStartLink') ? 'error' : ''}
                      placeholder='Insert image URL or choose a file to upload'
                    />
                    <span>or</span>
                    <input type='file' name='imageStartFile' onChange={handleInputChange} className={emptyFields.includes('imageStartFile') ? 'error' : ''} />
                  </div>
                </div>

                <div className='input-container'>
                  <label>Final body position</label>
                  <div className='input-group'>
                    <input
                      type='text'
                      name='imageEndLink'
                      value={options.imageEndLink}
                      onChange={handleInputChange}
                      className={emptyFields.includes('imageEndLink') ? 'error' : ''}
                      placeholder='Insert image URL or choose a file to upload'
                    />
                    <span>or</span>
                    <input type='file' name='imageEndFile' onChange={handleInputChange} className={emptyFields.includes('imageEndFile') ? 'error' : ''} />
                  </div>
                </div>

                <h3>Exercise Explanation</h3>
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

                <h3>Exercise Video</h3>
                <div>
                  <label>Exercise Video</label>
                  <input type='text' name='video' value={options.video} onChange={handleInputChange} className={emptyFields.includes('video') ? 'error' : ''} placeholder='Insert video URL here' />
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
    </>
  )
}
export default ExerciseForm
