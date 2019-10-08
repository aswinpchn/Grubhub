import axios from 'axios';
import { URL } from '../constants';

const tryCreatingOrder = (request) => {
    axios.defaults.withCredentials = true;
    return axios.put(`${URL}/order/`, request);
};

const tryGettingCustomerOrder = (userid) => {
    return axios.get(`${URL}/user/${userid}/orders`);
}

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
    console.log(userid);
    return dispatch => {
        return tryGettingCustomerOrder(userid).then((response) => {
            dispatch(getCustomerOrderSuccess(response.data));
        }).catch((error) => {
            dispatch(getCustomerOrderFailure());
        });
    };
};