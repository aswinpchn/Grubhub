const initialState = { 
    username : '',
    password : '',
    error : '',
    name : '',
    phone : '',
    type : '',
    image : '',
    dbprocess : false,
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
                id : action.payload.id,
                zipCode: action.payload.zipCode,
                error : '',
                dbprocess : false,
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
                dbprocess : false
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
                dbprocess : false,
            });
        case 'UPDATE_FAILURE' :
            return Object.assign({}, state, {
                error : action.payload.error,
                dbprocess : false
            });
        case 'DB_PROCESS_STARTED' : 
            return Object.assign({}, state, { dbprocess : true});
        case 'DB_PROCESS_ENDED' : 
            return Object.assign({}, state, { dbprocess : false});  
        default:
            return state;
    }
};

export default userReducer;