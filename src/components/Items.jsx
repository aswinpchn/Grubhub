import React from 'react';
import { Card, Alert, Form, Button } from 'react-bootstrap';
import { cloneDeep, groupBy, map } from 'lodash';
import { connect } from 'react-redux';
import { createOrderTrigger } from '../actions/order-actions';

class Items extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItems: {},
            basePrice : 0,
        }

        this.incrementItem = this.incrementItem.bind(this);
        this.decrementItem = this.decrementItem.bind(this);
        this.handleOrderClick = this.handleOrderClick.bind(this);
        this.renderCart = this.renderCart.bind(this);
    }

    componentDidUpdate(prevProps) {
        if(this.props.order.orderPlacingStatus !== prevProps.order.orderPlacingStatus) {
            if(this.props.order.orderPlacingStatus === true)
                this.setState({
                    selectedItems: {},
                    cost : 0,
                });
        }
    }

    renderGroup(items, category) {
        return(
            <div key={category}>
                <h4 className="category-header">{category}</h4>
                {map(items, this.renderEachItem.bind(this))}
            </div>
        )
    }

    incrementItem(id, price) {
        const selectedItems = cloneDeep(this.state.selectedItems);
        const itemCount = selectedItems[id] || 0;
        selectedItems[id] = itemCount + 1;
        this.setState({
            selectedItems: selectedItems,
            basePrice : this.state.basePrice + price,
        });
    }

    decrementItem(id, price) {
        const selectedItems = cloneDeep(this.state.selectedItems);
        const itemCount = selectedItems[id] || 0;
        if(itemCount > 0) {
            selectedItems[id] = itemCount - 1;
            if(selectedItems[id] === 0) {
                delete selectedItems[id];
            }
            this.setState({
                selectedItems: selectedItems,
                basePrice : this.state.basePrice - price,
            });
        }
    }

    renderEachItem(item) {
        return(
            <Card className="shadow bg-white rounded" key={item.id}>
                <Card.Body className="item-card">
                    <Card.Title className="item-name">{item.name}({item.description})</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted item-details">Price(Each):{item.price} <span className="order-content"><i className="material-icons" onClick={() => this.decrementItem(item.id, item.price)}>remove_circle_outline</i><span className="quantity">{this.state.selectedItems[item.id] || '0'}</span><i className="material-icons" onClick={() => this.incrementItem(item.id, item.price)}>add_circle_outline</i></span></Card.Subtitle>
                </Card.Body>
            </Card>
        )
    }

    handleOrderClick() {
        let orderObject = {};
        orderObject.restaurantid = this.props.restaurantDetails;
        orderObject.customerid = this.props.userDetails;
        orderObject.cost = this.state.basePrice*0.0925 + this.state.basePrice;
        orderObject.status = "ordered";
        orderObject.items = [];
        for (var key in this.state.selectedItems) {
            let element = {};
            element.menuid = key;
            element.quantity = this.state.selectedItems[key];
            orderObject.items.push(element);
        }
        
        this.props.createOrderTrigger(orderObject);
    }

    renderCart() {
        return (
            <div>
                <div>Cost before tax:{this.state.basePrice}</div>
                <div>Tax : {this.state.basePrice*0.0925}</div>
                <div>Total cost : {this.state.basePrice*0.0925 + this.state.basePrice}</div>
            </div>
        );
    }

    render() {
        const items = cloneDeep(this.props.items);
        const groupedItems = groupBy(items, 'category');
        return(
            <div>
                <div className="item-list">
                    {map(groupedItems, this.renderGroup.bind(this))}
                </div>
                {this.state.selectedItems && Object.keys(this.state.selectedItems).length !== 0 ? (this.props.order.orderPlacingStatus === true ? "" :  this.renderCart()) : "" }
                {this.state.selectedItems && Object.keys(this.state.selectedItems).length !== 0 ? (this.props.order.orderPlacingStatus === true ? "" : <Button onClick={this.handleOrderClick}>Order</Button> ) : ""}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        order : state.order
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        createOrderTrigger: (request) => {
            dispatch(createOrderTrigger(request));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Items);
