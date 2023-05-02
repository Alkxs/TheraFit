import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import { useExercisesContext } from '../hooks/useExercisesContext'
import { useAuthContext } from "../hooks/useAuthContext"
import { useParams } from 'react-router-dom'
import { FaArrowLeft } from "react-icons/fa"
import { apiUrl } from '../api.js'

const ExerciseForm = () => {
  const { workoutId } = useParams()
  const { dispatch } = useExercisesContext()
  const { user } = useAuthContext()
  const navigate = useNavigate()

  const [options, setOptions] = useState({
    title: '',
    sets: '',
    reps: '',
    load: '',
    time: '',
    timeUnit: '',
    imageStartLink: '',
    imageStartFile: '',
    imageEndLink: '',
    imageEndFile: '',
    description: '',
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

    const isValidURL = (url) => {
      try {
        new URL(url)
        return true
      } catch (e) {
        return false
      }
    }

    const { title, sets, reps, load, time, timeUnit, imageStartLink, imageStartFile, imageEndLink, imageEndFile, description, video } = options

    if (video && !isValidURL(video)) {
      setError('Please provide a valid video URL')
      setLoading(false)
      return
    }

    const formData = new FormData()
    formData.append("title", title)
    if (sets) {formData.append('sets', sets)}
    if (reps) {formData.append('reps', reps)}
    if (load) {formData.append('load', load)}
    if (time) {formData.append('time', time)}
    if (timeUnit) {formData.append('timeUnit', timeUnit)}
    formData.append("description", description)
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
    

    try {
      const res = await fetch(`${apiUrl}/${workoutId}/exercises`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
  
    const data = await res.json()
    if (!res.ok) {
      setLoading(false)
      setError(data.error)
      setEmptyFields(data.emptyFields || [])
    }
    if (res.ok) {
      setLoading(false)
      setError('')
      setOptions({
        title: '',
        sets: '',
        reps: '',
        load: '',
        time: '',
        timeUnit: '',
        imageStartLink: '',
        imageStartFile: '',
        imageEndLink: '',
        imageEndFile: '',
        description: '',
        video: '',
      })
      setEmptyFields([])
      console.log('new exercise added:', data)
      dispatch({ type: 'CREATE_EXERCISE', payload: {...data, timeUnit} })

      navigate(`/${workoutId}/exercises`)
    }
    } catch (error) {
    setError('An unexpected error occurred, please try again later.')
  } finally {
    setLoading(false)
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
            <p className='loader-text'>Creating exercise, this may take a few moments. Thank you for your patience!</p>
          </div>
        )}

        <div className='card'>
          <form className='form-section' onSubmit={handleSubmit}>
            <h1>Add a New Exercise</h1>
            <div className='main-section'>
              <div className='choices'>
                <h3>General Information</h3>
                <div className='input-container'>
                  <label>Title</label>
                  <input type='text' name='title' value={options.title} onChange={handleInputChange} className={emptyFields.includes('title') ? 'error' : ''} />
                </div>

                <div className='input-container'>
                  <label>Exercise Sets</label>
                  <input type='number' name='sets' value={options.sets} onChange={handleInputChange} />
                </div>

                <div className='input-container'>
                  <label>Exercise Reps</label>
                  <input type='number' name='reps' value={options.reps} onChange={handleInputChange} />
                </div>

                <div className='input-container'>
                  <label>Exercise Load</label>
                  <input type='number' name='load' value={options.load} onChange={handleInputChange} placeholder='Insert number in Kg' />
                </div>

                <div className='input-container'>
                  <label>Exercise Time</label>
                  <div className='input-group'>
                    <input type='number' name='time' value={options.time} onChange={handleInputChange} />
                    <select name='timeUnit' value={options.timeUnit} onChange={handleInputChange}>
                      <option value='seconds'>Seconds</option>
                      <option value='minutes'>Minutes</option>
                      <option value='hours'>Hours</option>
                    </select>
                  </div>
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
                    <input type='file' name='imageStartFile' onChange={handleInputChange} />
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
                      placeholder='Insert image URL or choose a file to upload'
                    />
                    <span>or</span>
                    <input type='file' name='imageEndFile' onChange={handleInputChange} />
                  </div>
                </div>

                <h3>Exercise description</h3>
                <div className='input-container'>
                  <label>Exercise description</label>
                  <textarea
                    name='description'
                    value={options.description}
                    onChange={handleInputChange}
                    rows='4'
                    cols='40'
                    placeholder='Enter your description here'
                  ></textarea>
                </div>

                <h3>Exercise Video</h3>
                <div className=''>
                  <label>Exercise Video</label>
                  <input type='text' name='video' value={options.video} onChange={handleInputChange} placeholder='Insert video URL here' />
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
