const mongoose = require ('mongoose');

const userSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name : String,
    email : String,
    password : String,
    phone : String,
    type : String,
    image : String,
});

module.exports = mongoose.model('User', userSchema);