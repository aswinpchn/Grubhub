import axios from 'axios';

const tryFetchingOwnedRestaurant = (ownerid) => {
    return axios.get(`http://localhost:3001/restaurant/owner/${ownerid}`);
};

const tryFetchingMatchingRestaurants = (keyword) => {
    return axios.get(`http://localhost:3001/restaurant/search/${keyword}`);
}

const tryFetchTopRestaurants = (keyword) => {
    return axios.get(`http://localhost:3001/restaurant`);
}

const tryFetchingOrdersForRestaurant = (restaurantId) => {
    return axios.get(`http://localhost:3001/restaurant`);
}

const tryFetchingItems = (restaurantId) => {
    return axios.get(`http://localhost:3001/restaurant/${restaurantId}/menu`);
}

const fetchingOwnedRestaurantSuccess = (id, name, zip, cuisine, ownerid) => {
    return {
        type : 'RESTAURANT_FETCH_SUCCESS',
        payload : {
            name : name,
            zip : zip,
            cuisine : cuisine,
            id : id,
            ownerid : ownerid,
        }
    }
}

const fetchingOwnedRestaurantFailure = (error) => {
    return {
        type : 'RESTAURANT_FETCH_FAILURE',
        payload : {
            error : 'Something went wrong! Pleasw try again later'
        }
    }
}

const fetchMatchingRestaurantsSuccess = (restaurants) => {
    return {
        type: 'FETCH_MATCHING_RESTAURANTS_SUCCESS',
        payload: {
            restaurants: restaurants
        }
    }
}

const fetchMatchingRestaurantsFailure = () => {
    console.log("error inside");
    return {
        type: 'FETCH_MATCHING_RESTAURANTS_FAILURE',
        payload: {
            error: 'No restaurants found!'
        }
    }
}

const fetchTopRestaurantsSuccess = (restaurants) => {
    return {
        type: 'FETCH_TOP_RESTAURANTS_SUCCESS',
        payload: {
            restaurants: restaurants
        }
    }
}

const fetchItemsSuccess = (items) => {
    console.log(items);
    return {
        type: 'FETCH_ITEMS_SUCCESS',
        payload: {
            restaurantId: items[0].restaurantid,
            items: items
        }
    }
}

const fetchTopRestaurantsFailure = () => {
    return {
        type: 'FETCH_TOP_RESTAURANTS_FAILURE',
        payload: {
            error: 'Something Went Wrong!'
        }
    }
}

const fetchItemsFailure = () => {
    return {
        type: 'FETCH_ITEMS_FAILURE',
        payload: {
            error: 'Restaurant not serving at the moment! Please try later'
        }
    }
}

const closeItemsTrigger = () => {
    return {
        type: 'CLOSE_ITEMS',
    }
}

export const fetchOwnedRestaurantTrigger = (ownerid) => {
    return dispatch => {
      return tryFetchingOwnedRestaurant(ownerid).then(response => {
          dispatch(fetchingOwnedRestaurantSuccess(response.data.id, response.data.name, response.data.zip, response.data.cuisine, ownerid));
      }).catch(error => {
          dispatch(fetchingOwnedRestaurantFailure(error.response.statusText));
      });
    };
  }

export const fetchTopRestaurantsTrigger = () => {
    return dispatch => {
        return tryFetchTopRestaurants().then(response => {
            dispatch(fetchTopRestaurantsSuccess(response.data))
        }).catch(() => {
            dispatch(dispatch(fetchTopRestaurantsFailure()))
        });
    }
}

export const fetchMatchingRestaurantsTrigger = (keyword) => {
    return dispatch => {
        return tryFetchingMatchingRestaurants(keyword).then(response => {
            if(response.data.length === 0) {
                dispatch(fetchMatchingRestaurantsFailure())
                dispatch(fetchTopRestaurantsTrigger())
            } else
                dispatch(fetchMatchingRestaurantsSuccess(response.data))
        }).catch(() => {
            dispatch(fetchMatchingRestaurantsFailure())
        });
    }
}

export const fetchItemsTrigger = (restaurantId) => {
    return dispatch => {
        return tryFetchingItems(restaurantId).then(response => {
            if(response.data.length === 0) {
                dispatch(fetchItemsFailure())
            } else
                dispatch(fetchItemsSuccess(response.data))
        }).catch((error) => {
            console.log(error);
            dispatch(fetchItemsFailure())
        })
    }
}

export const triggerCloseItems = () => {
    return dispatch => {
        dispatch(closeItemsTrigger())
    }
}