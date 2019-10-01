import axios from 'axios';

const getLogin = (username, password, type) => {
    axios.defaults.withCredentials = true;
    
    return axios.post('http://localhost:3001/user/login', {
        email : username,
        password : password,
        type : type,
    });
}

const updateUser = (user) => {
    axios.defaults.withCredentials = true;

    return axios.post('http://localhost:3001/user/', {
        email : user.email,
        name : user.name,
        password : user.password,
        phone : user.phone,
        type : user.type,
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

const updateSuccess = (username, password, name, phone, type, image) => {
    return {
        type : 'UPDATE_SUCCESS',
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

const updateFailure = (error) => {
    return {
        type : 'UPDATE_FAILURE',
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
          console.log(error);
          dispatch(loginFailure(error.response.statusText));
      });
    };
  }

export const updateTrigger = (user) => {
    console.log(user);
    return dispatch => {
        return updateUser(user).then(response => {
            console.log(response);
            dispatch(updateSuccess(user.email, user.password, user.name, user.phone, user.type, "google.com"));
        }).catch(error => {
            console.log(error);
            dispatch(updateFailure(error.response.statusText));
        });
      };
}