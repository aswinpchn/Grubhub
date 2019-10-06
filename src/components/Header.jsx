import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import cookie from 'react-cookies';
import { connect } from 'react-redux';
import { logOut } from '../actions/restaurant-action'; // Importing one reducers action will be fine as when the action creater creates and dispatches an action, same action exists in mutiple reducers and all happends.

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.renderProfile = this.renderProfile.bind(this);
        this.logOutSelect = this.logOutSelect.bind(this);
    }

    logOutSelect () {
        cookie.remove('cookie', { path: '/' });
        this.props.logOut();
    }

    renderProfile() {

        if(this.props && this.props.userDetails && this.props.userDetails.name !== '') {
            let d = <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
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

const mapDispatchToProps = (dispatch) => ({
    logOut : () => dispatch(logOut())
});

export default connect (null, mapDispatchToProps)(Header);