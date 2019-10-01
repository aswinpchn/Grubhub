import React from 'react';
import '../styles/App.css';
import Home from './Home';
import Login from './Login';
import SignUp from './SignUp';
import Profile from './Profile';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import cookie from 'react-cookies';
import { connect } from 'react-redux';

function App(props) {
  //console.log(props.user);
  
  return (
    <Router>
          <Switch>
            <Route exact path='/' render={() => (<Redirect to="/login" />)} />
            <Route path='/login/:type' component={Login} />
            <Route path='/login' component={Login} />
             <Route path='/home' render={() => props.user && props.user.username !== "" ? <Home /> :(<Redirect to="/login" />)} /> 
            <Route path='/create-account/:type' component={SignUp} />
            <Route path='/create-account' component={SignUp} />
            <Route path='/profile' render={() => props.user && props.user.username !== "" ? <Profile /> :(<Redirect to="/login" />)} />
          </Switch>
    </Router>
  );
}

let mapStateToProps = (state) => {
  return {user : state.user}
};

export default connect(mapStateToProps)(App);
