const jwt = require('jsonwebtoken')
require('dotenv').config()

const auth = (req, res, next) => {
  const authHeader = req.get('Authorization')
  if (!authHeader) {
    req.isAuthenticated = false
    return next(new Error('No Auth header provided'))
  }
  const token = authHeader.split(' ')[1]
  if (!token) {
    req.isAuthenticated = false
    return next(new Error('token missing'))
  }

  let decodedToken
  try {
    decodedToken = jwt.verify(token, process.env.AUTH_SECRET)
    //     { sub: '5c76512d608a2ae05c044c01',
    //   email: 'aa@a.com',
    //   iat: 1551258038,
    //   exp: 1551261638 }
  } catch (err) {
    req.isAuthenticated = false
    return next(err)
  }

  req.isAuthenticated = true
  req.userId = decodedToken.sub
  next()
}

module.exports = auth
