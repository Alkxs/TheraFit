import { useState } from "react";
import { useAuthContext } from './useAuthContext'
import { apiUrl } from '../api'

export const useSignup = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()

  const signup = async (username, email, password) => {
    setIsLoading(true)
    setError(null)

    const res = await fetch(`${apiUrl}/api/user/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    })
    const data = await res.json()

    if (!res.ok) {
      setIsLoading(false)
      setError(data.error)
    }
    if (res.ok) {
      // save the user to local storage
      localStorage.setItem('user', JSON.stringify(data))

      //update the auth context
      dispatch({type: 'LOGIN', payload: data})

      setIsLoading(false)
    }
  }

  return { signup, isLoading, error }
}
