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
        default : 
            return state;
    }
};

export default orderReuducer;
