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

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [emptyFields, setEmptyFields] = useState([])

  const getInitialOptions = () => {
    const exercise = exercises.find((exercise) => exercise._id === exerciseId)
     let imageStartLink = exercise?.imageStartLink || ''
     let imageEndLink = exercise?.imageEndLink || ''
     const imageStartFile = exercise?.imageStartFile || ''
     const imageEndFile = exercise?.imageEndFile || ''

    if (imageStartFile && !imageStartFile.includes('res.cloudinary.com')) {
     
      imageStartLink = imageStartFile
    }

    if (imageEndFile && !imageEndFile.includes('res.cloudinary.com')) {
      imageEndLink = imageEndFile
    }

    return exercise
      ? {
          ...exercise,
          imageStartLink,
          imageEndLink,
          timeUnit: exercise.timeUnit || 'seconds',
        }
      : {
          title: '',
          sets: '',
          reps: '',
          load: '',
          time: '',
          timeUnit: 'seconds',
          imageStartLink: '',
          imageStartFile: '',
          imageEndLink: '',
          imageEndFile: '',
          description: '',
          video: '',
        }
  }

  const [options, setOptions] = useState(getInitialOptions)


  useEffect(() => {
    setOptions(getInitialOptions())
  }, [exerciseId, exercises])

  const handleInputChange = (e) => {
    const { name, value, files } = e.target

    if (files) {
      setOptions({
        ...options,
        [name]: files[0],
        [name.replace('File', 'Link')]: '',
      })
    } else {
      setOptions((prevOptions) => {
        const newOptions = { ...prevOptions, [name]: value }

        if (name.endsWith('Link')) {
          newOptions[name.replace('Link', 'File')] = ''
        }

        return newOptions
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

    if (options.imageStartLink && options.imageStartFile && options.imageStartFile.name) {
      setError('Please choose between pasting an image URL or uploading an image for the initial body position.')
      setLoading(false)
      return
    }

    if (options.imageEndLink && options.imageEndFile && options.imageEndFile.name) {
      setError('Please choose between pasting an image URL or uploading an image for the final body position.')
      setLoading(false)
      return
    }

    const { title, sets, reps, load, time, timeUnit, imageStartLink, imageStartFile, imageEndLink, imageEndFile, description, video } = options

    const formData = new FormData()
    formData.append('title', title)
    if (sets) {
      formData.append('sets', sets)
    }
    if (reps) {
      formData.append('reps', reps)
    }
    if (load) {
      formData.append('load', load)
    }
    if (time) {
      formData.append('time', time)
    }
    if (timeUnit) {
      formData.append('timeUnit', timeUnit)
    }
    formData.append('description', description)
    formData.append('video', video)
    formData.append('workoutId', workoutId)
    formData.append('imageStartLink', imageStartLink)
    if (imageStartFile) {
      formData.append('imageStartFile', imageStartFile)
    }
    formData.append('imageEndLink', imageEndLink)
    if (imageEndFile) {
      formData.append('imageEndFile', imageEndFile)
    }

    const res = await fetch(`http://localhost:3000/${workoutId}/exercises/${exerciseId}/edit`, {
      method: 'PATCH',
      body: formData,
      headers: {
        Authorization: `Bearer ${user.token}`,
      }
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
      setEmptyFields(data.emptyFields || [])
      setLoading(false)
    }
    if (res.ok) {
      setLoading(false)
      setError('')
      setEmptyFields([])
      console.log('exercise updated:', data)
      dispatch({ type: 'EDIT_EXERCISE', payload: { ...data, timeUnit }})
      navigate(`/${workoutId}/exercises/`)
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
            <p className='loader-text'>Updating exercise, please wait...</p>
          </div>
        )}

        <div className='card'>
          <form className='form-section' onSubmit={handleSubmit}>
            <h1>Edit Exercise</h1>
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
                  <input type='number' name='load' value={options.load} onChange={handleInputChange} />
                </div>

                <div className='input-container'>
                  <label>Exercise Time</label>
                  <div className='input-group'>
                    <input type='number' name='time' value={options.time} onChange={handleInputChange} />
                    <select name='timeUnit' value={options.timeUnit} onChange={handleInputChange} key={exerciseId}>
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
                  <input type='text' name='description' value={options.description} onChange={handleInputChange} />
                </div>

                <h3>Exercise Video</h3>
                <div className='input-container'>
                  <label>Exercise Video (Video URL)</label>
                  <input type='text' name='video' value={options.video} onChange={handleInputChange} />
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
    </>
  )
}
export default EditExerciseForm