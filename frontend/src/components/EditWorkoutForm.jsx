import { useState, useEffect } from 'react'
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useAuthContext } from '../hooks/useAuthContext'
import { useNavigate, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import Select from 'react-select'
import { FaArrowLeft } from 'react-icons/fa'

 const EditWorkoutForm = () => {
  const { workoutId } = useParams()
  const { workouts, dispatch } = useWorkoutsContext()
  const { user } = useAuthContext()
  const navigate = useNavigate()

  const [workoutData, setWorkoutData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    frequency: '',
    type: '',
  })
  const [error, setError] = useState('')
  const [emptyFields, setEmptyFields] = useState([])

  useEffect(() => {
    const workout = workouts.find((workout) => workout._id === workoutId)

    if (workout) {
      const formattedStartDate = format(new Date(workout.startDate), 'yyyy-MM-dd')
      const formattedEndDate = format(new Date(workout.endDate), 'yyyy-MM-dd')
    
      setWorkoutData({
        ...workout,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      })
    } else {
      setWorkoutData({
        title: '',
        startDate: '',
        endDate: '',
        frequency: '',
        type: '',
      })
    }
  }, [workoutId, workouts])

  const validateDates = () => {
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    if (options.startDate) {
      const startDate = new Date(options.startDate)

    if (startDate < currentDate) {
      setError('The start date must be today or later')
      return false
    }

    if (options.endDate) {
      const endDate = new Date(options.endDate);
    

    if (startDate > endDate) {
      setError('The end date must be later than the start date')
      return false
        }
      }
    }

    if (options.endDate) {
    const endDate = new Date(options.endDate)

    if (options.startDate) {
      const startDate = new Date(options.startDate)

    if (endDate < startDate) {
      setError('The start date must be earlier than the end date')
      return false
        }
      }
    }
    setError(null)
    return true
  }


  const frequency = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
    { value: 6, label: '6' },
    { value: 7, label: '7' },
  ]

  const types = [
    { value: 'cardio', label: 'cardio' },
    { value: 'strength', label: 'strength' },
    { value: 'yoga', label: 'yoga' },
    { value: 'circuit-training', label: 'circuit training' },
    { value: 'cycling', label: 'cycling' },
    { value: 'hiking', label: 'hiking' },
    { value: 'running', label: 'running' },
    { value: 'swimming', label: 'swimming' },
    { value: 'walking', label: 'walking' },
    { value: 'stretching', label: 'stretching' },
  ]
  const type = types.sort((a, b) => a.label.localeCompare(b.label))

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setWorkoutData({
      ...workoutData,
      [name]: value,
    })
  }

  const handleFrequency = (selected) => {
    setWorkoutData({
      ...workoutData,
      frequency: selected.value,
    })
  }

  const handleType = (selected) => {
    setWorkoutData({
      ...workoutData,
      type: selected.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      setError('You must be logged in')
      return
    }

     if (!validateDates()) {
       return
     }
    // handle form submission here
    const { title, startDate, endDate, frequency, type } = workoutData

    const workout = { title, startDate, endDate, frequency, type }

    const res = await fetch(`http://localhost:3000/${workoutId}/edit`, {
      method: 'PATCH',
      body: JSON.stringify(workout),
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
      setError(null)
      setWorkoutData({
        title: '',
        startDate: '',
        endDate: '',
        frequency: '',
        type: '',
      })
      setEmptyFields([])
      console.log('workout updated:', data)
      dispatch({ type: 'EDIT_WORKOUT', payload: data })

      navigate(`/`)
    }
  }

  return (
    <div className='form-container'>
      <div className='card'>
        <button type='button' onClick={() => navigate(`/`)} className='button-back'>
          <FaArrowLeft size={25}/>
        </button>

        <form onSubmit={handleSubmit} className='form-section'>
          <h1>Edit Workout</h1>

          
            <div className='choices'>
              <div>
                <label>Title</label>
                <input
                  type='text'
                  name='title'
                  value={workoutData.title}
                  onChange={handleInputChange}
                  className={emptyFields.includes('title') ? 'error' : ''}
                />
              </div>

              <div>
                <label>Start Date</label>
                <input
                  type='date'
                  name='startDate'
                  value={workoutData.startDate}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label>End Date</label>
                <input
                  type='date'
                  name='endDate'
                  value={workoutData.endDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className='select-container'>
                <label>Frequency 
                  <span className="frequency">(in days x week)</span>
                   </label>
                <Select
                  options={frequency}
                  value={frequency.find((option) => option.value === workoutData.frequency)}
                  onChange={handleFrequency}
                />
              </div>

              <div className='select-container'>
                <label>Type</label>
                <Select
                  options={type}
                  value={type.find((option) => option.value === workoutData.type)}
                  onChange={handleType}
                  className={emptyFields.includes('type') ? 'error' : ''}
                />
              </div>
            </div>
          
          <button type='submit' className='primary-button'>
            Update Workout
          </button>
          {error && <div className='error-message'>{error}
          </div>}
        </form>
      </div>
    </div>
  )
  }

export default EditWorkoutForm

