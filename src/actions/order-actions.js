import axios from 'axios';
import { URL } from '../constants';

const tryCreatingOrder = (request) => {
    axios.defaults.withCredentials = true;
    return axios.put(`${URL}/order/`, request);
};

const createOrderSuccess = () => {
    return {
        type : 'ORDER_CREATION_SUCCESS',
        payload : {
            orderPlacingStatus : 'true'
        },
    }
};

const createOrderFailure = () => {
    return {
        type : 'ORDER_CREATION_FAILURE',
        payload : {
            orderPlacingStatus : 'false'
        },
    }
};

export const createOrderTrigger = (request) => {
    return dispatch => {
        return tryCreatingOrder(request).then((response) => {
            dispatch(createOrderSuccess(request));
        }).catch((error) => {
            dispatch(createOrderFailure());
        });
    };
};