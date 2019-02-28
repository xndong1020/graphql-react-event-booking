import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import DefaultLayout from './layouts/DefaultLayout'
import { AuthProvider } from './contexts/AuthContext'
import './App.scss'

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <BrowserRouter>
          <AuthProvider>
            <Switch>
              <Route component={DefaultLayout} />
            </Switch>
          </AuthProvider>
        </BrowserRouter>
      </React.Fragment>
    )
  }
}

export default App
