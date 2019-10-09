import React from 'react';
import Header from './Header';
import { connect } from 'react-redux';
import { Card, Alert, Form } from 'react-bootstrap';
import { getCustomerOrderTrigger } from '../actions/order-actions';

class CustomerOrder extends React.Component {
    constructor(props) {
        super(props);
        this.renderCustomerOrders = this.renderCustomerOrders.bind(this);
        this.renderItems = this.renderItems.bind(this);
        this.renderOrderList = this.renderOrderList.bind(this);
        this.state = {
            selectedOrderId: ''
        };
    }

    componentDidMount () {
        if(this.props.user && this.props.user.id) {
            this.props.getCustomerOrderTrigger(this.props.user.id);
        }
    }

    handleOrderSelect(event) {
        this.setState({
            selectedOrderId: event.target.id
        });
    }

    renderItems(id, menu) {
        if(this.state.selectedOrderId === id) {
            return(
               menu.map((item) => 
                    <Card className="shadow bg-white rounded" key={item.id}>
                        <Card.Body>
                            <Card.Title>Item name : {menu.name}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">Price : {item.price}</Card.Subtitle>
                            <Card.Subtitle className="mb-2 text-muted">Quantity : {item.quantity}</Card.Subtitle>
                        </Card.Body>
                    </Card>
               )
            )
        }
    }

    renderOrderList(customerOrders) {
        return customerOrders.orders.map((order) => 
        <>
            <Card className="shadow bg-white rounded" key={order.id} onClick={() => this.handleOrderSelect(order.id)}>
                <Card.Body>
                    <Card.Title>Restaurant name : {order.restaurantname}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Time : {Date.parse(order.ordertime).toDateString()}</Card.Subtitle>
                    <Card.Subtitle className="mb-2 text-muted">Status : {order.status}</Card.Subtitle>
                </Card.Body>
            </Card>
            {this.renderItems(order.id, order.menu)}
        </>
    );
    }

    renderCustomerOrders () {
        let customerOrders = this.props.order.customerOrder;
        if(customerOrders.numberoforders === 0) {
            return <div>
                    No orders for {this.props.user.name}
                </div>;
        } else {
            // Customer static order display here.
            return(<>
            <span>{customerOrders.numberoforders} order(s)</span>
            {this.renderOrderList(customerOrders)}
            </>);
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