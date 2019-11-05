import axios from 'axios';
import { URL } from '../constants';
import { fetchRestaurantOrdersTrigger } from './restaurant-action';
import cookie from 'react-cookies';

const tryCreatingOrder = (request) => {
    axios.defaults.withCredentials = true;
    return axios.put(`${URL}/order/`, request, {headers: {
        "Authorization" : `Bearer ${cookie.load('cookie')}`
      }
    });
};

const tryGettingCustomerOrder = (userid) => {
    return axios.get(`${URL}/user/${userid}/orders`, {headers: {
        "Authorization" : `Bearer ${cookie.load('cookie')}`
      }
    });
}

const tryUpdatingOrderStatus = (orderId, request) => {
    console.log(request);
    return axios.post(`${URL}/order/${orderId}`, request, {headers: {
        "Authorization" : `Bearer ${cookie.load('cookie')}`
      }
    });
}

const updateOrderStatusFailure = () => {
    return {
        type : 'ORDER_UPDATE_FAILURE',
        payload : {
            error: 'Something Went wrong!'
        },
    }
};

const createOrderSuccess = () => {
    return {
        type : 'ORDER_CREATION_SUCCESS',
        payload : {
            orderPlacingStatus : true
        },
    }
};

const createOrderFailure = () => {
    return {
        type : 'ORDER_CREATION_FAILURE',
        payload : {
            orderPlacingStatus : false
        },
    }
};

const getCustomerOrderSuccess = (response) => {
    return {
        type : 'CUSTOMER_ORDER_GET_SUCCESS',
        payload : {
            response : response,
        }
    }
}

const getCustomerOrderFailure = (response) => {
    return {
        type : 'CUSTOMER_ORDER_GET_FAILURE',
        payload : {
            
        }
    }
}

export const createOrderTrigger = (request) => {
    return dispatch => {
        return tryCreatingOrder(request).then((response) => {
            dispatch(createOrderSuccess(response));
        }).catch((error) => {
            dispatch(createOrderFailure());
        });
    };
};

export const getCustomerOrderTrigger = (userid) => {
    return dispatch => {
        return tryGettingCustomerOrder(userid).then((response) => {
            dispatch(getCustomerOrderSuccess(response.data));
        }).catch((error) => {
            dispatch(getCustomerOrderFailure());
        });
    };
};

export const updateOrderStatusTrigger = (orderId, restaurantId, status) => {
    return dispatch => {
        return tryUpdatingOrderStatus(orderId, { 'status': status }).then((response) => {
            dispatch(fetchRestaurantOrdersTrigger(restaurantId));
        }).catch((error) => {
            dispatch(updateOrderStatusFailure());
        });
    };
}