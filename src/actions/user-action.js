import axios from 'axios';
import { URL } from '../constants';

const getLogin = (username, password, type) => {
    axios.defaults.withCredentials = true;
    return axios.post(`${URL}/user/login`, {
        email : username,
        password : password,
        type : type,
    });
}

const updateUser = (user) => {
    axios.defaults.withCredentials = true;

    return axios.post(`${URL}/user/`, {
        email : user.email,
        name : user.name,
        password : user.password,
        phone : user.phone,
        type : user.type,
    });
}

const doSignUp = (user) => {
	axios.defaults.withCredentials = true;
	if(user.accountType === 'buyer') {
		return axios.put(`${URL}/user/customerSignUp`, {
			name : user.name,
			email : user.email,
			password : user.password,
			phone : user.phone,
			type : 'c',
			image : 'http://google.com'
		});
	} else {
		return axios.put(`${URL}/user/ownerSignUp`, {
			name : user.name,
			email : user.email,
			password : user.password,
			phone : user.phone,
			type : 'o',
			image : 'http://google.com',
			zip : user.zip,
			restaurantname : user.restaurantname,
			cuisine : user.cuisine,
		});
	}
}

const signUpSuccess = (status) => {
	return {
		type : 'SIGNUP_SUCCESS',
		payload : {
			status : status,
		}
	}
}

const signUpFailure = (status) => {
	return {
		type : 'SIGNUP_FAILURE',
		payload : {
			status : status,
		}
	}
}

const loginSuccess = (username, password, name, phone, type, image, id) => {
    return {
        type : 'LOGIN_SUCCESS',
        payload : {
            username : username,
            password : password,
            name : name,
            phone : phone,
            type : type,
            image : image,
            id : id,
        }
    }
}

const loginFailure = (error) => {
    return {
        type : 'LOGIN_FAILURE',
        payload : {
            error : error
        }
    }
}

const updateSuccess = (username, password, name, phone, type, image, id) => {
    return {
        type : 'UPDATE_SUCCESS',
        payload : {
            username : username,
            password : password,
            name : name,
            phone : phone,
            type : type,
            image : image,
            id : id,
        }
    }
}

const updateFailure = (error) => {
    return {
        type : 'UPDATE_FAILURE',
        payload : {
            error : error
        }
    }
}

const logOutTrigger = () => {
    return {
        type : 'LOG_OUT'
    }
}

export const loginTrigger = (username, password, type) => {
    return dispatch => {
      return getLogin(username, password, type).then(response => {
          dispatch(loginSuccess(username, password, response.data.name, response.data.phone, response.data.type, response.data.image, response.data.id));
      }).catch(error => {
          console.log(error);
          dispatch(loginFailure('Something went wrong! Please try again later'));
      });
    };
  }

export const updateTrigger = (user) => {
    console.log(user);
    return dispatch => {
        return updateUser(user).then(response => {
            console.log(response);
            dispatch(updateSuccess(user.email, user.password, user.name, user.phone, user.type, "http://google.com", user.id));
        }).catch(error => {
            console.log(error);
            dispatch(updateFailure('Something went wrong! Please try again later'));
        });
      };
}

export const logOut = () => {
    return dispatch => {
        dispatch(logOutTrigger())
    }
}

export const signUp = (user) => {
	return dispatch => {
		return doSignUp(user).then(response => {
			dispatch(signUpSuccess(response.data + 'Go to login page'));
		}).catch(error => {
			console.log(error.response);
			dispatch(signUpFailure(error.response.data + 'Try again'));
		});
	};
}

// https://github.com/reduxjs/redux-thunk
// Redux Thunk middleware allows you to write action creators that return a function instead of an action. The thunk can be used to delay the dispatch of an action, or to dispatch only if a certain condition is met. The inner function receives the store methods dispatch and getState as parameters.