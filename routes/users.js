const express = require('express');
const router = express.Router();
const dbCall = require('../helper'); 
const User = require('../model/user');
const Order = require('../model/order');
const mongoose = require('mongoose');
const Restaurant = require('../model/restaurant');


router.get('/:id', (req, res) => { // get user by id
  
    if(!req.params.id)
    {
      res.writeHead(400);
      res.end("wrong parameters");
    } else {
      let user = req.params.id;
  
      let responsePromise = dbCall(`select * from user where id=${user}`);
      responsePromise.then((response) => {
  
        if(response.length !== 1) {
          throw "no user";
        }
        // //res.type('json')  // This also will work similar to setting content type application/json
        res.writeHead(200, { 
          'Content-type' : 'application/json'
        });
        res.end(JSON.stringify(response[0]));    // We can't send JSON directly we have to change it to string using stringify
  
      }).catch((error) => {
        if(error == "no user") {
          res.writeHead(404);
          res.end("user not found");
        } else {
          res.writeHead(500);
          res.end("db error");
        }
      });
    }
  });
  
router.post('/login', (req, res) => { // Login
  if(!req.body.email || !req.body.password || !req.body.type) {
    res.writeHead(400);
    res.end("wrong parameters");
  } else {
    
    let responsePromise = User.find({email : req.body.email });
    responsePromise.then((response) => {
      if(response.length !== 1) { // but yeah, wont or should go more than one as signup email restriction is there.
        throw "no user";
      }

      if(response[0].type !== req.body.type) {
        throw "wrong user type";
      }

      if(response[0].password !== req.body.password) {
        throw "invalid password";
      }
      let c = {username : req.body.email, password : req.body.password, type : req.body.type};
      res.cookie('cookie',JSON.stringify(c),{maxAge: 900000, httpOnly: false, path : '/'});
      res.writeHead(200, { 
        'Content-type' : 'application/json'
      });
      res.end(JSON.stringify(response[0]));
    }).catch((error)=>{
      if(error == "no user") {
        res.writeHead(404);
        res.end("user not found");
      } else if(error == "invalid password") {
        res.writeHead(401);
        res.end("invalid password");
      } else if(error == "wrong user type") {
        res.writeHead(401);
        res.end("wrong user type");
      } else {
        res.writeHead(500);
        res.end("db error");
      }
    });
  }
});
  
router.put('/customerSignUp', (req, res) => { // Customer SignUp
if(!req.body.name || !req.body.email || !req.body.password || !req.body.phone || !req.body.type || !req.body.image) {
  res.writeHead(400);
  res.end("wrong parameters");
} else {
  let duplicateEmail = false;
  let promiseResponse = User.find({email : req.body.email });
  promiseResponse.then(response=>{
    if(response.length >= 1) {
      throw "duplicate user";
    } else {

      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        phone : req.body.phone,
        type : req.body.type,
        image : "http://google.com",
      });
      
      let insertResponse = user.save();
      insertResponse.then(response=>{
        if(response.name === req.body.name) {
          res.writeHead(200);
          res.end('success');
        } else {
          throw "db error";
        } 
      });
    }
  }).catch(error=>{
    if(error == "duplicate user") {
      res.writeHead(401);
      res.end("duplicate user");
    } else {
      res.writeHead(500);
      res.end("db error");
    }
  });
}
});
 
router.put('/ownerSignUp', (req, res) => { // Owner SignUp
  if(!req.body.name || !req.body.email || !req.body.password || !req.body.phone || !req.body.type || !req.body.image || !req.body.zip || !req.body.restaurantname || !req.body.cuisine) {
    res.writeHead(400);
    res.end("wrong parameters");
  } else {
    let duplicateEmail = false;
    let promiseResponse = User.find({email : req.body.email });
    promiseResponse.then((response) => {
      if(response.length >= 1) {
        throw "duplicate user";
      } else {
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
            phone : req.body.phone,
            type : req.body.type,
            image : "http://google.com",
          });
        
          let insertResponse = user.save();
          insertResponse.then((response) => {
            const restaurant = new Restaurant({
              _id : new mongoose.Types.ObjectId(),
              name : req.body.restaurantname,
              zip : req.body.zip,
              cuisine : req.body.cuisine,
              image : req.body.image,
              ownerid : user._id, //response.toObject()['_id'], // Both can be used.
            });

            const insertRestaurantResponse = restaurant.save();

            insertRestaurantResponse.then(response => {
              res.writeHead(200);
              res.end("success");
            }).catch(error => {
              throw "db error";
            });

        });
      }
    }).catch((error) => {
      if(error == "duplicate user") {
        res.writeHead(401);
        res.end("duplicate user");
      } else {
        res.writeHead(500);
        res.end("db error");
      }
    });
  }
});
  
router.post('/', (req, res) => { // Update profile (Both customer and buyer.)
  if(!req.body.name && !req.body.email) {
    res.writeHead(500);
    res.end("db error");
  }

  let responsePromise = User.updateOne({ email : req.body.email },{ name : req.body.name, password : req.body.password, phone : req.body.phone });
  responsePromise.then((response) => {
    
    if(response.nModified != 1) {
      throw "db error";
    }

    let c = {username : req.body.email, password : req.body.password, type : req.body.type};
    res.cookie('cookie',JSON.stringify(c),{maxAge: 900000, httpOnly: false, path : '/'});
    res.writeHead(200);
    res.end("success");
  }).catch((error) => { // Failure only if DB is down, all validations are done front end.
    res.writeHead(500);
    res.end("db error");
  });
});

router.get('/:customerid/orders', (req, res) => { // Get orders for a user
  if(!req.params.customerid) {
    res.writeHead(400);
    req.end('wrong parameters');
  } else {
    let responsePromise = Order.find({ customerid : req.params.customerid })
    responsePromise.then(orderResponse=> {
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
        result.orders = orderResponse;

        res.writeHead(200, {
          'Content-type' : 'application/json'
        });
        res.end(JSON.stringify(result));
      }
    }).catch(error=> {
      res.writeHead(500);
      res.send('db error');
    });
  }
});

module.exports = router;
