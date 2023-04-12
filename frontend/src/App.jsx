import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'
// pages
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Signup from './pages/Signup'
import Login from './pages/Login'
import WorkoutForm from './components/WorkoutForm'
import EditWorkoutForm from './components/EditWorkoutForm'
import WorkoutPage from './pages/WorkoutPage'
import ExerciseForm from './components/ExerciseForm'
import EditExerciseForm from './components/EditExerciseForm'
import ExerciseDetails from './components/ExerciseDetails'

function App() {
  const { user } = useAuthContext()
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <div className='pages'>
          <Routes>
            <Route path='/' element={user ? <Home /> : <Navigate to='/api/user/login' />} />
            <Route path='/api/user/signup' element={!user ? <Signup /> : <Navigate to='/' />} />
            <Route path='/api/user/login' element={!user ? <Login /> : <Navigate to='/' />} />
            <Route path='/create-workout' element={<WorkoutForm />} />
            <Route path='/:workoutId/edit' element={<EditWorkoutForm />} />
            <Route path='/:workoutid/exercises' element={<WorkoutPage />} />
            <Route path='/:workoutid/create-exercise' element={<ExerciseForm />} />
            <Route path='/:workoutId/exercises/:exerciseId/edit' element={<EditExerciseForm />} />
            <Route path='/:workoutId/exercises/:exerciseId/show-details' element={<ExerciseDetails />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
