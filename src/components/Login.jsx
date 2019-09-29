import React from 'react';
import Header from './Header';
import { Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getField } from '../utils';
import { connect } from 'react-redux';
import { loginTrigger } from '../actions/user-action';
import cookie from 'react-cookies';
import { Redirect } from 'react-router-dom';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadLoginFor: null,
            email: '',
            password: '',
        }
        this.renderLoginForm = this.renderLoginForm.bind(this);
        this.renderCommonLoginButtons = this.renderCommonLoginButtons.bind(this);
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    }

    componentDidMount() {
        const accountType = getField(['match', 'params', 'type'], this.props);
        this.setState({
            loadLoginFor: accountType
        });
    }

    handleLoginClick(event) {
        //prevent page from refresh
        event.preventDefault();

        this.props.loginTrigger(this.state.email, this.state.password, (this.state.loadLoginFor === "owner")? "o" : "c" );   
    }

    emailChangeHandler = (e) => {
        this.setState({
            email : e.target.value
        })
    }

    passwordChangeHandler = (e) => {
        this.setState({
            password : e.target.value
        })
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
                    <Form.Control type="email" placeholder="Enter email" onChange={this.emailChangeHandler.bind(this)} value={this.state.email} required />
                    <Form.Control.Feedback type="invalid">
                        Please enter your username
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Control type="password" placeholder="Password" onChange={this.passwordChangeHandler.bind(this)} value={this.state.password} required />
                    <Form.Control.Feedback type="invalid">
                        Please enter your password
                    </Form.Control.Feedback>
                </Form.Group>
                <Link to={`/create-account/${this.state.loadLoginFor}`}><Button variant="link">Create new account</Button></Link>
                <div className="form-buttons">
                    <Link to="/"><Button className="form-login-buttons" variant="dark">Cancel</Button></Link>
                    <Button className="form-login-buttons" variant="info" type="submit" onClick={this.handleLoginClick.bind(this)}>Login</Button>
                </div>
            </Form>
        );
    }

    render() {
        let redirectVar = null;

        if(cookie.load('cookie')){
            redirectVar = <Redirect to= "/home"/>  // /home route should be defined in index.js to be able for the application to know where to reload.
        }

        let componentToBeRendered = null;
        if(this.state.loadLoginFor == null) {
            componentToBeRendered = this.renderCommonLoginButtons();
        } else {
            componentToBeRendered = this.renderLoginForm();
        }
        return(
            <div>
                {redirectVar}
                <div className="login">
                    <Header />
                    <p>{this.props.user.error}</p>
                    {componentToBeRendered}
                </div>
            </div>    
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user : state.user
    };
}

const mapDispatchToProps = (dispatch) => ({
    loginTrigger: (username, password, type) => dispatch(loginTrigger(username, password, type))
});



export default connect (mapStateToProps, mapDispatchToProps)(Login);