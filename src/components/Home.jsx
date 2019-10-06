import React from 'react';
import Header from './Header';
import { connect } from 'react-redux';
import { fetchOwnedRestaurantTrigger, fetchTopRestaurantsTrigger, fetchMatchingRestaurantsTrigger, fetchItemsTrigger, triggerCloseItems } from  './../actions/restaurant-action';
import { Card, Alert, Form } from 'react-bootstrap';
import Items from './Items';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: ''
        }
        this.renderRestaurantList = this.renderRestaurantList.bind(this);
        this.renderErrorMessage = this.renderErrorMessage.bind(this);
        this.handleRestaurantSelect = this.handleRestaurantSelect.bind(this);
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

    renderItems(restaurantId) {
        if(this.props.selectedRestaurant && restaurantId === this.props.selectedRestaurant.restaurantId)
        return (
            <Items items={this.props.selectedRestaurant.items} />
        )
    }

    renderRestaurantList() {

        let restaurants = '';
        if(this.props.user && this.props.user.type && this.props.user.type === 'o') {
            restaurants =
                <><Card className="shadow bg-white rounded" key={this.props.restaurants.id} onClick={() => this.handleRestaurantSelect(this.props.restaurants.id)}>
                    <Card.Body>
                        <Card.Title>{this.props.restaurants.name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{this.props.restaurants.cuisine}</Card.Subtitle>
                    </Card.Body>
                </Card>
                {this.renderItems(this.props.restaurants.id)}
                </>
        }
        else {
            restaurants = this.props.restaurants.map((restaurant) => {
                return (
                    <>
                        <Card className="shadow bg-white rounded" key={restaurant.id} onClick={() => this.handleRestaurantSelect(restaurant.id)}>
                            <Card.Body>
                                <Card.Title>{restaurant.name}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{restaurant.cuisine}</Card.Subtitle>
                            </Card.Body>
                        </Card>
                        {this.renderItems(restaurant.id)}
                    </>
                )
            });
        }
        return restaurants;
    }

    componentDidMount() {
        if(this.props.user && this.props.user.id && this.props.user.type === 'o')
            this.props.fetchOwnedRestaurantTrigger(this.props.user.id);
        else
            this.props.fetchTopRestaurantsTrigger();
    }

    searchRestaurant(event) {
        if(event.target.value !== '')
            this.props.fetchMatchingRestaurantsTrigger(event.target.value);
        else
            this.props.fetchTopRestaurantsTrigger();
    }

    render() {
        if(this.props.restaurants || this.props.error)
            return(
                <div className="home">
                    <Header userDetails={this.props.user} />
                    {this.props.user && this.props.user.type === 'c' ? (<Form.Control type="text" placeholder="Search" className="search-input" onChange={this.searchRestaurant.bind(this)} />) : ''}
                    {this.renderErrorMessage()}
                    <h2 className="heading">{this.props.user.type === 'o' ? 'Your restaurant' : (this.props.foundMatching ? 'Search Results' : 'Restaurants you may like') }</h2>
                    {this.renderRestaurantList()}
                </div>
            );
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
        selectedRestaurant: state.restaurant.selectedRestaurant
    };
}

const mapDispatchToProps = (dispatch) => ({
    fetchOwnedRestaurantTrigger: (ownerid) => dispatch(fetchOwnedRestaurantTrigger(ownerid)),
    fetchTopRestaurantsTrigger: () => dispatch(fetchTopRestaurantsTrigger()),
    fetchMatchingRestaurantsTrigger: (keyword) => dispatch(fetchMatchingRestaurantsTrigger(keyword)),
    fetchItemsTrigger: (restaurantId) => dispatch(fetchItemsTrigger(restaurantId)),
    triggerCloseItems: () => dispatch(triggerCloseItems())
});

export default connect (mapStateToProps, mapDispatchToProps)(Home);