const mongoose = require ('mongoose');
const User = require('./user');
const Menu = require('./menu');

const menuSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    active : Boolean,
    category : String,
    name : String,
    description : String,
    image : String,
    price : Number,
});

const restaurantSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name : String,
    zip : String,
    cuisine : String,
    image : String,
    menu : [menuSchema] ,
    ownerid : mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model('Restaurant', restaurantSchema);