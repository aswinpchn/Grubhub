import React from 'react';
import Header from './Header';
import { connect } from 'react-redux';
import { restaurantFetchTrigger, fetchTopRestaurantsTrigger, fetchMatchingRestaurantsTrigger } from  './../actions/restaurant-action';
import { Card, Alert, Form } from 'react-bootstrap';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: ''
        }
        this.renderRestaurantList = this.renderRestaurantList.bind(this);
        this.renderErrorMessage = this.renderErrorMessage.bind(this);
    }

    renderErrorMessage() {
        if(this.props.error) {
            return(
                <Alert className="alert" variant='secondary'>{this.props.error}</Alert>
            )
        }
    }

    renderRestaurantList() {
        const restaurants = this.props.restaurants.map((restaurant) => {
            return (
                <Card className="shadow bg-white rounded" key={restaurant.id}>
                    <Card.Body>
                        <Card.Title>{restaurant.name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{restaurant.cuisine}</Card.Subtitle>
                    </Card.Body>
                </Card>
            )
        });
        return restaurants;
    }

    componentDidMount() {
        if(this.props.user && this.props.user.id && this.props.user.type === 'o')
            this.props.restaurantFetchTrigger(this.props.user.id);
        else
            this.props.fetchTopRestaurantsTrigger();
    }

    searchRestaurant(event) {
        if(event.target.value != '')
            this.props.fetchMatchingRestaurantsTrigger(event.target.value);
        else
            this.props.fetchTopRestaurantsTrigger();
    }

    render() {
        if(this.props.restaurants || this.props.error)
            return(
                <div className="home">
                    <Header userDetails={this.props.user} />
                    <Form.Control type="text" placeholder="Search" className="search-input" onChange={this.searchRestaurant.bind(this)} />
                    {this.renderErrorMessage()}
                    <h2 className="heading">{this.props.foundMatching ? 'Search Results' : 'Restaurants you may like'}</h2>
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
        foundMatching: state.restaurant.foundMatching
    };
}

const mapDispatchToProps = (dispatch) => ({
    restaurantFetchTrigger: (ownerid) => dispatch(restaurantFetchTrigger(ownerid)),
    fetchTopRestaurantsTrigger: () => dispatch(fetchTopRestaurantsTrigger()),
    fetchMatchingRestaurantsTrigger: (keyword) => dispatch(fetchMatchingRestaurantsTrigger(keyword))
});

export default connect (mapStateToProps, mapDispatchToProps)(Home);