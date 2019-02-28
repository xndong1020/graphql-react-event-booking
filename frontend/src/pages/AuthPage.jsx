import React, { useState, useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import './AuthPage.scss'

const AuthPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { login, errorMessage } = useContext(AuthContext)

  const handleInputChange = event => {
    const { name, value } = event.target
    switch (name) {
      case 'email':
        setEmail(value)
        break
      case 'password':
        setPassword(value)
        break
      default:
        break
    }
  }

  const handleSubmit = event => {
    event.preventDefault()
    login({
      email,
      password
    })
  }

  return (
    <div className="form-container">
      <form className="form">
        {errorMessage && <div className="errorMsg">{errorMessage}</div>}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
      </form>
    </div>
  )
}

export default AuthPage
