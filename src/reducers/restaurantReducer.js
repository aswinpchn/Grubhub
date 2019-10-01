const initialState = { 
    name : '',
    zip : '',
    error : '',
    cuisine : '',
    id : '',
    ownerid : '',
};

const restaurantReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'RESTAURANT_FETCH_SUCCESS' : 
            return Object.assign({}, state, {
                name : action.payload.name,
                zip : action.payload.zip,
                cuisine : action.payload.cuisine,
                id : action.payload.id,
                ownerid : action.payload.ownerid,
                error : '',
            });
        case 'RESTAURANT_FETCH_FAILURE' :
            return Object.assign({}, state, {
                name : '',
                zip : '',
                cuisine : '',
                id : '',
                ownerid : '',
                error : action.payload.error,
              });
        default :
            return state;
    }
};

export default restaurantReducer;