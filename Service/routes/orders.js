const express = require('express');
const router = express.Router();
const dbCall = require('../helper'); 

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

router.put('/',(req, res) => { // Insert a order -> menuid is in payload.
    if(!req.body.restaurantid || !req.body.cost || !req.body.status || !req.body.customerid ) {
        res.writeHead(400);
        res.end("wrong parameters");
    } else if(!itemsValidity(req)) {
        res.writeHead(400);
        res.end("items not valid");
    } else {
        let responsePromise = dbCall(`insert into grubhub.order values  (NULL, ${req.body.restaurantid}, ${req.body.cost}, 'ordered', ${req.body.customerid}, NOW())`);
        responsePromise.then(response => {
            if(response.insertId && response.insertId != NaN) {
                let orderid = response.insertId;
                let fullMenuDetails = [];
                let selectResponse = [];
                let i = 0;
                req.body.items.forEach(element => {
                    selectResponse[i] = dbCall(`select * from menu where id=${element.menuid}`);
                    i++;
                });
                Promise.all(selectResponse).then((response) => { //Promise.all is mysterious, look into it.
                    fullMenuDetails = response
                    let insertResponse = [];
                    let i = 0;
                    fullMenuDetails.forEach(element => {
                        insertResponse[i] = dbCall(`insert into orderdetails values(NULL, ${orderid}, '${element[0].category}', '${element[0].name}', '${element[0].description}', 'http://google.com', ${element[0].price}, ${req.body.items[i].quantity})`);
                        i++;
                    });
                    Promise.all(insertResponse).then((response) => {
                        let insertSuccess = response.every((element) => {
                                                if(!element.insertId || !(element.insertId != NaN)) {
                                                    return false;
                                                }
                                                return true;
                                            });
                        if(!insertSuccess) {
                            throw "db error";
                        } else {
                            res.writeHead(200);
                            res.end('success');
                        }
                    }).catch(error => {
                        //console.log(error);
                        res.writeHead(500);
                        res.end("db error");
                    });
                }).catch(error => {
                    //console.log(error);
                    res.writeHead(500);
                    res.end("db error");
                }); 
            } else {
                throw "order creation error";
            }
        }).catch(error => {
            if(error === "items not valid") {
                res.writeHead(400);
                res.end("items not valid");
            }
            else if(error === "order creation error") {
                res.writeHead(500);
                res.end("order creation error");
            } else {
                res.writeHead(500);
                res.end("db error");
            }
        });
    }
});

module.exports = router;
