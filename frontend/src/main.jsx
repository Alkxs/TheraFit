import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthContextProvider } from './context/AuthContext'
import { WorkoutsContextProvider } from './context/WorkoutsContext'
import { ExercisesContextProvider } from './context/ExercisesContext'
import { DemoUserContextProvider } from './context/DemoUserContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <WorkoutsContextProvider>
        <ExercisesContextProvider>
          <DemoUserContextProvider>
            <App />
          </DemoUserContextProvider>
        </ExercisesContextProvider>
      </WorkoutsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
)