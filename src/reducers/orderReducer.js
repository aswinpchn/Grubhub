const orderReuducer = (state = {}, action) => {
    switch(action.type) {
        case 'ORDER_CREATION_SUCCESS' : 
            return Object.assign({}, state, {
                orderPlacingStatus : action.payload.orderPlacingStatus
            });
        case 'ORDER_CREATION_FAILURE' : 
            return Object.assign({}, state, {
                orderPlacingStatus : action.payload.orderPlacingStatus
            });
        case 'CUSTOMER_ORDER_GET_SUCCESS' : 
            return Object.assign({}, state, {
                customerOrder : action.payload.response,
                orderGetStatus : true
            });
        case 'CUSTOMER_ORDER_GET_FAILURE' : 
            return Object.assign({}, state, {
                customerOrder : '',
                orderGetStatus : false
            });
        case 'ORDERS_FETCH_SUCCESS': {
            return Object.assign({}, state, {
                orders: action.payload.orders
            });
        }
        case 'ORDERS_FETCH_FAILURE': {
            return Object.assign({}, state, {
                error: action.payload.error
            });
        }
        case 'ORDER_UPDATE_SUCCESS': {
            return Object.assign({}, state, {
                orders: action.payload.orders
            });
        }
        case 'ORDER_UPDATE_FAILURE': {
            return Object.assign({}, state, {
                error: action.payload.error
            });
        }
        default : 
            return state;
    }
};

export default orderReuducer;
