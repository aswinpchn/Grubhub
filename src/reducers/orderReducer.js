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
        default : 
            return state;
    }
};

export default orderReuducer;
