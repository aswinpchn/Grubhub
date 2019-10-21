import React from 'react';
import Header from './Header';
import { connect } from 'react-redux';
import { fetchOwnedRestaurantTrigger, fetchTopRestaurantsTrigger, fetchMatchingRestaurantsTrigger, fetchItemsTrigger, triggerCloseItems, fetchRestaurantOrdersTrigger } from  './../actions/restaurant-action';
import { updateOrderStatusTrigger } from '../actions/order-actions';
import { Card, Alert, Form } from 'react-bootstrap';
import Items from './Items';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            selectedOrderId: ''
        }
        this.renderRestaurantList = this.renderRestaurantList.bind(this);
        this.renderErrorMessage = this.renderErrorMessage.bind(this);
        this.handleRestaurantSelect = this.handleRestaurantSelect.bind(this);
        this.renderOrderItems = this.renderOrderItems.bind(this);
        this.handleStatusUpdate = this.handleStatusUpdate.bind(this);
    }

    renderErrorMessage() {
        if(this.props.error) {
            return(
                <Alert className="alert" variant='secondary'>{this.props.error}</Alert>
            )
        }
    }

    handleRestaurantSelect(restaurantId) {
        if(this.props.selectedRestaurant && restaurantId === this.props.selectedRestaurant.restaurantId)
            this.props.triggerCloseItems();
        else
            this.props.fetchItemsTrigger(restaurantId);
    }

    handleStatusUpdate(orderId, status) {
        this.props.updateOrderStatus(orderId, this.props.restaurants.id, status);
    }

    renderItems(restaurantId) {
        if(this.props.selectedRestaurant)
        return (
            <Items items={this.props.selectedRestaurant.items} userDetails={this.props.user.id} restaurantDetails={restaurantId} />  // If parent updates(re-renders), child will also re-render, it wont unmount and mount again, it will just re-render.
        )
    }

    renderOrderItems(id, menu) {
        if(this.state.selectedOrderId === id) {
            return(
               menu.map((item) => 
                    <Card className="shadow bg-white rounded" key={item.id}>
                        <Card.Body className="item-card">
                            <Card.Title className="item-name">Item name : {item.name}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted"><span>Price : {item.price} </span><span> Quantity : {item.quantity}</span></Card.Subtitle>
                        </Card.Body>
                    </Card>
               )
            )
        }
    }

    renderRestaurantList() {
        if(this.props.restaurants) {
            const restaurants = this.props.restaurants.map((restaurant) => {
                    return (
                        <>
                            <Card className="shadow bg-white rounded" key={restaurant.id} onClick={() => this.handleRestaurantSelect(restaurant._id)}>
                                <Card.Body>
                                    <Card.Title>Restaurant name : {restaurant.name}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">Cuisine : {restaurant.cuisine}</Card.Subtitle>
                                </Card.Body>
                            </Card>
                            {this.renderItems(restaurant._id)}
                        </>
                    )
                });
                return restaurants;
            }
    }

    componentDidMount() {
        if(this.props.user && this.props.user.id && this.props.user.type === 'o') {
            this.props.fetchOwnedRestaurantTrigger(this.props.user.id);
        }
        else
            this.props.fetchTopRestaurantsTrigger();
    }

    handleOrderSelect(id) {
        console.log(id);
        this.setState({
            selectedOrderId: id
        });
    }

    searchRestaurant(event) {
        if(event.target.value !== '')
            this.props.fetchMatchingRestaurantsTrigger(event.target.value);
        else
            this.props.fetchTopRestaurantsTrigger();
    }

    renderOrderList(customerOrders) {
        return customerOrders.map((order) => 
        <>
            <Card className="shadow bg-white rounded" key={order.id} onClick={() => this.handleOrderSelect(order.id)}>
                <Card.Body>
                    <Card.Title>Order Id : {order.id}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                        <span className="order-contents">Time : {new Date(Date.parse(order.ordertime)).toString().split('GMT')[0]}</span>
                        <span className="order-contents">Status : {order.status}</span>
                        <span className="order-contents">
                            <button onClick={() => this.handleStatusUpdate(order.id, 'Accepted')}>Accepted</button>
                            <button onClick={() => this.handleStatusUpdate(order.id, 'Cooking')}>Cooking</button>
                            <button onClick={() => this.handleStatusUpdate(order.id, 'On the way')}>On the way</button>
                            <button onClick={() => this.handleStatusUpdate(order.id, 'Delivered')}>Delivered</button>
                            <button onClick={() => this.handleStatusUpdate(order.id, 'Cancelled')}>Cancel</button>
                        </span>
                    </Card.Subtitle>
                </Card.Body>
            </Card>
            {this.renderOrderItems(order.id, order.menu)}
        </>
    );
    }

    renderOwnerView() {
        let customerOrders = this.props.orders;
        if(customerOrders) {
            if(customerOrders.numberoforders === 0) {
                return <div>
                        No orders to display
                    </div>;
            } else {
                return(<>
                <span>{customerOrders.numberoforders} order(s)</span>
                {this.renderOrderList(customerOrders.orders)}
                </>);
            }
        }
    }

    renderCustomerView() {
        return (
            <>
                <Form.Control type="text" placeholder="Search" className="search-input" onChange={this.searchRestaurant.bind(this)} />
                {this.renderErrorMessage()}
                {this.renderRestaurantList()}
            </>
        )
    }

    render() {
        if(this.props.restaurants || this.props.error || this.props.orders) {
            return(
                <div className="home"> 
                    <Header userDetails={this.props.user} />
                    { this.props.order && this.props.order.orderPlacingStatus === true ? "Order placing success -> Go to your orders page to check out your order status" : this.props.order.orderPlacingStatus ? "Order placing failure" : "" }
                    {this.props.user && this.props.user.type === 'c' && !this.props.error ? this.renderCustomerView() : this.renderOwnerView()}
                </div>
            );
        }
        else 
            return (<div className="loader"></div>);
    }
}

const mapStateToProps = (state) => {
    return {
        user : state.user,
        restaurants: state.restaurant.restaurants, // We are reading it here still we make a page for restaurant iteslf.
        error: state.restaurant.error,
        foundMatching: state.restaurant.foundMatching,
        selectedRestaurant: state.restaurant.selectedRestaurant,
        order : state.order,
        orders: state.order.orders
    };
}

const mapDispatchToProps = (dispatch) => ({
    fetchOwnedRestaurantTrigger: (ownerid) => dispatch(fetchOwnedRestaurantTrigger(ownerid)),
    fetchTopRestaurantsTrigger: () => dispatch(fetchTopRestaurantsTrigger()),
    fetchMatchingRestaurantsTrigger: (keyword) => dispatch(fetchMatchingRestaurantsTrigger(keyword)),
    fetchItemsTrigger: (restaurantId) => dispatch(fetchItemsTrigger(restaurantId)),
    triggerCloseItems: () => dispatch(triggerCloseItems()),
    fetchRestaurantOrders: (restaurantId) => dispatch(fetchRestaurantOrdersTrigger(restaurantId)),
    updateOrderStatus: (orderId, restaurantId, status) => dispatch(updateOrderStatusTrigger(orderId, restaurantId, status))
});

export default connect (mapStateToProps, mapDispatchToProps)(Home);