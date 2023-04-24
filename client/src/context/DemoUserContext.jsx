import { createContext, useState, useEffect } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'

const DemoUserContext = createContext({
  isDemoUser: false,
  setIsDemoUser: () => {},
})

export const DemoUserContextProvider = ({ children }) => {
  const { user } = useAuthContext()
  const [isDemoUser, setIsDemoUser] = useState(false)

  useEffect(() => {
    const isDemoUser = user && user.email === 'test@test.com'
    setIsDemoUser(isDemoUser)
    console.log(isDemoUser)
  }, [user])

  return <DemoUserContext.Provider value={{ isDemoUser, setIsDemoUser }}>{children}</DemoUserContext.Provider>
}

export default DemoUserContext
