const express = require('express');
const router = express.Router();
const dbCall = require('../helper'); 
const User = require('../model/user');
const mongoose = require('mongoose');


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
      let responsePromise = dbCall(`select * from user where email LIKE '${req.body.email}'`);
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
  
router.put('/customerSignUp', (req, res) => {
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
      let promiseResponse = dbCall(`select * from user where email LIKE '${req.body.email}'`);
      promiseResponse.then((response) => {
        if(response.length >= 1) {
          throw "duplicate user";
        } else {
          let insertUserResponse = dbCall(`insert into user values (NULL, '${req.body.name}', '${req.body.email}', '${req.body.password}', '${req.body.phone}', '${req.body.type}', 'http://google.com')`);
          insertUserResponse.then((response) => {
            let owneridResponse = dbCall(`select id from user where email LIKE '${req.body.email}'`);
            owneridResponse.then((response) => {
              dbCall(`insert into restaurant values (NULL, '${req.body.restaurantname}', '${req.body.zip}', '${req.body.cuisine}', '${req.body.image}', ${response[0].id})`);
              res.writeHead(200);
              res.end("success");
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
    let responsePromise = dbCall(`update user set name='${req.body.name}', password='${req.body.password}', phone='${req.body.phone}' where email='${req.body.email}'`);
    responsePromise.then((response) => {
      let c = {username : req.body.email, password : req.body.password, type : req.body.type};
      res.cookie('cookie',JSON.stringify(c),{maxAge: 900000, httpOnly: false, path : '/'});
      res.writeHead(200);
      res.end("success");
    }).catch((error) => { // Failur only if DB is down, all validations are done front end.
      res.writeHead(500);
      res.end("db error");
    });
  });

  router.get('/:customerid/orders', (req, res) => {
    if(!req.params.customerid) {
      res.writeHead(400);
      req.end('wrong parameters');
    } else {
      let responsePromise = dbCall(`select * from grubhub.order where customerid_order=${req.params.customerid}`);
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
          let restaurantFetchPromise = [];
          
          result.orders = [];
          orderResponse.forEach(element => {
            result.orders[i] = {};
            result.orders[i].cost = element.cost;
            result.orders[i].status = element.status;
            result.orders[i].ordertime = element.ordertime;
            result.orders[i].id = element.id;
            restaurantFetchPromise[i] = dbCall(`select * from restaurant where id=${element.restaurantid_order}`);
            i++; 
          });
          Promise.all(restaurantFetchPromise).then(response=>{
            let j = 0;
            response.forEach(element=>{
              result.orders[j].restaurantname = element[0].name;
              result.orders[j].cuisine = element[0].cuisine;
              result.orders[j].image = element[0].image;
              j++;
            });
            
            let k = 0;
            let orderFetchPromise = [];
            orderResponse.forEach(element => {
              orderFetchPromise[k] = dbCall(`select * from orderdetails where orderid_orderdetails=${element.id}`);
              k++; 
            });
            Promise.all(orderFetchPromise).then(response=>{
              let m = 0;
              response.forEach(element=>{
                result.orders[m].menu = [];
                Object.assign(result.orders[m].menu,{}, element);
                m++;
              });
              res.writeHead(200, {
                'Content-type' : 'application/json'
              });
              res.end(JSON.stringify(result));
            }).catch(error=>{
              res.writeHead(500);
              res.send('db error');
            });
  
          }).catch(error=>{
            res.writeHead(500);
            res.send('db error');
          });
        }
      }).catch(error=> {
        res.writeHead(500);
        res.send('db error');
      });
    }
  });

module.exports = router;
