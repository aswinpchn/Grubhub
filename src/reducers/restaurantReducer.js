const restaurantReducer = (state = {}, action) => {
    switch(action.type) {
        case 'RESTAURANT_FETCH_SUCCESS' : 
            return Object.assign({}, state, {
                restaurants : action.payload.restaurants,
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
                errorSearch : '',
                foundMatching: true,
            })
        case 'FETCH_TOP_RESTAURANTS_FAILURE':
        case 'FETCH_MATCHING_RESTAURANTS_FAILURE':
            return Object.assign({}, state, {
                restaurants: [],
                errorSearch : action.payload.errorSearch
            })
        case 'FETCH_ITEMS_SUCCESS':
            return Object.assign({}, state, {
                selectedRestaurant: {
                    restaurantId: action.payload.restaurantId,
                    items: action.payload.items
                }
            })
        case 'CLOSE_ITEMS':
            return Object.assign({}, state, {
                selectedRestaurant: {}
            })
        case 'LOG_OUT':
            return Object.assign({}, {})
        default :
            return state;
    }
};

export default restaurantReducer;