import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import DefaultLayout from './layouts/DefaultLayout'
import './App.scss'

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <BrowserRouter>
          <Switch>
            <Route component={DefaultLayout} />
          </Switch>
        </BrowserRouter>
      </React.Fragment>
    )
  }
}

export default App
