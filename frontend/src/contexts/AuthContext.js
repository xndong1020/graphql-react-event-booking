import React, { useState } from 'react'
import axios from '../helpers/axios.instance'
import QueryFactory from '../factories/queryFactory'

const AuthContext = React.createContext()

const AuthProvider = props => {
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
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
      const { sub, token } = result.data.data.login
      localStorage.setItem('token', token)
      localStorage.setItem('sub', sub)
      setIsLoading(false)
      setIsAuthenticated(true)
    } catch (err) {
      setIsLoading(false)
      setErrorMessage('Invalid credentials')
      console.error(err)
    }
  }

  const register = async ({ email, password }) => {
    try {
      console.log('props', props)
      setErrorMessage('')
      setIsLoading(true)
      await axios.post(
        '/graphql',
        new QueryFactory().build('register', { email, password }).stringify()
      )
      // console.log('register', result.data.data.createUser)
      window.location.href = 'login'
      setIsLoading(false)
      setIsAuthenticated(true)
    } catch (err) {
      setIsLoading(false)
      setErrorMessage('Invalid credentials')
      console.error(err)
    }
  }

  const logout = () => {
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
        login,
        logout,
        register
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}

const AuthConsumer = AuthContext.Consumer

export { AuthContext, AuthProvider, AuthConsumer }
