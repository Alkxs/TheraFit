import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import Select from 'react-select'
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useAuthContext } from '../hooks/useAuthContext'

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
    { value: 'cardio', label: 'Cardio' },
    { value: 'strength', label: 'Strength' },
    { value: 'yoga', label: 'Yoga' },
    { value: 'Aerobics', label: 'Aerobics' },
    { value: 'Circuit Training', label: 'Circuit Training' },
    { value: 'Cycling', label: 'Cycling' },
    { value: 'Hiking', label: 'Hiking' },
    { value: 'Running', label: 'Running' },
    { value: 'Swimming', label: 'Swimming' },
    { value: 'Walking', label: 'Walking' },
    { value: 'Stretching', label: 'Stretching' },
    { value: 'Cross Training', label: 'Cross Training' },
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
    <div className='container'>
      <button type='button' onClick={() => navigate('/')}>
        Back
      </button>
      <form onSubmit={handleSubmit}>
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

            <div>
              <label>Frequency x week</label>
              <Select
                options={frequency}
                value={frequency.find((option) => option.value === options.frequency)}
                onChange={handleFrequency}
                className={emptyFields.includes('frequency') ? 'error' : ''}
              />
            </div>

            <div>
              <label>Type</label>
              <Select
                options={type}
                value={type.find((option) => option.value === options.type)}
                onChange={handleType}
                className={emptyFields.includes('type') ? 'error' : ''}
              />
            </div>
          </div>

          {/* <div className='img-container'>
            <label>Upload Picture:</label>
            <input 
              type='file' 
              accept='image/*' 
              onChange={handleFileChange} 
              className={emptyFields.includes() ? 'error' : ''}
              />
          </div> */}
        </div>

        <button type='submit'>Create Workout</button>
        {error && <div className='error'>{error}</div>}
      </form>
    </div>
  )
}
export default CreateWorkout