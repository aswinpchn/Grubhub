import React from 'react';
import Header from './Header';
import { Button, Form } from 'react-bootstrap';
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadLoginFor: null
        }
        this.renderLoginForm = this.renderLoginForm.bind(this);
        this.renderCommonLoginButtons = this.renderCommonLoginButtons.bind(this);
    }

    handleButtonClick(event) {
        this.setState({
            loadLoginFor: event.target.id
        });
    }

    renderCommonLoginButtons() {
        return(
            <>
                <div className="login-buttons">
                <Button className="login-button" id="buyer" variant="outline-info" size="lg" onClick={this.handleButtonClick.bind(this)}>Login As Buyer</Button>
                <Button className="login-button" id="owner" variant="outline-info" size="lg" onClick={this.handleButtonClick.bind(this)}>Login As Owner</Button>
                </div>
            </>
        );
    }

    renderLoginForm() {
        return(
            <Form className="login-form">
                <Form.Text className="text-muted">
                    You will be logged in as {this.state.loadLoginFor}
                </Form.Text>
                <Form.Group controlId="formBasicEmail">
                    <Form.Control type="email" placeholder="Enter email" required />
                    <Form.Control.Feedback type="invalid">
                        Please enter your username
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Control type="password" placeholder="Password" required />
                    <Form.Control.Feedback type="invalid">
                        Please enter your username
                    </Form.Control.Feedback>
                </Form.Group>
                <Button variant="link">Create new account</Button>
                <div className="form-buttons">
                    <Button className="form-login-buttons" variant="info" type="submit">Login</Button>
                    <Button className="form-login-buttons" variant="dark">Cancel</Button>
                </div>
            </Form>
        );
    }

    render() {
        let componentToBeRendered = null;
        if(this.state.loadLoginFor == null) {
            componentToBeRendered = this.renderCommonLoginButtons();
        } else {
            componentToBeRendered = this.renderLoginForm();
        }
        return(
            <div className="login">
                <Header userDetails={null} />
                {componentToBeRendered}
            </div>
        )
    }
}

export default Login;