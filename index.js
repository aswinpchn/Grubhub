var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors');
const restaurantsRoute = require('./routes/restaurants');
const usersRoute = require('./routes/users');
const ordersRoute = require('./routes/orders');

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

app.use('/user', usersRoute);
app.use('/restaurant', restaurantsRoute);
app.use('/order', ordersRoute);

app.listen(3001);
console.log("Server Listening on port 3001");

module.exports = app;