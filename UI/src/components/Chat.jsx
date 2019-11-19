import React from 'react';
import { Form, Button } from 'react-bootstrap';

export default class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.onMessageChange = this.onMessageChange.bind(this);
    }

    onMessageChange(event) {
        this.setState({
            message : event.target.value
        })
    }

    send(event) {
        event.preventDefault();
        this.props.sendMessage(this.state.message);
    }
    render() {
        return(
            <>
            <div style={{ "margin-left": "45rem" }}>
            {this.props.chat && this.props.chat.map((eachItem) => {
                return <p>{eachItem.sender.name} : {eachItem.message}</p>
            })}</div>
            <Form className="chat-add-form">
                <Form.Group controlId="formBasicMessage" className="chat-form-message">
                    <Form.Control type="text" onChange = {this.onMessageChange} placeholder="Message" required />
                    <Button className="form-chat-buttons" variant="info" onClick= {this.send.bind(this)}>Send</Button>
                    <Form.Control.Feedback type="invalid">
                        Please enter the message
                    </Form.Control.Feedback>
                </Form.Group>
            </Form>
            </>
        )
    }
}