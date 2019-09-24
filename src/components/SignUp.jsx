import React from 'react';
import Header from './Header';
import { Alert } from 'react-bootstrap';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getField } from '../utils';

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.renderSignUpForm = this.renderSignUpForm.bind(this);
    }

    renderSignUpForm(accountType) {
        return (
            <>
                <Form className="signup-form">
                    <h2 className="form-heading">Sign Up as <span className="user-type">{accountType}</span></h2>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Control type="email" placeholder="Enter email" required />
                        <Form.Control.Feedback type="invalid">
                            Please enter your username
                    </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Control type="password" placeholder="Password" required />
                        <Form.Control.Feedback type="invalid">
                            Please enter your password
                    </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formBasicZipCode">
                        <Form.Control type="text" placeholder="ZipCode" required />
                        <Form.Control.Feedback type="invalid">
                            Please enter your Zipcode
                    </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formBasicContactNumber">
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text>+1</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control type="text" placeholder="ContactNumber" required />
                            <Form.Control.Feedback type="invalid">
                                Please enter your Contact Number
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    {(accountType === 'owner') ? 
                        <><Form.Group controlId="formBasicName">
                        <Form.Control type="text" placeholder="Restaurant Name" required />
                        <Form.Control.Feedback type="invalid">
                            Please enter Restaurant Name
                            </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Control type="password" placeholder="Password" required />
                        <Form.Control.Feedback type="invalid">
                            Please enter the Cuisine
                            </Form.Control.Feedback>
                    </Form.Group></> : null }
                        <Link to={`/login/${accountType}`}><Button variant="link">Have an account already?</Button></Link>
                    <div className="form-buttons">
                        <Link to="/"><Button className="form-signup-buttons" variant="dark">Cancel</Button></Link>
                        <Button className="form-signup-buttons" variant="info" type="submit">Create Account</Button>
                    </div>
                </Form>
            </>
        );
    }

    render() {
        const accountType = getField(['match', 'params', 'type'], this.props);
        console.log(this.props);
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
                <Header userDetails={{}} />
                {componentToBeRendered}
            </div>
        );
    }
}

export default SignUp;