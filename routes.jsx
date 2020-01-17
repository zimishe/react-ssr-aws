import React from 'react'
import { Route, Link, Switch } from 'react-router-dom'
import Home from './features/Home';
import Cabinet from './features/Cabinet';

const Routes = () => {
  return (
    <React.Fragment>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/cabinet" component={Cabinet} />
      </Switch>
      <Link to="/cabinet">Cabinet!!</Link>
      <Link to="/">Home!!</Link>
    </React.Fragment>
  )
}

export default Routes
