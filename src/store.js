import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import restaurantReducer from './reducers/restaurantReducer';
import userReducer from './reducers/userReducer';
import thunk from 'redux-thunk';

const rootReducer = combineReducers ({
    user : userReducer,
    restaurant : restaurantReducer,
});

export const store = createStore(
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