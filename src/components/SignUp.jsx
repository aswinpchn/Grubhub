import React from 'react';
import Header from './Header';
import { Alert } from 'react-bootstrap';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getField } from '../utils';
import Axios from 'axios';

class SignUp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name : "",
            email : "",
            password : "",
            zip : "",
            phone : "",
            restaurantname : "",
            cuisine : "",
            error : "",
            success : "",
        };

        this.renderSignUpForm = this.renderSignUpForm.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onEmailChange = this.onEmailChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onZipChange = this.onZipChange.bind(this);
        this.onPhoneChange = this.onPhoneChange.bind(this);
        this.onRestaurantNameChange = this.onRestaurantNameChange.bind(this);
        this.onCuisineChange = this.onCuisineChange.bind(this);
    }

    onNameChange = (e) => {
        this.setState({
            name : e.target.value
        })
    }

    onEmailChange = (e) => {
        this.setState({
            email : e.target.value
        })
    }

    onPasswordChange = (e) => {
        this.setState({
            password : e.target.value
        })
    }

    onZipChange = (e) => {
        this.setState({
            zip : e.target.value
        })
    }

    onPhoneChange = (e) => {
        this.setState({
            phone : e.target.value
        })
    }

    onRestaurantNameChange = (e) => {
        this.setState({
            restaurantname : e.target.value
        })
    }

    onCuisineChange = (e) => {
        this.setState({
            cuisine : e.target.value
        })
    }

    signUp = (e) => {
        e.preventDefault();

        const accountType = getField(['match', 'params', 'type'], this.props);
        if(accountType === "buyer") {
            Axios.put('http://localhost:3001/user/customerSignUp', {  // http:// has to be there. otherwise cors will come/
                name : this.state.name,
                email : this.state.email,
                password : this.state.password,
                phone : this.state.phone,
                type : 'c',
                image : 'http://google.com'
            }).then((response) => { // response.data has success
                this.setState({
                    success : response.data + ", you can now go to login page.",
                    error : "",
                });
            }).catch((error) => { // error.response.data has duplicate user or db error
                this.setState({
                    error : error.response.data + ", so try login",
                    success : "",
                });
            });
        } else {
            Axios.put('http://localhost:3001/user/ownerSignUp', {  // http:// has to be there. otherwise cors will come/
                name : this.state.name,
                email : this.state.email,
                password : this.state.password,
                phone : this.state.phone,
                type : 'o',
                image : 'http://google.com',
                zip : this.state.zip,
                restaurantname : this.state.restaurantname,
                cuisine : this.state.cuisine,
            }).then((response) => { // response.data has success
                this.setState({
                    success : response.data + ", you can now go to login page.",
                    error : "",
                });
            }).catch((error) => { // error.response.data has duplicate user or db error
                this.setState({
                    error : error.response.data + ", so try login",
                    success : "",
                });
            });
        }
    }

    renderSignUpForm(accountType) {
        return (
            <>
                {this.state.error ? <div>{this.state.error}</div> : null}
                {this.state.success ?  <div>{this.state.success}</div> : null}
                <Form className="signup-form" onSubmit = {this.signUp} >
                    <h2 className="form-heading">Sign Up as <span className="user-type">{accountType}</span></h2>
                    <Form.Group controlId="formBasicName">
                        <Form.Control type="text" onChange = {this.onNameChange} placeholder="Name" required />
                        <Form.Control.Feedback type="invalid">
                            Please enter the Name
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Control type="email" onChange = {this.onEmailChange} placeholder="Enter email" required />
                        <Form.Control.Feedback type="invalid">
                            Please enter your username
                    </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Control type="password" onChange = {this.onPasswordChange} placeholder="Password" required />
                        <Form.Control.Feedback type="invalid">
                            Please enter your password
                    </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formBasicZipCode">
                        <Form.Control type="text" onChange = {this.onZipChange} placeholder="ZipCode" required />
                        <Form.Control.Feedback type="invalid">
                            Please enter your Zipcode
                    </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formBasicContactNumber">
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text>+1</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control type="text" onChange = {this.onPhoneChange} placeholder="ContactNumber" required />
                            <Form.Control.Feedback type="invalid">
                                Please enter your Contact Number
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    {(accountType === 'owner') ? 
                    <>
                        <Form.Group controlId="formBasicRestaurantName">
                            <Form.Control type="text" onChange = {this.onRestaurantNameChange} placeholder="Restaurant Name" required />
                            <Form.Control.Feedback type="invalid">
                                Please enter Restaurant Name
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formBasicCuisine">
                            <Form.Control type="text" onChange = {this.onCuisineChange} placeholder="Cuisine" required />
                            <Form.Control.Feedback type="invalid">
                                Please enter the Cuisine
                            </Form.Control.Feedback>
                        </Form.Group>
                    </> : null }
                        <Link to={`/login/${accountType}`}><Button variant="link">Have an account already?</Button></Link>
                    <div className="form-buttons">
                        <Link to="/"><Button className="form-signup-buttons" variant="dark">Cancel</Button></Link>
                        <Button className="form-signup-buttons" variant="info" type="submit" onClick= {this.signUp} >Create Account</Button>
                    </div>
                </Form>
            </>
        );
    }

    render() {
        const accountType = getField(['match', 'params', 'type'], this.props);
        let componentToBeRendered = null;
        if (accountType == null) {
            componentToBeRendered = <Alert className="error-alert" variant="danger">Please mention the account type to signup</Alert>
        } else {
            if (accountType === 'buyer' || accountType === 'owner')
                componentToBeRendered = this.renderSignUpForm(accountType);
            else
                componentToBeRendered = <Alert className="error-alert" variant="danger">The user can be only owner or buyer</Alert>

        }
        return (
            <div className="sign-up">
                <Header />
                {componentToBeRendered}
            </div>
        );
    }
}

export default SignUp;