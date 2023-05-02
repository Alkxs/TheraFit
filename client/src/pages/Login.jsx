import { useState } from 'react'
import { useLogin } from '../hooks/useLogin'

const Login = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {login, error, loading} = useLogin()

  const handleSubmit = async (e) => {
    e.preventDefault()

    await login(username, email, password)
  }

  return (
    <>
      {loading && (
        <div className='loader-container'>
          <div className='loader'></div>
          <p className='loader-text'>
            Thank you for logging in! The request may take up to 30 seconds. Please do not close or refresh this page until the process is complete.
          </p>
        </div>
      )}
      <div className='form-container'>
        <div className='card'>
          <form onSubmit={handleSubmit} className='form-section'>
            <h1>Login</h1>

            <div className='choices'>
              <div>
                <label>Username:</label>
                <input type='username' onChange={(e) => setUsername(e.target.value)} value={username} />
              </div>

              <div>
                <label>Email:</label>
                <input type='email' autoComplete='current-email' onChange={(e) => setEmail(e.target.value)} value={email} />
              </div>

              <div>
                <label>Password:</label>
                <input type='password' autoComplete='current-password' onChange={(e) => setPassword(e.target.value)} value={password} />
              </div>

              <div className='button-container'>
                <button disabled={loading} className='primary-button login'>
                  Log in
                </button>
              </div>
              {error && <div className='error'>{error}</div>}
            </div>
          </form>
        </div>
      </div>
    </>
  ) 
}
export default Login
