import axios from 'axios';
import { URL } from '../constants';
import cookie from 'react-cookies';

const tryFetchingOwnedRestaurant = (ownerid) => {
    return axios.get(`${URL}/restaurant/owner/${ownerid}`,  {headers: {
        "Authorization" : `Bearer ${cookie.load('cookie')}`
      }
    });
};

const tryFetchingMatchingRestaurants = (keyword) => {
    return axios.get(`${URL}/restaurant/search/${keyword}`, {headers: {
        "Authorization" : `Bearer ${cookie.load('cookie')}`
      }
    });
}

const tryFetchTopRestaurants = () => {
    return axios.get(`${URL}/restaurant`, {headers: {
        "Authorization" : `Bearer ${cookie.load('cookie')}`
      }
    });
}

const tryFetchingOrdersForRestaurant = (restaurantId) => {
    return axios.get(`${URL}/restaurant/${restaurantId}/orders`,  {headers: {
        "Authorization" : `Bearer ${cookie.load('cookie')}`
      }
    });
}

const tryFetchingItems = (restaurantId) => {
    return axios.get(`${URL}/restaurant/${restaurantId}/menu`,  {headers: {
        "Authorization" : `Bearer ${cookie.load('cookie')}`
      }
    });
}

const fetchOrdersForRestaurantSuccess = (orders) => {
    return {
        type: 'ORDERS_FETCH_SUCCESS',
        payload: {
            orders: orders
        }
    }
}

const fetchOrdersForRestaurantFailure = () => {
    return {
        type: 'ORDERS_FETCH_FAILURE',
        payload: {
            error: 'No orders to display'
        }
    }
}

const fetchingOwnedRestaurantSuccess = (restaurants) => {
    return {
        type : 'RESTAURANT_FETCH_SUCCESS',
        payload : {
            restaurants : restaurants
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
    return {
        type: 'FETCH_MATCHING_RESTAURANTS_FAILURE',
        payload: {
            errorSearch: 'No restaurants found!'
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

const fetchItemsSuccess = (response) => {
    return {
        type: 'FETCH_ITEMS_SUCCESS',
        payload: {
            restaurantId: response.items[0].restaurantId,
            items: response.items
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

const logOutTrigger = () => {
    return {
        type : 'LOG_OUT'
    }
}

export const fetchOwnedRestaurantTrigger = (ownerid) => {
    return dispatch => {
      return tryFetchingOwnedRestaurant(ownerid).then(response => {
          dispatch(fetchingOwnedRestaurantSuccess(response.data));
          dispatch(fetchRestaurantOrdersTrigger(response.data.id));
      }).catch(error => {
          dispatch(fetchingOwnedRestaurantFailure(error));
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

export const logOut = () => {
    return dispatch => {
        dispatch(logOutTrigger())
    }
}

export const fetchRestaurantOrdersTrigger = (restaurantId) => {
    console.log(restaurantId);
    return dispatch => {
        return tryFetchingOrdersForRestaurant(restaurantId).then(response => {
            dispatch(fetchOrdersForRestaurantSuccess(response.data))
        }).catch((error) => {
            console.log(error);
            dispatch(fetchOrdersForRestaurantFailure())
        })
    }
}