import React from 'react';
import '../styles/App.css';
import Home from './Home';
import Login from './Login';
import SignUp from './SignUp';
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
                <Redirect to="/login" />
              )
            )}/>
            <Route path='/login/:type' component={Login} />
            <Route path='/login' component={Login} />
            <Route path='/home' component={Home} />
            <Route path='/create-account/:type' component={SignUp} />
            <Route path='/create-account' component={SignUp} />
          </Switch>
    </Router>
  );
}

export default App;
