import React from 'react';
import { Link } from 'react-router-dom';
import profile from '../images/profile.svg';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.renderProfile = this.renderProfile.bind(this);
    }

    renderProfile() {
        return (this.props && this.props.userDetails && this.props.userDetails.name !== '') ? <span className='profile-logo'>Hi {this.props.userDetails.name}</span> : null;
    }

    render() {
        return(
            <div className="header">
                <Link className="title-link" to="/"><p  className="title">GrubHub</p></Link>
                {this.renderProfile()}
            </div>
        );
    }
}

export default Header;