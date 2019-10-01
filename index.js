var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var session = require('express-session');
var cors = require('cors');
var mysql = require('mysql');

app.use(cookieParser()) // needed if you want to sign a cookie
// res.cookie("aswin","21"); // in this way we can set a cookie in our client side

// Cookie is basic, session is something that needs more work.
// https://stackoverflow.com/questions/3804209/what-are-sessions-how-do-they-work
// https://www.youtube.com/watch?v=SUZAIYLebnQ&t=9s

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '12345678',
  database : 'grubhub' 
});
 
connection.connect((error) => {  // If you don't put this callback, app won't crash.
  if(error)
    console.log(error);
});

// connection.query is a callbacl type one, so instead of putting inside a prime, we can return things from it stand-alone as return.

let dbCall = (query) => {
  //console.log(query);
  var callPromise = new Promise ((resolve, reject) => {
    connection.query(query, (error, results, fields) => {
      if(error)
      {
        reject(error);
      }
      resolve(results);
    });
  }); 

  return callPromise;
}

app.get('/user/:id', (req, res) => {
  
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

      res.writeHead(200, {  // //res.type('json')  // This also will work similar to setting content type application/json
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

app.post('/user/login', (req, res) => {
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

app.put('/user/customerSignUp', (req, res) => {
  if(!req.body.name || !req.body.email || !req.body.password || !req.body.phone || !req.body.type || !req.body.image) {
    res.writeHead(400);
    res.end("wrong parameters");
  } else {
    let duplicateEmail = false;
    let promiseResponse = dbCall(`select * from user where email LIKE '${req.body.email}'`);
    promiseResponse.then(response=>{
      if(response.length >= 1) {
        throw "duplicate user";
      } else {
        let insertResponse = dbCall(`insert into user values (NULL, '${req.body.name}', '${req.body.email}', '${req.body.password}', '${req.body.phone}', '${req.body.type}', 'http://google.com')`);
        insertResponse.then(response=>{
          if(response.affectedRows == 1) {
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

app.put('/user/ownerSignUp', (req, res) => {
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

app.post('/user/', (req, res) => {
  if(!req.body.name && !req.body.mail && !req.body.id) {
    res.writeHead(500);
    res.end("db error");
  }
  let responsePromise = dbCall(`update user set name='${req.body.name}', email='${req.body.email}', password='${req.body.password}', phone='${req.body.phone}' where id='${req.body.id}'`);
  responsePromise.then((response) => {
    res.writeHead(200);
    res.end("success");
  }).then((error) => {
    res.writeHead(500);
    res.end("db error");
  });
});

app.listen(3001);
console.log("Server Listening on port 3001");