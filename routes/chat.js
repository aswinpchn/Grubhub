const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Chat = require('../model/chat');
const passport = require('../passport');

router.put('/', passport.authenticate('jwt', { session: false }), (req, res) => { // Create a order -> menuid is in payload.
    if(!req.body.orderId || !req.body.sender || !req.body.message ) {
        res.writeHead(400);
        res.end("wrong parameters");
    } else {
        try {
            const chat = new Chat({
                _id : new mongoose.Types.ObjectId(),
                orderid : req.body.orderId,
                sender : {
                    userId: req.body.sender.userId,
                    name: req.body.sender.name
                },
                message : req.body.message,
            });
            chat.save();
            res.writeHead(200);
            res.end('success');
        } catch(error) {
            res.writeHead(500);
            res.end('failure');
        }
    }
});

router.get('/:orderid', passport.authenticate('jwt', { session: false }), (req, res) => {
    if(!req.params.orderid) {
        res.writeHead(400);
        res.end("wrong parameters");
    } else {
        const chatPromise = Chat.find({ orderid: req.params.orderid });
        chatPromise.then((response) => { 
            res.writeHead(200, {
                'Content-type' : 'application/json'
            });
            res.end(JSON.stringify(response));
        }).catch(() =>  {
            res.writeHead(500);
            res.end("db error");
        })
    }
});

module.exports = router;
