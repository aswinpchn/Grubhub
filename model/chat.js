const mongoose = require ('mongoose');

const chatSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    orderid: mongoose.Schema.Types.ObjectId,
    sender: { userId: mongoose.Schema.Types.ObjectId, name: String },
    message: String
});

module.exports = mongoose.model('Chat', chatSchema);