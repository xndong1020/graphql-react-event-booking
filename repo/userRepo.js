const User = require('../models/User')
const { createHashedPassword } = require('../utils/security.utils')

const getAllUsers = async () => {
  const users = await User.find({}, { __v: 0 }).populate('createdEvents')
  return users
}

const userExists = async email => {
  const user = await User.findOne({ email })
  return user
}

const createUser = async user => {
  const hashedPassed = await createHashedPassword(user.password)
  const newUser = await User.create({ ...user, password: hashedPassed })
  return newUser
}

module.exports = {
  getAllUsers,
  userExists,
  createUser
}
