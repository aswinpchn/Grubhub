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
                password : action.payload.password
            });
        case 'LOGIN_FAILURE' :
            return Object.assign({}, state, {
                error : action.payload.error
            });
        default:
            return state;
    }
};

export default userReducer;