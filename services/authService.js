const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { userExists } = require('../repo/userRepo')
require('dotenv').config()

const login = async loginInput => {
  const { email, password } = loginInput
  if (!email || !password) throw new Error(`Invalid credentials`)

  const userInDb = await userExists(email)
  if (!userInDb) throw new Error(`User does not exist`)

  const isPasswordMatch = await bcrypt.compare(password, userInDb.password)
  if (!isPasswordMatch) throw new Error(`Wrong password`)

  // if all good
  const token = jwt.sign(
    { sub: userInDb._id, email },
    process.env.AUTH_SECRET,
    {
      expiresIn: '1h'
    }
  )

  return {
    sub: userInDb._id,
    email,
    token
  }
}

module.exports = {
  login
}
