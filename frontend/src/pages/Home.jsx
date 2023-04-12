// Hooks
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// Custom Hooks
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useAuthContext } from '../hooks/useAuthContext'
// components
import WorkoutComponent from '../components/WorkoutComponent'

const home = () => {
  const { workouts, dispatch } = useWorkoutsContext()
  const { user } = useAuthContext()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchWorkouts = async() => {
      const res = await fetch('http://localhost:3000/', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
      const data = await res.json()
      
      if (res.ok) {
       dispatch({type: 'SET_WORKOUTS', payload: data})
      }
    }
    if (user) {
    fetchWorkouts()
    }
  }, [dispatch, user])


  return (
    <div className='home'>
      <div className='main'>
        <h2 className='main-title'> Welcome {user.username}</h2>
        <div className='workouts'>{workouts && workouts.map((workout) => <WorkoutComponent key={workout._id} workout={workout} />)}</div>
        <div className='btn-container'>
          <button className='btn-primary' onClick={() => navigate(`/create-workout`)}>
            Create New Workout
          </button>
        </div>
      </div>
    </div>
  )
}
export default home