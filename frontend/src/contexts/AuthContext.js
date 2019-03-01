import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import axios from '../helpers/axios.instance'
import QueryFactory from '../factories/queryFactory'

const loadInitialState = () => {
  const sub = localStorage.getItem('sub')
  const token = localStorage.getItem('token')

  if (sub && token) {
    return {
      accessToken: token,
      userId: sub,
      isAuth: true
    }
  }
  return {}
}

const AuthContext = React.createContext()

const AuthProvider = props => {
  const { history } = props
  const { accessToken, userId, isAuth } = loadInitialState()

  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(isAuth)
  const [token, setToken] = useState(accessToken)
  const [sub, setSub] = useState(userId)
  const [errorMessage, setErrorMessage] = useState('')

  const login = async ({ email, password }) => {
    try {
      setErrorMessage('')
      setIsLoading(true)
      const result = await axios.post(
        '/graphql',
        new QueryFactory().build('login', { email, password }).stringify()
      )
      // console.log('login', result.data.data.login)
      const { login } = result.data.data
      setToken(login.token)
      setSub(login.sub)
      localStorage.setItem('token', login.token)
      localStorage.setItem('sub', login.sub)
      setIsLoading(false)
      setIsAuthenticated(true)
      history.push('/events')
    } catch (err) {
      setIsLoading(false)
      setErrorMessage('Invalid credentials')
      console.error(err)
    }
  }

  const register = async ({ email, password }) => {
    try {
      setErrorMessage('')
      setIsLoading(true)
      await axios.post(
        '/graphql',
        new QueryFactory().build('register', { email, password }).stringify()
      )
      // console.log('register', result.data.data.createUser)
      setIsLoading(false)
      history.push('/login')
    } catch (err) {
      setIsLoading(false)
      setErrorMessage('Invalid credentials')
      console.error(err)
    }
  }

  const logout = () => {
    setToken('')
    setSub('')
    localStorage.removeItem('token')
    localStorage.removeItem('sub')
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        errorMessage,
        setErrorMessage,
        sub,
        token,
        login,
        logout,
        register
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}

const AuthProviderWithRouter = withRouter(AuthProvider)
const AuthConsumer = AuthContext.Consumer

export { AuthContext, AuthProviderWithRouter as AuthProvider, AuthConsumer }
