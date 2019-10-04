const express = require('express');
const router = express.Router();
const dbCall = require('../helper'); 

router.get('/owner/:id', (req, res) => { // Get a restaurant by ownerid.
    if(!req.params.id)
    {
        res.writeHead(400);
        res.end("wrong parameters");
    } else {
        let user = req.params.id;

        let responsePromise = dbCall(`select * from restaurant where ownerid=${user}`);
        responsePromise.then((response) => {

            if(response.length !== 1) {
                throw "no restaurant";
            }

        res.writeHead(200, {  // //res.type('json')  // This also will work similar to setting content type application/json
            'Content-type' : 'application/json'
        });
        res.end(JSON.stringify(response[0]));    // We can't send JSON directly we have to change it to string using stringify

        }).catch((error) => {
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

router.put('/:restaurantid/menu', (req, res) => { // Add item to menu.
    if(!req.body.category || !req.body.name || !req.body.description || !req.body.price || !req.params.restaurantid) {
      res.writeHead(400);
      res.end("wrong parameters");
    } else {
      let insertUserResponse = dbCall(`insert into menu values (NULL, 1,  '${req.body.category}', '${req.body.name}', '${req.body.description}', 'http://google.com', '${req.body.price}', ${req.params.restaurantid})`);
      insertUserResponse.then((response) => {
        if(response.affectedRows == 1) {
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

router.post('/:restaurantid/menu', (req, res) => { // Update a menu item.
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

router.get('/search/:keyword', (req, res) => { // Search restaurant by item name
    if(!req.params.keyword) {
      res.writeHead(400);
      res.end("wrong parameters");
    } else {
      const responsePromise = dbCall(`SELECT * FROM grubhub.restaurant INNER JOIN (select restaurantid from grubhub.menu where name like '%${req.params.keyword}%' group by restaurantid) as menu ON grubhub.restaurant.id = menu.restaurantid`);
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

router.get('/', (req, res) => { // Get all restaurants.
  const responsePromise = dbCall(`SELECT * FROM grubhub.restaurant LIMIT 100`);
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

router.get('/:restaurantid/orders', (req, res) => {
  if(!req.params.restaurantid) {
    res.writeHead(400);
    res.send('wrong paramaters');
  } else {
    let responsePromise = dbCall(`select * from grubhub.order where restaurantid_order=${req.params.restaurantid}`);
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
        let customerFetchPromise = [];
        
        result.orders = [];
        orderResponse.forEach(element => {
          result.orders[i] = {};
          result.orders[i].cost = element.cost;
          result.orders[i].status = element.status;
          result.orders[i].ordertime = element.ordertime;
          customerFetchPromise[i] = dbCall(`select * from user where id=${element.customerid_order}`);
          i++; 
        });
        Promise.all(customerFetchPromise).then(response=>{
          let j = 0;
          response.forEach(element=>{
            result.orders[j].customername = element[0].name;
            result.orders[j].email = element[0].email;
            result.orders[j].phone = element[0].phone;
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