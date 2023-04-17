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
      <h2 className='main-title'> Welcome {user.username}</h2>
      <div className='workouts'>
        {workouts.length > 0 ? (
          workouts.map((workout) => <WorkoutComponent key={workout._id} workout={workout} />)
        ) : (
          <p className='no-workouts'>There are currently no workouts created by this user</p>
        )}
      </div>

      <div className='button-container'>
        <button className='secondary-button' onClick={() => navigate(`/create-workout`)}>
          Create New Workout
        </button>
      </div>
    </div>
  )
}
export default home