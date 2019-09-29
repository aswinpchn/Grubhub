const initialState = { 
    username : '',
    password : '',
    error : '',
    name : '',
    phone : '',
    type : '',
    image : '',
};

const userReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'LOGIN_SUCCESS' : 
            return Object.assign({}, state, {
                username : action.payload.username,
                password : action.payload.password,
                name : action.payload.name,
                phone : action.payload.phone,
                type : action.payload.type,
                image : action.payload.image,
                error : '',
            });
        case 'LOGIN_FAILURE' :
            return Object.assign({}, state, {
                error : action.payload.error,
                username : '',
                password : '',
                name : '',
                phone : '',
                type : '',
                image : '',
            });
        default:
            return state;
    }
};

export default userReducer;