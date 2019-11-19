import React from 'react';
import { connect } from 'react-redux';
import Header from './Header';
import { Button, Form, Pagination, Table } from 'react-bootstrap';
import { addItemTrigger, triggerDeleteItem } from '../actions/restaurant-action';

class RestaurantManager extends React.Component {
    constructor(props) {
        super(props);
        this.renderRestaurantItems = this.renderRestaurantItems.bind(this);
        this.handleAddItem = this.handleAddItem.bind(this);
        this.renderNewItemForm = this.renderNewItemForm.bind(this);
        this.state = {
            showNewItemForm: false,
            name: '',
            description: '',
            price: '',
            activePage: 1
        };
        this.renderPagination = this.renderPagination.bind(this);
        this.pageClicked  = this.pageClicked.bind(this);
        this.handleDeleteItem = this.handleDeleteItem.bind(this);
    }

    componentDidUpdate(prevProps) {
        if(this.props.menu.length !== prevProps.menu.length || prevProps.restaurant._id !== this.props.restaurant._id) {
            this.setState({
                showNewItemForm: false
            })
        }
    }

    handleDeleteItem(itemId) {
        this.props.triggerDeleteItem(itemId, this.props.restaurant._id, this.props.user.id);
    }

    renderRestaurantItems() {
        const columns = [{
            dataField: 'name',
            text: 'Item Name'
          }, {
            dataField: 'description',
            text: 'Item description'
          }, {
            dataField: 'category',
            text: 'Item Category'
          }, {
            dataField: 'price',
            text: 'Item Price'
          }];
        let items = this.props.menu.slice((this.state.activePage-1)*10, this.state.activePage*10);
        return(
            <Table responsive>
            <thead>
                <tr>
                    {columns.map((column) => <th key={column.dataField}>{column.text}</th>)}
                </tr>
            </thead>
            <tbody>
                {items.map((item) => <tr>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>{item.category}</td>
                    <td>{item.price}</td>
                    <button onClick={() => this.handleDeleteItem(item._id)}>Delete</button>
                </tr>)}
            </tbody>
            </Table>
        )
    }

    handleAddItem() {
        const prevState = this.state.showNewItemForm;
        this.setState({
            showNewItemForm: !prevState
        });
    }


    pageClicked(pageNumber) {
        this.setState({
            activePage: pageNumber,
        });
    }

    renderPagination() {
        let items = [];
        for (let number = 1; number <= Math.ceil(this.props.menu.length / 10); number++) {
            items.push(
                <Pagination.Item key={number} active={number === this.state.activePage} onClick={() => this.pageClicked(number)}>
                {number}
                </Pagination.Item>,
            );
        }
        if(items.length > 0)
            return(
                <Pagination>{items}</Pagination>
            )
    }

    handleAddItemClick(event) {
        //prevent page from refresh
        event.preventDefault();
        this.props.addItemTrigger({ name: this.state.name, description: this.state.description, category: this.state.category, price: this.state.price }, this.props.restaurant._id, this.props.user.id);   
    }

    nameChangeHandler = (e) => {
        this.setState({
            name : e.target.value
        })
    }

    descriptionChangeHandler = (e) => {
        this.setState({
            description : e.target.value
        })
    }

    priceChangeHandler = (e) => {
        this.setState({
            price : e.target.value
        })
    }

    categoryChangeHandler = (e) => {
        this.setState({
            category : e.target.value
        })
    }

    renderNewItemForm() {
        return(
            <Form className="new-item-form">
            <Form.Group controlId="formBasicName">
                <Form.Control type="text" placeholder="Item name" onChange={this.nameChangeHandler.bind(this)} value={this.state.name} required />
                <Form.Control.Feedback type="invalid">
                    Please enter item name
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formBasicDescription">
                <Form.Control type="text" placeholder="Item description" onChange={this.descriptionChangeHandler.bind(this)} value={this.state.description} required />
                <Form.Control.Feedback type="invalid">
                    Please enter item description
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formBasicCategory">
                <Form.Control type="text" placeholder="Item category" onChange={this.categoryChangeHandler.bind(this)} value={this.state.category} required />
                <Form.Control.Feedback type="invalid">
                    Please enter item category
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formBasicPrice">
                <Form.Control type="text" placeholder="Item price" onChange={this.priceChangeHandler.bind(this)} value={this.state.price} required />
                <Form.Control.Feedback type="invalid">
                    Please enter item price
                </Form.Control.Feedback>
            </Form.Group>
            <div className="form-buttons">
                <Button className="form-new-item-buttons" variant="info" type="submit" onClick={this.handleAddItemClick.bind(this)}>Add</Button>
            </div>
        </Form>
        )
    }

    render() {
        return(
            <div className="restaurant-manager">
                <Header userDetails={this.props.user} />
                <button onClick={() => this.handleAddItem()}>Add New Item</button>
                {this.state.showNewItemForm ? this.renderNewItemForm() : null}
                {this.renderPagination()}           
                {this.renderRestaurantItems()}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.user,
    menu: state.restaurant.restaurants.menu,
    restaurant: state.restaurant.restaurants
});

const mapDispatchToProps = (dispatch) => ({
    addItemTrigger: (item, restaurantId, userId) => dispatch(addItemTrigger(item, restaurantId, userId)),
    triggerDeleteItem: (itemId, restaurantId, userId) => dispatch(triggerDeleteItem(itemId, restaurantId, userId))
});

export default connect (mapStateToProps, mapDispatchToProps)(RestaurantManager);