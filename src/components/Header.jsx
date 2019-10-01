import React from 'react';
import { Link } from 'react-router-dom';
import profile from '../images/profile.svg';
import { Dropdown } from 'react-bootstrap';
import cookie from 'react-cookies';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.renderProfile = this.renderProfile.bind(this);
        this.logOutSelect = this.logOutSelect.bind(this);
    }

    logOutSelect () {
        cookie.remove('cookie', { path: '/' });
    }

    renderProfile() {

        if(this.props && this.props.userDetails && this.props.userDetails.name !== '') {
            let d = <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Hi {this.props.userDetails.name}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item href="#/profile">Profile</Dropdown.Item> {/* can use link also, link internally uses href */}
                            <Dropdown.Item>Orders</Dropdown.Item>
                            <Dropdown.Item href="#/login" onSelect={this.logOutSelect}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>;
            return d;
            
        } else {
            return null;
        }
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