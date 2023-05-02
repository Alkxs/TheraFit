const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  }
})

// static signup method
userSchema.statics.signup = async function(username, email, password){
  // validation
   if(!username || !email || !password) {
    throw Error('All fields must be filled')
   }
   if(!validator.isEmail(email)) {
    throw Error('Please enter a valid email address in the format: yourname@example.com')
   }
   if(!validator.isStrongPassword(password)) {
    throw Error(
      'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.'
    )
   }

  const exists = await this.findOne({email})

  if (exists) {
    throw Error('Email already in use')
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  const user = await this.create({username, email, password: hash})

  return user
}

// static login method

userSchema.statics.login = async function(username, email, password) {
    if (!username || !email || !password) {
      throw Error('All fields must be filled')
    }

     const user = await this.findOne({ email })

     if (!user) {
       throw Error('User not found, please Sign up')
     }

     const match = await bcrypt.compare(password, user.password)

     if (!match) {
      throw Error('Incorrect password')
     }

     return user
}

module.exports = mongoose.model('User', userSchema)