const mongoose = require ('mongoose');

const menuSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    active : Boolean,
    category : String,
    name : String,
    description : String,
    image : String,
    price : Number,
});

module.exports = mongoose.model('Menu', menuSchema);