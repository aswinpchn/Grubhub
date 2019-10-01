import axios from 'axios';

const tryFetchingRestaurant = (ownerid) => {
    return axios.get(`http://localhost:3001/restaurant/${ownerid}`);
};

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



export const restaurantFetchTrigger = (ownerid) => {
    return dispatch => {
      return tryFetchingRestaurant(ownerid).then(response => {
          dispatch(fetchingRestaurantSuccess(response.data.id, response.data.name, response.data.zip, response.data.cuisine, ownerid));
      }).catch(error => {
          dispatch(fetchingRestaurantFailure(error.response.statusText));
      });
    };
  }