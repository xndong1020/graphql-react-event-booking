import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import './MainNavigation.scss'

const MainNavigation = () => {
  const { isAuthenticated } = useContext(AuthContext)
  return (
    <header>
      <div className="container">
        <div className="main-navigation__logo">Jeremy Events Management</div>
        <div className="main-navigation__item">
          <ul>
            <li>
              <NavLink to="/events">Events</NavLink>
            </li>
            <li>
              <NavLink to="/bookings">Bookings</NavLink>
            </li>
            {!isAuthenticated ? (
              <li>
                <NavLink to="/login">Login</NavLink>
              </li>
            ) : (
              <li>
                <NavLink to="/logout">Logout</NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  )
}

export default MainNavigation
