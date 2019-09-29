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
                <Header userDetails={this.props.user} />
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