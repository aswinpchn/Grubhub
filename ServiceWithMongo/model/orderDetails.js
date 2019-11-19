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

module.exports = mongoose.model('OrderDetails', orderDetailsSchema);