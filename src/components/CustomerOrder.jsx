import React from 'react';
import Header from './Header';
import { connect } from 'react-redux';
import { Card, Pagination } from 'react-bootstrap';
import { getCustomerOrderTrigger } from '../actions/order-actions';

class CustomerOrder extends React.Component {
    constructor(props) {
        super(props);
        this.renderCustomerOrders = this.renderCustomerOrders.bind(this);
        this.renderItems = this.renderItems.bind(this);
        this.renderOrderList = this.renderOrderList.bind(this);
        this.handleOrderSelect = this.handleOrderSelect.bind(this);
        this.state = {
            selectedOrderId: '',
            activePage: 1
        };
        this.renderPagination = this.renderPagination.bind(this);
        this.pageClicked  = this.pageClicked.bind(this);
    }

    componentDidMount () {
        if(this.props.user && this.props.user.id) {
            this.props.getCustomerOrderTrigger(this.props.user.id);
        }
    }

    handleOrderSelect(id) {
        this.setState({
            selectedOrderId: id
        });
    }

    renderItems(id, orderDetails) {
        if(this.state.selectedOrderId === id) {
            return(
                orderDetails.map((item) => 
                    <Card className="shadow bg-white rounded" key={item._id}>
                        <Card.Body className="item-card">
                            <Card.Title className="item-name">Item name : {item.name}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted"><span className="order-contents">Price : {item.price} </span><span className="order-contents"> Quantity : {item.quantity}</span></Card.Subtitle>
                        </Card.Body>
                    </Card>
               )
            )
        }
    }

    pageClicked(pageNumber) {
        this.setState({
            activePage: pageNumber,
        });
    }

    renderPagination() {
        let items = [];
        for (let number = 1; number <= Math.ceil(this.props.order.customerOrder.orders.length / 10); number++) {
            items.push(
                <Pagination.Item key={number} active={number === this.state.activePage} onClick={() => this.pageClicked(number)}>
                {number}
                </Pagination.Item>,
            );
        }
        if(items.length > 0)
            return(
                <Pagination>{items}</Pagination>
            )
    }

    renderOrderList(customerOrders) {
        const ordersInPageSelected = customerOrders.orders.slice((this.state.activePage-1)*10, this.state.activePage*10);

        return ordersInPageSelected.map((order) => 
        <>
            <Card className="shadow bg-white rounded" style={{height: "5rem"}} key={order._id} onClick={() => this.handleOrderSelect(order._id)}>
                <Card.Body>
                    <Card.Title>Restaurant name : {order.restaurantid}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted"><span className="order-contents">Time : {new Date(Date.parse(order.ordertime)).toDateString()}</span><span className="order-contents">Status : {order.status}</span></Card.Subtitle>
                </Card.Body>
            </Card>
            <div className="item-list">
                {this.renderItems(order._id, order.orderDetails)}
            </div>
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
            {this.renderPagination()}
            {this.renderOrderList(customerOrders)}
            </>);
        }
    }

    render() {
        if(this.props.user && this.props.user.name !== '' && (this.props.order.ordergetStatus === false || this.props.order.customerOrder)) {
            return(
                <div>
                    <Header userDetails={this.props.user} className="customer-orders" />
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