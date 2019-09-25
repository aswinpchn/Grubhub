import axios from 'axios';

const getLogin = (username, password) => {
    axios.defaults.withCredentials = true;

    return axios.post('http://localhost:3001/user/login', {
        email : username,
        password : password
    });
}

const loginSuccess = (username, password) => {
    return {
        type : 'LOGIN_SUCCESS',
        payload : {
            username : username,
            password : password
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

export const loginTrigger = (username, password) => {
    //console.log(username);
    return dispatch => {
      return getLogin(username, password).then(response => {
          dispatch(loginSuccess(username, password));
      }).catch(error => {
          dispatch(loginFailure(error));
      });
    };
  }