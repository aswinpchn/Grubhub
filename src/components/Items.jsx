import React from 'react';
import { Card, Alert, Form } from 'react-bootstrap';
import { cloneDeep, groupBy, map } from 'lodash';

class Items extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedItems: {}
        }

        this.incrementItem = this.incrementItem.bind(this);
        this.decrementItem = this.decrementItem.bind(this);
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
            this.setState({
                selectedItems: selectedItems
            });
        }
    }

    renderEachItem(item) {
        return(
            <Card className="shadow bg-white rounded" key={item.id}>
                <Card.Body className="item-card">
                    <Card.Title className="item-name">{item.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted item-details">{item.price} <span className="order-content"><i className="material-icons" onClick={() => this.decrementItem(item.id)}>remove_circle_outline</i><span className="quantity">{this.state.selectedItems[item.id] || '0'}</span><i className="material-icons" onClick={() => this.incrementItem(item.id)}>add_circle_outline</i></span></Card.Subtitle>
                </Card.Body>
            </Card>
        )
    }

    render() {
        const items = cloneDeep(this.props.items);
        const groupedItems = groupBy(items, 'category');
        return(
            <div className="item-list">
                {map(groupedItems, this.renderGroup.bind(this))}
            </div>
        );
    }
}

export default Items;
