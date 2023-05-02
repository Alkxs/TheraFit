import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { apiUrl } from '../api.js'

export const useLogin = () => {
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(null)
  const { dispatch } = useAuthContext()

  const login = async (username, email, password) => {
    setLoading(true)
    setError(null)
    console.log(apiUrl)
    const res = await fetch(`${apiUrl}/api/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    })
    const data = await res.json()
    console.log(data)

    if (!res.ok) {
      setLoading(false)
      setError(data.error)
    }
    if (res.ok) {
      // save the user to local storage
      localStorage.setItem('user', JSON.stringify(data))

      //update the auth context
      dispatch({ type: 'LOGIN', payload: data })

      setLoading(false)
    }
  }

  return { login, loading, error }
}
