import React, { useContext } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import indexRoutes from '../routes'
import MainNavigation from '../components/navigation/MainNavigation'

const DefaultLayout = () => {
  const { isAuthenticated } = useContext(AuthContext)
  console.log('isAuthenticated', isAuthenticated)
  const switchRoutes = (
    <Switch>
      {indexRoutes.map((prop, key) => {
        if (prop.redirect)
          return <Redirect exact from={prop.from} to={prop.to} key={key} />
        if (prop.catch) return <Route component={prop.component} key={key} />
        return <Route path={prop.path} component={prop.component} key={key} />
      })}
    </Switch>
  )
  return (
    <React.Fragment>
      <MainNavigation />
      {/* based on current path, show different component */}
      <div className="container">{switchRoutes}</div>
    </React.Fragment>
  )
}

export default DefaultLayout
