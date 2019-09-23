import React from 'react';
import Header from './Header';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getField } from '../utils';

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

        axios.defaults.withCredentials = true;

        axios.post('http://localhost:3001/user/login', {email : this.state.email, password : this.state.password})
        .then(response => {
            if(response.status === 200) {
                console.log(response.data);
            }   
        }).catch((error) => {
            if(error.response.status === 404) {
                console.log('user not found');
            } else if(error.response.status === 401) {
                console.log('invalid password');
            } else {
                console.log('db error');
            }
        });    
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