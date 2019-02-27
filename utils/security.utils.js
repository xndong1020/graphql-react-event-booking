const { hash, genSalt } = require('bcrypt')

const createHashedPassword = async password => {
  console.log('createHashedPassword', createHashedPassword)
  const salt = await genSalt(12)
  const hashedPassword = await hash(password, salt)
  return hashedPassword
}

module.exports = {
  createHashedPassword
}
