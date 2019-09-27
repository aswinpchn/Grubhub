import React from 'react';
import Header from './Header';
import { connect } from 'react-redux';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: ''
        }
    }

    render() {
        return(
            <div className="home">
                Hi {this.props.user.username}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user : state.user
    };
}

export default connect (mapStateToProps)(Home);