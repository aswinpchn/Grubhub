const express = require('express');
const router = express.Router();
const dbCall = require('../helper'); 
const mongoose = require('mongoose');
const Order = require('../model/order');
const OrderDetails = require('../model/orderDetails');
const Restaurant = require('../model/restaurant');

const itemsValidity = (req) => {
    return req.body.items.every((element) => {
            if(!element.menuid || element.quantity <= 0 || element.quantity == NaN) {
                return false;
            }
            return true;
        });
}

router.post('/:orderid', (req, res) => {
    console.log(req.body);
    if(!req.body.status) {
        res.writeHead(400);
        res.end("wrong parameters");
    } else {
        let responsePromise = dbCall(`update grubhub.order set status='${req.body.status}' where id=${req.params.orderid}`);
        responsePromise.then(response => {
            if(response.affectedRows > 0) {
                res.writeHead(200);
                res.end('success');
            }
        }).catch(error => {
            console.log(error)
            res.writeHead(500);
            res.end("db error");
        });
    }
});

router.put('/',(req, res) => { // Create a order -> menuid is in payload.
    if(!req.body.restaurantid || !req.body.cost || !req.body.status || !req.body.customerid ) {
        res.writeHead(400);
        res.end("wrong parameters");
    } else if(!itemsValidity(req)) {
        res.writeHead(400);
        res.end("items not valid");
    } else {

        let restaurantItemsPromise = Restaurant.findOne({ _id : req.body.restaurantid});

        restaurantItemsPromise.then(response => {
            let orderDetails = [];
            req.body.items.every((element) => {
                let item;
                for(let i = 0; i < response.menu.length; i++) {
                    if(element.menuid == response.menu[i]._id) {
                        item = response.menu[i];
                    }
                }
                const o = new OrderDetails({
                    _id: new mongoose.Types.ObjectId(),
                    category : item.category,
                    name : item.name,
                    description : item.description,
                    image : item.image,
                    price : item.price,
                    quantity : element.quantity,
                });

                orderDetails.push(o);
            });

            const order = new Order({
                _id : new mongoose.Types.ObjectId(),
                customerid : req.body.customerid,
                restaurantid : req.body.restaurantid,
                cost : req.body.cost,
                status : req.body.status,
                ordertime : new Date(),
                orderDetails : orderDetails,
            });

            order.save();

            res.writeHead(200);
            res.end('success');
        }).catch(error => {
            console.log(error);
            res.writeHead(500);
            res.end('db error');
        });


    }
});

module.exports = router;
