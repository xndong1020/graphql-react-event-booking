import React from 'react'
import { NavLink } from 'react-router-dom'
import './MainNavigation.scss'

const MainNavigation = () => {
  return (
    <header>
      <div className="container">
        <div className="main-navigation__logo">Jeremy Events Management</div>
        <div className="main-navigation__item">
          <ul>
            <li>
              <NavLink to="/auth">Login</NavLink>
            </li>
            <li>
              <NavLink to="/events">Events</NavLink>
            </li>
            <li>
              <NavLink to="/bookings">Bookings</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}

export default MainNavigation
