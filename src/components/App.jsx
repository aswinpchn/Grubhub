import React from 'react';
import '../styles/App.css';
import Home from './Home';
import Login from './Login';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

function App() {
  const loggedIn = false;
  return (
    <Router>
      <Switch>
        <Route exact path='/' render={() => (
          loggedIn ? (
            <Redirect to="/home" />
          ) : (
            <Redirect to="/login"/>
          )
        )}/>
        <Route path='/login' component={Login}/>
        <Route path='/home' component={Home}/>
      </Switch>
    </Router>
  );
}

export default App;
