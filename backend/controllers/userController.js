const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
}

// login user
const loginUser = async (req, res) => {
  const {username, email, password} = req.body

  try {
    const user = await User.login(username, email, password)
console.error('Error in signupUser:', error)

    // create a token
    const token = createToken(user._id)
console.log('Token created:', token)

    res.status(200).json({ username, email, token })
  } catch (error) {
console.error('Error in loginUser:', error)
    res.status(400).json({ error: error.message })
  }
}

// signup user
const signupUser = async (req, res) => {
const {username, email, password} = req.body

try{
  const user = await User.signup(username, email, password)
console.log('User created:', user)

  // create a token
  const token = createToken(user._id)
console.log('Token created:', token)


  res.status(200).json({username, email, token})
} catch (error){
console.error('Error in signupUser:', error)
  res.status(400).json({error: error.message})
}
}

module.exports = {signupUser, loginUser}