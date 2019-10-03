const restaurantReducer = (state = {}, action) => {
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
        case 'FETCH_TOP_RESTAURANTS_SUCCESS': {
            return Object.assign({}, state, {
                restaurants: action.payload.restaurants,
                foundMatching: false,
            })
        }
        case 'FETCH_MATCHING_RESTAURANTS_SUCCESS':
            return Object.assign({}, state, {
                restaurants: action.payload.restaurants,
                error: '',
                foundMatching: true,
            })
        case 'FETCH_TOP_RESTAURANTS_FAILURE':
        case 'FETCH_MATCHING_RESTAURANTS_FAILURE':
            return Object.assign({}, state, {
                restaurants: [],
                error: action.payload.error
            })
        default :
            return state;
    }
};

export default restaurantReducer;