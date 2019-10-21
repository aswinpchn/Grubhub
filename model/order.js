const mongoose = require('mongoose');

const orderDetailsSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    category : String,
    name : String,
    description : String,
    image : String,
    price : Number,
    quantity : Number,
});

const orderSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    customerid : mongoose.Schema.Types.ObjectId,
    restaurantid : mongoose.Schema.Types.ObjectId,
    cost : Number,
    status : String,
    Time : Date,
    orderDetails : [orderDetailsSchema],
});

module.exports = mongoose.model('Order', orderSchema);