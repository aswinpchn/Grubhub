import React from 'react';
import Header from './Header';
import { connect } from 'react-redux';
import { restaurantFetchTrigger } from  './../actions/restaurant-action';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: ''
        }
        
    }

    componentDidMount() {
        if(this.props.user.type === 'c')
            if(this.props.user.id)
                this.props.restaurantFetchTrigger(this.props.user.id);
    }

    render() {
        return(
            <div className="home">
                <Header userDetails={this.props.user} />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user : state.user,
        restaurant : state.restaurant, // We are reading it here still we make a page for restaurant iteslf.
    };
}

const mapDispatchToProps = (dispatch) => ({
    restaurantFetchTrigger: (ownerid) => dispatch(restaurantFetchTrigger(ownerid))
});

export default connect (mapStateToProps, mapDispatchToProps)(Home);