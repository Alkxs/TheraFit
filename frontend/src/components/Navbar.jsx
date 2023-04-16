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
            <div className='logo'>
              <img src={logo} alt='logo' />
            </div>
          </div>
        </Link>
        <nav>
          {user && (
            <div className='nav-container'>
              <Link to='/'>
                <div>
                  <h1 className='user'>{user.username}</h1>
                </div>
              </Link>
              <div onClick={handleClick}>
                <h4 className='font-nav'>Logout</h4>
              </div>
            </div>
          )}

          {!user && (
            <div className='nav-container'>
              <Link to='/api/user/signup'>
                <h4 className='font-nav'>Signup</h4>
              </Link>

              <Link to='/api/user/login'>
                <h4 className='font-nav'>Login</h4>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
export default Navbar