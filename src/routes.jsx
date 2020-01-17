import React from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import Home from './features/Home';

const Routes = () => {
  return (
    <>
      <Switch>
        <Route exact path="/" component={Home} />
      </Switch>
      <Link to="/cabinet">Cabinet!!</Link>
      <Link to="/">Home!!</Link>
    </>
  );
};

export default Routes;
