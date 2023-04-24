import { createContext, useReducer } from 'react'

export const ExercisesContext = createContext()

export const exercisesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_EXERCISES':
      return {
        exercises: action.payload,
      }
    case 'CREATE_EXERCISE':
      return {
        exercises: [action.payload, ...state.exercises],
      }
    case 'UPDATE_EXERCISE':
      return {
        exercises: state.exercises.map((exercise) => {
          if (exercise._id === action.payload._id) {
            return action.payload
          } else {
            return exercise
          }
        }),
      }
    case 'DELETE_EXERCISE':
      return {
        exercises: state.exercises.filter((exercise) => exercise._id !== action.payload._id),
      }
    case 'DELETE_EXERCISES':
      return {
        exercises: state.exercises.filter((exercise) => exercise.workoutid !== action.payload.workoutId),
      }
    default:
      return state
  }
}

export const ExercisesContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(exercisesReducer, {
    exercises: [],
  })

  return <ExercisesContext.Provider value={{ ...state, dispatch }}>{children}</ExercisesContext.Provider>
}
