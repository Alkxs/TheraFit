import { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useAuthContext } from '../hooks/useAuthContext'
import DemoUserContext from '../context/DemoUserContext'
import WorkoutComponent from '../components/WorkoutComponent'

const home = () => {
  const { workouts, dispatch } = useWorkoutsContext()
  const { user } = useAuthContext()
  const navigate = useNavigate()
  const { isDemoUser } = useContext(DemoUserContext)

  useEffect(() => {
    const fetchWorkouts = async() => {
      const res = await fetch('https://therafit.onrender.com/', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
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
        {workouts && workouts.length > 0 ? (
          workouts.map((workout) => <WorkoutComponent key={workout._id} workout={workout} />)
        ) : (
          <p className='no-workouts'>There are currently no workouts created by this user</p>
        )}
      </div>

      <div className='button-container'>
        <button
          className='secondary-button'
          onClick={
            !isDemoUser
              ? () => navigate(`/create-workout`)
              : () =>
                  alert(
                    'Demo mode active: The current features are not available for use. To access full functionality, please create a new account and log in.'
                  )
          }
        >
          Create New Workout
        </button>
      </div>
    </div>
  )
}
export default home