import React, { useState } from 'react'
import axios from '../helpers/axios.instance'
import { makeLoginQuery } from '../helpers/query.factory'

const AuthContext = React.createContext()

const AuthProvider = props => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const login = async ({ email, password }) => {
    try {
      const result = await axios.post(
        '/graphql',
        JSON.stringify(makeLoginQuery(email, password))
      )
      const { sub, token } = result.data.data.login
      localStorage.setItem('token', token)
      localStorage.setItem('sub', sub)
      setIsAuthenticated(true)
      setErrorMessage('')
    } catch (err) {
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
        isAuthenticated,
        errorMessage,
        login,
        logout
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}

const AuthConsumer = AuthContext.Consumer

export { AuthContext, AuthProvider, AuthConsumer }
