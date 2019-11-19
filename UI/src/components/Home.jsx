import React from 'react';
import Header from './Header';
import { connect } from 'react-redux';
import { fetchOwnedRestaurantTrigger, fetchTopRestaurantsTrigger, fetchMatchingRestaurantsTrigger, fetchItemsTrigger, triggerCloseItems, fetchRestaurantOrdersTrigger } from  './../actions/restaurant-action';
import { updateOrderStatusTrigger, fetchChatForOrderTrigger, sendMessageTrigger } from '../actions/order-actions';
import { Card, Alert, Form, Pagination } from 'react-bootstrap';
import Items from './Items';
import Chat from './Chat';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            selectedOrderId: '',
            activePage: 1,
            activeOrderPage: 1
        }
        this.renderRestaurantList = this.renderRestaurantList.bind(this);
        this.renderErrorMessage = this.renderErrorMessage.bind(this);
        this.handleRestaurantSelect = this.handleRestaurantSelect.bind(this);
        this.renderOrderItems = this.renderOrderItems.bind(this);
        this.handleStatusUpdate = this.handleStatusUpdate.bind(this);
        this.renderPagination = this.renderPagination.bind(this);
        this.pageClicked  = this.pageClicked.bind(this);
        this.renderOrderPagination = this.renderOrderPagination.bind(this);
        this.orderPageClicked = this.orderPageClicked.bind(this);
        this.handleChatClicked = this.handleChatClicked.bind(this);
        this.renderChatList = this.renderChatList.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    renderErrorMessage() {
        if(this.props.error) {
            return(
                <Alert className="alert" variant='secondary'>{this.props.error}</Alert>
            )
        }
    }

    handleRestaurantSelect(restaurantId) {
        if(this.props.selectedRestaurant && restaurantId === this.props.selectedRestaurant.restaurantId) {
            this.props.triggerCloseItems();
        }
        else
            this.props.fetchItemsTrigger(restaurantId);
    }

    handleStatusUpdate(orderId, status) {
        this.props.updateOrderStatus(orderId, this.props.restaurants._id, status);
    }

    renderItems(restaurantId) {
        if(this.props.selectedRestaurant)
        return (
            <Items items={this.props.selectedRestaurant.items} userDetails={this.props.user.id} restaurantDetails={restaurantId} />  // If parent updates(re-renders), child will also re-render, it wont unmount and mount again, it will just re-render.
        )
    }

    handleChatClicked(orderId) {
        this.setState({
            chatFor: orderId
        });
        this.props.fetchChatForOrder(orderId);
    }

    sendMessage(message) {
        this.props.sendMessage(message, this.state.chatFor, { userId: this.props.user.id, name: this.props.user.name });
    }

    renderChatList(orderId) {
        if(this.state.chatFor == orderId) {
            return(
                <Chat chat={this.props.chat} sendMessage={this.sendMessage} />
            )
        }
    }

    renderOrderItems(id, menu) {
        if(this.state.selectedOrderId === id) {
            return(
               menu.map((item) => 
                    <Card className="shadow bg-white rounded" key={item._id}>
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
        const restaurantsInPageSelected = this.props.restaurants.slice((this.state.activePage-1)*10, this.state.activePage*10);
        if(restaurantsInPageSelected.length > 0) {
            const restaurants = restaurantsInPageSelected.map((restaurant) => {
                    return (
                        <>
                            <Card className="shadow bg-white rounded" key={restaurant._id} onClick={() => this.handleRestaurantSelect(restaurant._id)}>
                                <Card.Body>
                                    <Card.Title>Restaurant name : {restaurant.name}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">Cuisine : {restaurant.cuisine}</Card.Subtitle>
                                </Card.Body>
                            </Card>
                            {this.props.selectedRestaurant && this.props.selectedRestaurant.restaurantId == restaurant._id ? this.renderItems(restaurant._id) : ''}
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
        const customerOrdersToBeDisplayed = customerOrders.slice((this.state.activeOrderPage-1)*10, this.state.activeOrderPage*10);
        return customerOrdersToBeDisplayed.map((order) => 
        <>
            <Card className="shadow bg-white rounded" key={order._id}>
                <Card.Body>
                    <Card.Title>Order Id : {order._id}<button onClick={() => this.handleChatClicked(order._id)} style={{float: 'right'}}>Chat</button></Card.Title>
                    <Card.Subtitle className="mb-2 text-muted" onClick={() => this.handleOrderSelect(order._id)}>
                        <span className="order-contents">Time : {new Date(Date.parse(order.ordertime)).toString().split('GMT')[0]}</span>
                        <span className="order-contents">Status : {order.status}</span>
                        <span className="order-contents">
                            <button onClick={() => this.handleStatusUpdate(order._id, 'Accepted')}>Accepted</button>
                            <button onClick={() => this.handleStatusUpdate(order._id, 'Cooking')}>Cooking</button>
                            <button onClick={() => this.handleStatusUpdate(order._id, 'On the way')}>On the way</button>
                            <button onClick={() => this.handleStatusUpdate(order._id, 'Delivered')}>Delivered</button>
                            <button onClick={() => this.handleStatusUpdate(order._id, 'Cancelled')}>Cancel</button>
                        </span>
                    </Card.Subtitle>
                </Card.Body>
            </Card>
            {this.renderOrderItems(order._id, order.menu)}
            {this.renderChatList(order._id)}
        </>
    );
    }

    pageClicked(pageNumber) {
        this.setState({
            activePage: pageNumber,
        });
    }

    renderPagination() {
        let items = [];
        for (let number = 1; number <= Math.ceil(this.props.restaurants.length / 10); number++) {
            items.push(
                <Pagination.Item key={number} active={number === this.state.activePage} onClick={() => this.pageClicked(number)}>
                {number}
                </Pagination.Item>,
            );
        }
        return(
            <Pagination>{items}</Pagination>
        )
    }

    orderPageClicked(pageNumber) {
        this.setState({
            activeOrderPage: pageNumber,
        });
    }
    

    renderOrderPagination() {
        let items = [];
        for (let number = 1; number <= Math.ceil(this.props.orders.numberoforders / 10); number++) {
            items.push(
                <Pagination.Item key={number} active={number === this.state.activeOrderPage} onClick={() => this.pageClicked(number)}>
                {number}
                </Pagination.Item>,
            );
        }
        if(items.length > 0)
            return(
                <Pagination>{items}</Pagination>
            )
    }

    renderOwnerView() {
        let customerOrders = this.props.orders;
        if(customerOrders) {
            //console.log(customerOrders);
            if(customerOrders.numberoforders === 0) {
                return <div>
                        No orders to display
                    </div>;
            } else {
                return(<>
                <span>{customerOrders.numberoforders} order(s)</span>
                {this.renderOrderPagination()}
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
                {this.renderPagination()}
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
        orders: state.order.orders,
        chat: state.order.chat
    };
}

const mapDispatchToProps = (dispatch) => ({
    fetchOwnedRestaurantTrigger: (ownerid) => dispatch(fetchOwnedRestaurantTrigger(ownerid)),
    fetchTopRestaurantsTrigger: () => dispatch(fetchTopRestaurantsTrigger()),
    fetchMatchingRestaurantsTrigger: (keyword) => dispatch(fetchMatchingRestaurantsTrigger(keyword)),
    fetchItemsTrigger: (restaurantId) => dispatch(fetchItemsTrigger(restaurantId)),
    triggerCloseItems: () => dispatch(triggerCloseItems()),
    fetchRestaurantOrders: (restaurantId) => dispatch(fetchRestaurantOrdersTrigger(restaurantId)),
    updateOrderStatus: (orderId, restaurantId, status) => dispatch(updateOrderStatusTrigger(orderId, restaurantId, status)),
    fetchChatForOrder: (orderId) => dispatch(fetchChatForOrderTrigger(orderId)),
    sendMessage: (message, orderId, sender) => dispatch(sendMessageTrigger(message, orderId, sender)) 
});

export default connect (mapStateToProps, mapDispatchToProps)(Home);