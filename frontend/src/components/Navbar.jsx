import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'
import logo from '../assets/logo.png'

const Navbar = () => {

  const { logout } = useLogout()
  const { user } = useAuthContext()

  const handleClick = () => {
     logout()
  }

  return (
    <header>
      <div className='container'>
        <Link to='/'>
          <div className='logo-container'>
            {/* <h1>TheraFit</h1> */}
            <div className="logo">
              <img src={logo} alt="logo" />
            </div>
          </div>
        </Link>
        <nav>
          {user && (
            <div>
              <span>{user.username}</span>
              <button onClick={handleClick}>Log out</button>
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