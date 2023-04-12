import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'

const Navbar = () => {

  const { logout } = useLogout()
  const { user } = useAuthContext()

  const handleClick = () => {
     logout()
  }

  return (
    <header>
      <div className="container">
        <Link to='/'>
          <h1>Home Exercise Planner</h1>
        </Link>
        <nav>
          {user && (
            <div>
              <span>{user.username}</span>
              <button onClick={ handleClick }>
                Log out
              </button>
            </div>
            )}

          {!user && (
            <div>
              <Link to='/api/user/signup'>Sign up</Link>
              <Link to='/api/user/login'>Login</Link>
            </div>
            )}
        </nav>
      </div>
    </header>
  )
}
export default Navbar