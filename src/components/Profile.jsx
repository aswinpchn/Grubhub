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
            password : ""
        };
        this.nameChangeHandler = this.nameChangeHandler.bind(this);
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.phoneChangeHandler = this.phoneChangeHandler.bind(this);
        this.handleUpdateClick = this.handleUpdateClick.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
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
            name : e.target.value
        });
    }

    passwordChangeHandler(e) {
        this.setState({
            password : e.target.value
        });
    }

    handleUpdateClick(event) {
        event.preventDefault();

    }

    renderProfile() {
        return(
        <div>
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
                <Form.Group controlId="formPassword">
                    <Form.Label >
                        Password:
                    </Form.Label>
                    <Form.Control type="text" placeholder="" required value={this.state.password} onChange={this.passwordChangeHandler} />
                </Form.Group>
                <div className="form-buttons">
                    <Button className="form-profile-update-buttons" variant="info" type="submit" onClick={this.handleUpdateClick}>Update</Button>
                </div>
            </Form>
        </div>   
        );
    }

    render() {
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