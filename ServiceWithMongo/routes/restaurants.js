const express = require('express');
const router = express.Router();
const dbCall = require('../helper');
const Restaurant = require('../model/restaurant'); 
const mongoose = require('mongoose');
const Menu = require('../model/menu');
const verifyToken = require('../verifyToken');
const passport = require('../passport');
const Order = require('../model/order');
const OrderDetails = require('../model/orderDetails');
const User = require('../model/user');

router.get('/owner/:id', passport.authenticate('jwt', { session: false }), (req, res) => { // Get a restaurant by ownerid.
    if(!req.params.id)
    {
        res.writeHead(400);
        res.end("wrong parameters");
    } else {
        let user = req.params.id;

        let responsePromise = Restaurant.findOne({ ownerid : user });
        responsePromise.then((response) => {
          res.writeHead(200, {  // //res.type('json')  // This also will work similar to setting content type application/json
              'Content-type' : 'application/json'
          });
          res.end(JSON.stringify(response));    // We can't send JSON directly we have to change it to string using stringify

        }).catch((error) => {
            console.log(error);
            if(error == "no restaurant") {
                res.writeHead(404);
                res.end("restaurant not found");
            } else {
                res.writeHead(500);
                res.end("db error");
            }
        });
    }
});

router.put('/:restaurantid/menu', passport.authenticate('jwt', { session: false }), (req, res) => { // Add item to menu.
  if(!req.body.category || !req.body.name || !req.body.description || !req.body.price || !req.params.restaurantid) {
    res.writeHead(400);
    res.end("wrong parameters");
  } else {

  const menu = new Menu({
    _id : new mongoose.Types.ObjectId(),
    active : 1,
    category : req.body.category,
    name : req.body.name,
    description : req.body.description,
    image : "http://google.com",
    price : req.body.price,
  });

  let insertUserResponse  = Restaurant.updateOne({ _id :  req.params.restaurantid }, { $push : { menu : menu } });
  insertUserResponse.then((response) => {
    if(response.nModified == 1) {
      res.writeHead(200);
      res.end("success");
    } else {
      throw "db error";
    }
  }).catch((error) => {
    res.writeHead(500);
    res.end("db error");
  });
  }
});

router.post('/:restaurantid/menu', passport.authenticate('jwt', { session: false }), (req, res) => { // Update a menu item.
    if(!req.body.id) {
      res.writeHead(400);
      res.end("wrong parameters");
    } else {
      let responsePromise = dbCall(`update menu set category='${req.body.category}', name='${req.body.name}', description='${req.body.description}', price='${req.body.price}', restaurantid='${req.params.restaurantid}' where id=${req.body.id}`);
      responsePromise.then((response) => {
        let getUpdatedItem = dbCall(`select * from menu where id=${req.body.id}`);
        getUpdatedItem.then((response) => {
          res.writeHead(200, {
            'Content-type' : 'application/json'
          });
          res.end(JSON.stringify(response[0]));
        });
      }).catch((error) => { // Failure only if DB is down, all validations are done front end.
        res.writeHead(500);
        res.end("db error");
      });
    }
});

router.get('/search/:keyword', passport.authenticate('jwt', { session: false }), (req, res) => { // Search all restaurants by item name
    if(!req.params.keyword) {
      res.writeHead(400);
      res.end("wrong parameters");
    } else {
      const responsePromise = Restaurant.find({ menu : { $elemMatch : { name : { $regex: '.*' + req.params.keyword + '.*' } } } });
      responsePromise.then((response) => {
        res.writeHead(200, {
          'Content-type' : 'application/json'
        });
        res.end(JSON.stringify(response));
      }).catch((error) => {
        res.writeHead(500);
        res.end("db error");
      });
    }
});

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => { // Get all restaurants.
  const responsePromise = Restaurant.find();
  responsePromise.then((response) => {
    res.writeHead(200, {
      'Content-type' : 'application/json'
    });
    res.end(JSON.stringify(response));
  }).catch((error) => {
    res.writeHead(500);
    res.end("db error");
  });
});

router.get('/:restaurantid/orders', passport.authenticate('jwt', { session: false }), (req, res) => {
  if(!req.params.restaurantid) {
    res.writeHead(400);
    res.send('wrong paramaters');
  } else {
    let responsePromise = Order.find({ restaurantid : req.params.restaurantid });
    responsePromise.then(orderResponse=> {
      //console.log(orderResponse);
      let result = {
        numberoforders : 0
      };
      if(orderResponse.length == 0) {
        res.writeHead(200, {
          'Content-type' : 'application/json'
        });
        res.end(JSON.stringify(result));
      } else {
        let i = 0;
        result.numberoforders = orderResponse.length;
        let customerFetchPromise = [];
        
        result.orders = [];
        orderResponse.forEach(element => {
          result.orders[i] = {};
          result.orders[i].cost = element.cost;
          result.orders[i].status = element.status;
          result.orders[i].ordertime = element.ordertime;
          result.orders[i]._id = element._id;
          result.orders[i].menu = element.orderDetails;
          customerFetchPromise[i] = User.findOne({ _id : element.customerid });
          i++; 
        });
        Promise.all(customerFetchPromise).then(response=>{
          
          let j = 0;
          response.forEach(element=>{
            result.orders[j].customername = element.name;
            result.orders[j].email = element.email;
            result.orders[j].phone = element.phone;
            result.orders[j].image = element.image;
            j++;
          });
          
          res.writeHead(200, {
            'Content-type' : 'application/json'
          });
          res.end(JSON.stringify(result));

        }).catch(error=>{
          res.writeHead(500);
          res.end('db error');
        });
      }
    }).catch(error=> {
      res.writeHead(500);
      res.end('db error');
    });
  }
});

router.get('/:restaurantid/menu', passport.authenticate('jwt', { session: false }), (req, res) => { // get menu by restaurantid
  if(!req.params.restaurantid) {
    res.writeHead(400);
    res.send('wrong paramaters');
  } else {
    let result = {};
    let responsePromise =  Restaurant.findOne({ _id : req.params.restaurantid })
    responsePromise.then(response => {
      result.items = JSON.parse(JSON.stringify(response.menu));
      res.writeHead(200, {
        'Content-type' : 'application/json'
      });
      res.end(JSON.stringify(result));
    }).catch(error => {
      res.writeHead(500);
      res.end('db error');
    });
  }
});

router.delete('/:restaurantid/menu/:itemid', passport.authenticate('jwt', { session: false }), (req, res) => { // delete a menu from a restaurant
  if(!req.params.itemid) {
    res.writeHead(400);
    res.send('wrong paramaters');
  } else {
    let result = {};
    let responsePromise =  Restaurant.findOne({ _id : req.params.restaurantid })
    responsePromise.then(response => {
      const items = response.menu;
      const index = items.findIndex((item) => {
       return item._id.toString() == req.params.itemid
      });
      if(index >= 0) {
        items.splice(index, 1);
        let innerResponsePromise = Restaurant.updateOne({ _id: req.params.restaurantid }, { menu : items });
        innerResponsePromise.then(response => {
          if(response.nModified != 1) {
            throw "db error";
          }
          res.writeHead(200);
          res.end("success");
        }).catch(error => {
          console.log(error);
          res.writeHead(500);
          res.end('db error');
        });
      } else {
        res.writeHead(400);
        res.end('wrong item');
      }
    }).catch(error => {
      console.log(error);
      res.writeHead(500);
      res.end('db error');
    });
  }
});


module.exports = router;