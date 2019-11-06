const mongoose = require ('mongoose');

const chatSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    orderId: mongoose.Schema.Types.ObjectId,
    sender: mongoose.Schema.Types.ObjectId,
    receiver: mongoose.Schema.Types.ObjectId,
    message: mongoose.Schema.Types.ObjectId
});

module.exports = mongoose.model('Chat', chatSchema);