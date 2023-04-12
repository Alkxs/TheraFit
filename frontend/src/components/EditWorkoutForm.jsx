import { useState, useEffect } from 'react'
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useAuthContext } from '../hooks/useAuthContext'
import { useNavigate, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import Select from 'react-select'

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
  const [error, setError] = useState(null)
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

    // handle form submission here
    const { title, startDate, endDate, frequency, type } = workoutData

    const workout = { title, startDate, endDate, frequency, type }

    const res = await fetch(`http://localhost:3000/api/workouts/${workoutId}`, {
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
    <div className='container'>
      <button type='button' onClick={() => navigate(`/`)}>
        Back
      </button>
      <form onSubmit={handleSubmit}>
        <h1>Edit Workout</h1>
        <div className='main-section'>
          <div className='choices'>
            <div>
              <label>Title:</label>
              <input type='text' name='title' value={workoutData.title} onChange={handleInputChange} className={emptyFields.includes('title') ? 'error' : ''} />
            </div>

            <div>
              <label>Start Date: {workoutData.startDate}</label>
              <input
                type='date'
                name='startDate'
                value={workoutData.startDate}
                onChange={handleInputChange}
                className={emptyFields.includes('startDate') ? 'error' : ''}
              />
            </div>

            <div>
              <label>End Date: {workoutData.endDate}</label>
              <input
                type='date'
                name='endDate'
                value={workoutData.endDate}
                onChange={handleInputChange}
                className={emptyFields.includes('endDate') ? 'error' : ''}
              />
            </div>

            <div>
              <label>Frequency x week</label>
              <Select
                options={frequency}
                value={frequency.find((option) => option.value === workoutData.frequency)}
                onChange={handleFrequency}
                className={emptyFields.includes('frequency') ? 'error' : ''}
              />
            </div>

            <div>
              <label>Type</label>
              <Select
                options={type}
                value={type.find((option) => option.value === workoutData.type)}
                onChange={handleType}
                className={emptyFields.includes('type') ? 'error' : ''}
              />
            </div>
          </div>
        </div>
        <button type='submit'>Update</button>
        {error && <div className='error'>{error}</div>}
      </form>
    </div>
  )
  }

export default EditWorkoutForm