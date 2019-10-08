import React from 'react';
import Header from './Header';
import { connect } from 'react-redux';
import { Card, Alert, Form } from 'react-bootstrap';
import Items from './Items';
import { getCustomerOrderTrigger } from '../actions/order-actions';

class CustomerOrder extends React.Component {
    constructor(props) {
        super(props);

        this.renderCustomerOrders = this.renderCustomerOrders.bind(this);
    }

    componentDidMount () {
        console.log('came in');
        console.log(this.props);
        if(this.props.user && this.props.user.id) {
            this.props.getCustomerOrderTrigger(this.props.user.id);
        }
    }

    renderCustomerOrders () {
        let customerOrders = this.props.order.customerOrder;
        if(customerOrders.numberoforders === 0) {
            return <div>
                    No orders for {this.props.user.name}
                </div>;
        } else {
            // Customer static order display here.
            return <div>
                    
                </div>;
        }
    }

    render() {
        if(this.props.user && this.props.user.name !== '' && (this.props.order.ordergetStatus === false || this.props.order.customerOrder)) {
            return(
                <div>
                    <Header userDetails={this.props.user} className="CustomerOrders" />
                    {this.props.order.ordergetStatus === false ? <div>Order fetching failed</div> : this.renderCustomerOrders()}
                </div>
            );
        } else { 
            return (<div className="loader"></div>);
        }
    };
}

const mapStateToProps = (state) => {
    return {
        order : state.order,
        user : state.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getCustomerOrderTrigger : (userid) => {
            dispatch(getCustomerOrderTrigger(userid));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerOrder);