const express = require('express');
const router = express.Router();
const dbCall = require('../helper'); 
const User = require('../model/user');
const Order = require('../model/order');
const mongoose = require('mongoose');
const Restaurant = require('../model/restaurant');
const { secret } = require('../constants');
const jwt = require('jsonwebtoken');
const verifyToken = require('../verifyToken');
const passport = require('../passport');
var kafka = require('../kafka/client');

router.get('/:id', passport.authenticate('jwt', { session: false }), (req, res) => { // get user by id
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
      let token = jwt.sign(req.body, secret);
      let result = {};
      result.name = response[0].name;
      result.phone = response[0].phone;
      result.type = response[0].type;
      result.image = response[0].image;
      result._id = response[0]._id;
      result.token = token;
      //res.cookie('cookie',token,{maxAge: 9000000, httpOnly: false, path : '/'});
      res.writeHead(200, { 
        'Content-type' : 'application/json'
      });
      res.end(JSON.stringify(result));
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

router.post('/reLogin',  (req, res) => {
  if(!req.body.token) {
    res.writeHead(401);
    res.end("token not-found");
  } else {
    jwt.verify(req.body.token, secret, function(err, decoded) {
      if(err) {
          console.log(err.message);
          res.writeHead(403);
          res.end("Tampered token");
      } else {
          req.body.email = decoded.email;
          req.body.password = decoded.password;
          req.body.type = decoded.type;
          
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
              let token = jwt.sign(req.body, secret);
              let result = {};
              result.name = response[0].name;
              result.phone = response[0].phone;
              result.type = response[0].type;
              result.image = response[0].image;
              result._id = response[0]._id;
              result.token = token;
              //res.cookie('cookie',token,{maxAge: 9000000, httpOnly: false, path : '/'});
              res.writeHead(200, { 
                'Content-type' : 'application/json'
              });
      res.end(JSON.stringify(result));
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
      }
      });
  }
});
  
router.put('/customerSignUp', (req, res) => { // Customer SignUp
  req.body.path = 'ownerSignUp';
  kafka.make_request('user',req.body, function(err,results){
      console.log('in result');
      console.log(results);
      if (err){
          console.log("Inside err");
          res.json({
              status:"error",
              msg:"System Error, Try Again."
          })
      }else{
          console.log("Inside else");
          if(results.statusCode == 400) {
            res.writeHead(400);
            res.end("wrong parameters");
          } else if(results.statusCode == 200) {
            res.writeHead(200);
            res.end('success');
          } else if(results.statusCode == 401) {
            res.writeHead(401);
            res.end("duplicate user");
          } else {
            res.writeHead(500);
            res.end("db error");
          }
    }
      
  });
});
 
router.put('/ownerSignUp', (req, res) => { // Owner SignUp
  req.body.path = 'customerSignUp';
  kafka.make_request('user',req.body, function(err,results){
    console.log('in result');
    console.log(results);
    if (err){
        console.log("Inside err");
        res.json({
            status:"error",
            msg:"System Error, Try Again."
        })
    }else{
        console.log("Inside else");
        if(results.statusCode == 400) {
          res.writeHead(400);
          res.end("wrong parameters");
        } else if(results.statusCode == 200) {
          res.writeHead(200);
          res.end('success');
        } else if(results.statusCode == 401) {
          res.writeHead(401);
          res.end("duplicate user");
        } else {
          res.writeHead(500);
          res.end("db error");
        }
  }
    
});
});
  
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => { // Update profile (Both customer and buyer.)
  if(!req.body.name && !req.body.email) {
    res.writeHead(500);
    res.end("db error");
  }

  let responsePromise = User.updateOne({ email : req.body.email },{ name : req.body.name, password : req.body.password, phone : req.body.phone });
  responsePromise.then((response) => {
    
    if(response.nModified != 1) {
      throw "db error";
    }
    
    let newBody = {
      email : req.body.email,
      password : req.body.password,
      type : req.body.type
    };
    
    let token = jwt.sign(newBody, secret);
    res.cookie('cookie', token,{maxAge: 9000000, httpOnly: false, path : '/'});
    res.writeHead(200);
    res.end("success");
  }).catch((error) => { // Failure only if DB is down, all validations are done front end.
    res.writeHead(500);
    res.end("db error");
  });
});

router.get('/:customerid/orders', passport.authenticate('jwt', { session: false }), (req, res) => { // Get orders for a user
  req.body.path = 'customerid/orders';
  req.body.type = 'get';
  req.body.customerid = req.params.customerid;

  kafka.make_request('user',req.body, function(err,results){
    console.log('in result');
    console.log(results);
    if (err){
        console.log("Inside err");
        res.json({
            status:"error",
            msg:"System Error, Try Again."
        })
    } else{
        console.log("Inside else");
        if(results.statusCode == 400) {
          res.writeHead(400);
          res.end("wrong parameters");
        } else if(results.statusCode == 200) {
          res.writeHead(200, {
            'Content-type' : 'application/json'
          });
          res.end(JSON.stringify(results.result));
        } else {
          res.writeHead(500);
          res.end("db error");
        }
    }
    
  });
});

module.exports = router;
