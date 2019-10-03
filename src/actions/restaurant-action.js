import axios from 'axios';

const tryFetchingRestaurant = (ownerid) => {
    return axios.get(`http://localhost:3001/restaurants/${ownerid}`);
};

const tryFetchingMatchingRestaurants = (keyword) => {
    return axios.get(`http://localhost:3001/restaurant/search/${keyword}`);
}

const tryFetchTopRestaurants = (keyword) => {
    return axios.get(`http://localhost:3001/restaurant`);
}

const fetchingRestaurantSuccess = (id, name, zip, cuisine, ownerid) => {
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

const fetchingRestaurantFailure = (error) => {
    return {
        type : 'RESTAURANT_FETCH_FAILURE',
        payload : {
            error : error
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

const fetchTopRestaurantsFailure = () => {
    return {
        type: 'FETCH_TOP_RESTAURANTS_FAILURE',
        payload: {
            error: 'Something Went Wrong!'
        }
    }
}

export const restaurantFetchTrigger = (ownerid) => {
    return dispatch => {
      return tryFetchingRestaurant(ownerid).then(response => {
          dispatch(fetchingRestaurantSuccess(response.data.id, response.data.name, response.data.zip, response.data.cuisine, ownerid));
      }).catch(error => {
          dispatch(fetchingRestaurantFailure(error.response.statusText));
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
            if(response.data.length == 0) {
                dispatch(fetchMatchingRestaurantsFailure())
                dispatch(fetchTopRestaurantsTrigger())
            } else
                dispatch(fetchMatchingRestaurantsSuccess(response.data))
        }).catch(() => {
            dispatch(fetchMatchingRestaurantsFailure())
        });
    }
}