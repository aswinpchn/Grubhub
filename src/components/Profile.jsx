import React from 'react';
import Header from './Header';
import { connect } from 'react-redux';
import { Button, Form } from 'react-bootstrap';

class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name : "",
            email : "",
            phone : "",
            type : "",
            password : "",
            newPassword : "",
            updateStatus : "",
        };
        this.nameChangeHandler = this.nameChangeHandler.bind(this);
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.phoneChangeHandler = this.phoneChangeHandler.bind(this);
        this.handleUpdateClick = this.handleUpdateClick.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.newPasswordChangeHandler = this.newPasswordChangeHandler.bind(this);
    }

    componentDidMount() { // password alone not updated from state because, we don't need to show the existing one.
        if(this.props.user)
            this.setState({
                name : this.props.user.name,
                email : this.props.user.username,
                phone : this.props.user.phone,
                type : this.props.user.type,
            });
    }

    nameChangeHandler(e) {
        this.setState({
            name : e.target.value
        });
    }

    emailChangeHandler(e) {
        this.setState({
            email : e.target.value
        });
    }

    phoneChangeHandler(e) {
        this.setState({
            phone : e.target.value
        });
    }

    passwordChangeHandler(e) {
        this.setState({
            password : e.target.value
        });
    }

    newPasswordChangeHandler(e) {
        this.setState({
            newPassword : e.target.value
        });
    }

    handleUpdateClick(event) {
        event.preventDefault();
        this.setState({
            updateStatus : ""
        });

        if(this.state.password !== this.props.user.password) { // Not-Autheticated
            this.setState({
                updateStatus : "current password doesn't match with one in DB"
            });
        } else { // Authenticated
            if(!this.state.newPassword) { // No need of updating password
                if(this.state.name === this.props.user.name && this.state.phone === this.props.user.phone) {
                    this.setState({
                        updateStatus : "Nothing has changed."
                    });
                } else { // update.
                    this.setState({
                        updateStatus : "Success"
                    });
                }
            } else { // updating the password
                if(this.state.name === this.props.user.name && this.state.phone === this.props.user.phone && this.state.newPassword === this.props.user.password) {
                    this.setState({
                        updateStatus : "Nothing has changed."
                    });
                } else { // update.
                    this.setState({
                        updateStatus : "Success"
                    });
                }
            }
            
        }
    }

    renderProfile() {
        return(
        <div>
            {this.state.updateStatus}
            <Form className="user-details">
                <Form.Group controlId="formName">
                    <Form.Label >
                        Name:
                    </Form.Label>
                    <Form.Control type="text" placeholder="" required value={this.state.name} onChange={this.nameChangeHandler} />
                    <Form.Control.Feedback type="invalid">
                        Please enter your Name
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formEmail">
                    <Form.Label >
                        E-mail:
                    </Form.Label>
                    <Form.Control type="text" placeholder="" required value={this.state.email} disabled onChange={this.emailChangeHandler} />
                    <Form.Control.Feedback type="invalid">
                        Please enter your E-mail
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formPhone">
                    <Form.Label >
                        Phone:
                    </Form.Label>
                    <Form.Control type="text" placeholder="" required value={this.state.phone} onChange={this.phoneChangeHandler} />
                    <Form.Control.Feedback type="invalid">
                        Please enter your Phone
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formType">
                    <Form.Label >
                        Type:
                    </Form.Label>
                    <Form.Control type="text" placeholder="" required disabled value={this.state.type === 'c' ? "Customer" : "Owner" } />
                </Form.Group>
                <Form.Group controlId="formOldPassword">
                    <Form.Label >
                        Password:(To make changes)
                    </Form.Label>
                    <Form.Control type="password" placeholder="" required value={this.state.password} onChange={this.passwordChangeHandler} />
                    <Form.Control.Feedback type="invalid">
                        Please enter your Passsword
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formNewPassword">
                    <Form.Label >
                        New Password:(Enter both if you want to change password, or don't enter any)
                    </Form.Label>
                    <Form.Control type="password" placeholder="" required value={this.state.newPassword} onChange={this.newPasswordChangeHandler} />
                    <Form.Control.Feedback type="invalid">
                        Please enter your Passsword
                    </Form.Control.Feedback>
                </Form.Group>
                <div className="form-buttons">
                    <Button className="form-profile-update-buttons" variant="info" type="submit" disabled={!this.state.name || !this.state.phone || !this.state.password} onClick={this.handleUpdateClick}>Update</Button>
                </div>
            </Form>
        </div>   
        );
    }

    render() {
        //console.log(this.state);
        return(
            <div className="profile">
                <Header userDetails={this.props.user} />
                {this.renderProfile()}
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