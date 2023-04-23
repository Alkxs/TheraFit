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

    if (user) {
      setIsDemoUser(true)
    } else {
      setIsDemoUser(false)
    }
  }, [user])

  return <DemoUserContext.Provider value={{ isDemoUser, setIsDemoUser }}>{children}</DemoUserContext.Provider>
}

export default DemoUserContext
