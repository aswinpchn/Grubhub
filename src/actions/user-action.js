import axios from 'axios';

const getLogin = (username, password, type) => {
    axios.defaults.withCredentials = true;
    
    return axios.post('http://localhost:3001/user/login', {
        email : username,
        password : password,
        type : type,
    });
}

const loginSuccess = (username, password, name, phone, type, image) => {
    return {
        type : 'LOGIN_SUCCESS',
        payload : {
            username : username,
            password : password,
            name : name,
            phone : phone,
            type : type,
            image : image,
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

const dbProcessStarted = () => { // To maintain a state for tracking if any action is in process.
    return {
        type : 'DB_PROCESS_STARTED',
    }
}

const dbProcessEnded = () => {
    return {
        type : 'DB_PROCESS_ENDED',
    }
}

export const loginTrigger = (username, password, type) => {
    return dispatch => {
      return getLogin(username, password, type).then(response => {
          dispatch(loginSuccess(username, password, response.data.name, response.data.phone, response.data.type, response.data.image));
      }).catch(error => {
          dispatch(loginFailure(error.response.statusText));
      });
    };
  }