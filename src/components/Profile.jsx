import React from 'react';
import Header from './Header';
import { connect } from 'react-redux';

class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: ''
        }
    }

    render() {
        return(
            <div className="profile">
                <Header userDetails={this.props.user} />
                Profile page.
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user : state.user
    };
}

export default connect (mapStateToProps)(Profile);