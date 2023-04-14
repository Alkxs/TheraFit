import { useState } from 'react'
import { useSignup } from '../hooks/useSignup'

const Signup = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {signup, error, isLoading} = useSignup()

  const handleSubmit = async (e) => {
    e.preventDefault()

    await signup(username, email, password)
  }

  return (
    <div className='form-container'>
      <div className='card'>
        <form className='signup' onSubmit={handleSubmit} className='form-section'>
          <h1>Signup</h1>

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
              <button disabled={isLoading} className='primary-button signup'>
                Sign up
              </button>
            </div>
            {error && <div className='error'>{error}</div>}
          </div>
        </form>
      </div>
    </div>
  ) 
}
export default Signup 