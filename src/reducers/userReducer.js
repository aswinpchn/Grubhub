const initialState = { 
    username : '',
    password : '',
    profile : {},
    error : ''
};

const userReducer = (state = initialState, action) => {
    console.log(action);
    switch(action.type) {
        case 'LOGIN_SUCCESS' : 
            return Object.assign({}, state, {
                username : action.payload.username,
                password : action.payload.password,
                error : ''
            });
        case 'LOGIN_FAILURE' :
            return Object.assign({}, state, {
                error : action.payload.error,
                username : '',
                password : ''
            });
        default:
            return state;
    }
};

export default userReducer;