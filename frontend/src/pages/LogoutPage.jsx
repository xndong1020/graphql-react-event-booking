import React, { useContext } from 'react'
import { Redirect } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

const LogoutPage = () => {
  const { logout } = useContext(AuthContext)
  logout()

  return <Redirect to="/login" />
}

export default LogoutPage
