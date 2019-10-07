import React from 'react';
import { Card, Alert, Form, Button } from 'react-bootstrap';
import { cloneDeep, groupBy, map } from 'lodash';
import { connect } from 'react-redux';
import { createOrderTrigger } from '../actions/order-actions';

class Items extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItems: {}
        }

        this.incrementItem = this.incrementItem.bind(this);
        this.decrementItem = this.decrementItem.bind(this);
        this.handleOrderClick = this.handleOrderClick.bind(this);
    }

    renderGroup(items, category) {
        return(
            <div key={category}>
                <h4 className="category-header">{category}</h4>
                {map(items, this.renderEachItem.bind(this))}
            </div>
        )
    }

    incrementItem(id) {
        const selectedItems = cloneDeep(this.state.selectedItems);
        const itemCount = selectedItems[id] || 0;
        selectedItems[id] = itemCount + 1;
        this.setState({
            selectedItems: selectedItems
        });
    }

    decrementItem(id) {
        const selectedItems = cloneDeep(this.state.selectedItems);
        const itemCount = selectedItems[id] || 0;
        if(itemCount > 0) {
            selectedItems[id] = itemCount - 1;
            if(selectedItems[id] === 0) {
                delete selectedItems[id];
            }
            this.setState({
                selectedItems: selectedItems
            });
        }
    }

    renderEachItem(item) {
        return(
            <Card className="shadow bg-white rounded" key={item.id}>
                <Card.Body className="item-card">
                    <Card.Title className="item-name">{item.name}({item.description})</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted item-details">Price(Each):{item.price} <span className="order-content"><i className="material-icons" onClick={() => this.decrementItem(item.id)}>remove_circle_outline</i><span className="quantity">{this.state.selectedItems[item.id] || '0'}</span><i className="material-icons" onClick={() => this.incrementItem(item.id)}>add_circle_outline</i></span></Card.Subtitle>
                </Card.Body>
            </Card>
        )
    }

    handleOrderClick() {
    }

    render() {
        const items = cloneDeep(this.props.items);
        const groupedItems = groupBy(items, 'category');
        return(
            <div>
                <div className="item-list">
                    {map(groupedItems, this.renderGroup.bind(this))}
                </div>
                { this.state.selectedItems && Object.keys(this.state.selectedItems).length ?<Button onClick={this.handleOrderClick}>Order</Button> : "" }
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        createOrderTrigger: (request) => {
            dispatch(createOrderTrigger(request));
        }
    };
};

export default connect(null, mapDispatchToProps)(Items);
