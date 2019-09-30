import React from 'react';
import '../styles/App.css';
import Home from './Home';
import Login from './Login';
import SignUp from './SignUp';
import Profile from './Profile';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import cookie from 'react-cookies';

function App(props) {
  let redirectVar = null;
  if(cookie.load('cookie') && props.store.getState() && props.store.getState().user && props.store.getState().user.username !== "") {
  } else {
    redirectVar = <Redirect to='/login' />
  }
  
  return (
    <Router>
      {redirectVar}
          <Switch>
            <Route exact path='/' render={() => (<Redirect to="/login" />)} />
            <Route path='/login/:type' component={Login} />
            <Route path='/login' component={Login} />
             <Route path='/home' component={Home} /> 
             {/* Tried to use render attrinute in route to put if-else case inside it, it caused inifnite loop while rendering */}
            <Route path='/create-account/:type' component={SignUp} />
            <Route path='/create-account' component={SignUp} />
            <Route path='/profile' component={Profile} />
          </Switch>
    </Router>
  );
}

export default App;
