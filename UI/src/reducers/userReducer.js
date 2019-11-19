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

        case 'SIGNUP_SUCCESS' :
            return Object.assign({}, state, {
                status : action.payload.status,
            });
        
        case 'SIGNUP_FAILURE' :
            return Object.assign({}, state, {
                status : action.payload.status,
            });

        case 'LOGIN_SUCCESS' : 
            return Object.assign({}, state, {
                username : action.payload.username,
                password : action.payload.password,
                name : action.payload.name,
                phone : action.payload.phone,
                type : action.payload.type,
                image : action.payload.image,
                id : action.payload.id,
                zipCode: action.payload.zipCode,
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
                id : '',
            });
        case 'UPDATE_SUCCESS' : 
            return Object.assign({}, state, {
                username : action.payload.username,
                password : action.payload.password,
                name : action.payload.name,
                phone : action.payload.phone,
                type : action.payload.type,
                image : action.payload.image,
                id : action.payload.id,
                error : '',
            });
        case 'UPDATE_FAILURE' :
            return Object.assign({}, state, {
                error : action.payload.error,
            }); 
        case 'LOG_OUT':
                return Object.assign({}, {})
        default:
            return state;
    }
};

export default userReducer;