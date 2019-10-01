import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import userReducer from './reducers/userReducer';
import cookie from 'react-cookies';
import { loginTrigger } from './actions/user-action';
import restaurantReducer from './reducers/restaurantReducer';

// It will come once you come through the URL, when you start from a point and continue through redirects/links, this wont be triggered.

const rootReducer = combineReducers ({
    user : userReducer,
    restaurant : restaurantReducer,
});

const store = createStore(
    rootReducer, 
    compose(
        applyMiddleware(thunk),
        window.devToolsExtension ? window.devToolsExtension() : f => f
    )
);

// store.dispatch({
//     type : 'LOGIN_SUCCESS',
//     payload : {
//         username : 'aswinp',
//         password : '12345'
//     }
// });

if(cookie.load('cookie')){ // If cookie is there and reload happens, it comes here and we do manual dispatch. and store data in store.
    let c = cookie.load('cookie');
    let promise = store.dispatch(loginTrigger(c.username, c.password, c.type));  // we think password wouldnt be changed in meantime of reload, so we are easy on checks.
    promise.then(() => {
        ReactDOM.render(<Provider store={store}>
            <App store={store} />
        </Provider>, document.getElementById('root'));
    }).catch(() => {

    });
} else {
    ReactDOM.render(<Provider store={store}>
        <App store={store} />
    </Provider>, document.getElementById('root'));
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
