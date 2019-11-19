import React from 'react';
import '../styles/App.css';
import Home from './Home';
import Login from './Login';
import SignUp from './SignUp';
import Profile from './Profile';
import CustomerOrder from './CustomerOrder';
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { store } from '../store';
import RestaurantManager from './RestaurantManager';

function App() {
  // This line will execute only once, when code come here, whenever we redirect or link any path, It goes inside the render only of that specific path.
  return (
    <Router>
          <Switch>
            <Route exact path='/' render={() => (<Redirect to="/login" />)} />
            <Route path='/login/:type' component={Login} />
            <Route path='/login' component={Login} />
            <Route path='/home' render={() => { 
              var props =store.getState();
              return (props.user && props.user.username !== "") ? <Home /> :(<Redirect to="/login" />)
            }} /> 
            <Route path='/create-account/:type' component={SignUp} />
            <Route path='/create-account' component={SignUp} />
            <Route path='/profile' render={() => { 
              var props =store.getState();
              return (props.user && props.user.username !== "") ? <Profile /> :(<Redirect to="/login" />)
            }} />
            <Route path='/restaurant' render={() => { 
              var props =store.getState();
              return (props.user && props.user.username !== "") ? <RestaurantManager /> :(<Redirect to="/login" />)
            }} /> 
            <Route path='/customerOrders' render={() => { 
              var props =store.getState();
              return (props.user && props.user.username !== "" && props.user.type === 'c') ? <CustomerOrder /> :(<Redirect to="/login" />)
            }} />
            <Route path='/ownerOrders' render={() => { 
              var props =store.getState();
              return (props.user && props.user.username !== "" && props.user.type === 'o') ? <CustomerOrder /> :(<Redirect to="/login" />)
            }} />
          </Switch>
    </Router>
  );
}

export default App;
