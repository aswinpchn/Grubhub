const mongoose = require ('mongoose');
const User = require('./user');

const restaurantSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name : String,
    zip : String,
    cuisine : String,
    image : String,
    ownerid : mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model('Restaurant', restaurantSchema);