import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useAuthContext } from '../hooks/useAuthContext'
import { FaArrowLeft } from "react-icons/fa"

const CreateWorkout = () => {
  const { dispatch } = useWorkoutsContext()
  const { user } = useAuthContext()
  const navigate = useNavigate()

  const [options, setOptions] = useState({
    title: '',
    startDate: '',
    endDate: '',
    frequency: null,
    type: null,
  })
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  const validateDates = () => {
    const startDate = new Date(options.startDate)
    const endDate = new Date(options.endDate)
    const currentDate = new Date()

    currentDate.setHours(0, 0, 0, 0)

    if (startDate < currentDate) {
      setError('Start date cannot be in the past')
      return false
    }
    if (startDate > endDate) {
      setError('Start date cannot be greater than end date')
      return false
    }
    if (endDate < startDate) {
      setError('End date cannot be less than start date')
      return false
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

  const type = [
    { value: 'cardio', label: 'cardio' },
    { value: 'strength', label: 'strength' },
    { value: 'yoga', label: 'yoga' },
    { value: 'circuit-training', label: 'circuit-training' },
    { value: 'cycling', label: 'cycling' },
    { value: 'hiking', label: 'hiking' },
    { value: 'running', label: 'running' },
    { value: 'swimming', label: 'swimming' },
    { value: 'walking', label: 'walking' },
    { value: 'stretching', label: 'stretching' },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setOptions({
      ...options,
      [name]: value,
    })
  }

  const handleFrequency = (selected) => {
    setOptions({
      ...options,
      frequency: selected.value,
    })
  }

  const handleType = (selected) => {
    setOptions({
      ...options,
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

    const {title, startDate, endDate, frequency, type} = options

    const workout = { title, startDate, endDate, frequency, type }

    const res = await fetch('http://localhost:3000/', {
      method: 'POST',
      body: JSON.stringify(workout),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error)
      setEmptyFields(data.emptyFields)
    }
    if (res.ok) {
      setError(null)
      setOptions({
        title: '',
        startDate: '',
        endDate: '',
        frequency: null,
        type: null,
      })
      setEmptyFields([])
      console.log('new workout added:', data)
      dispatch({ type: 'CREATE_WORKOUT', payload: data })

      navigate('/')
       
    }
  }

  return (
    <div className='form-container'>
      <div className='card'>
      <button type='button' onClick={() => navigate(`/`)} className='button-back'>
          <FaArrowLeft size={25}/>
        </button>
      <form onSubmit={handleSubmit}
      className="form-section">
        <h1>Add a New Workout</h1>
        <div className='main-section'>
          <div className='choices'>
            <div>
              <label>Title:</label>
              <input type='text' name='title' value={options.title} onChange={handleInputChange} className={emptyFields.includes('title') ? 'error' : ''} />
            </div>

            <div>
              <label>Start Date: {options.startDate}</label>
              <input
                type='date'
                name='startDate'
                value={options.startDate}
                onChange={handleInputChange}
                className={emptyFields.includes('startDate') ? 'error' : ''}
              />
            </div>

            <div>
              <label>End Date: {options.endDate}</label>
              <input
                type='date'
                name='endDate'
                value={options.endDate}
                onChange={handleInputChange}
                className={emptyFields.includes('endDate') ? 'error' : ''}
              />
            </div>

            <div className='select-container'>
              <label>Frequency x week</label>
              <Select
                options={frequency}
                value={frequency.find((option) => option.value === options.frequency)}
                onChange={handleFrequency}
                className={emptyFields.includes('frequency') ? 'error' : ''}
              />
            </div>

            <div className="select-container">
              <label>Type</label>
              <Select
                options={type}
                value={type.find((option) => option.value === options.type)}
                onChange={handleType}
                className={emptyFields.includes('type') ? 'error' : ''}
              />
            </div>
          </div>
        </div>

        <button type='submit' className="primary-button">Create Workout</button>
        {error && <div className='error'>{error}</div>}
      </form>
    </div>
  </div>
  )
}
export default CreateWorkout