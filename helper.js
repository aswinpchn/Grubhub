var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'grubhub.cwotr7vrym6h.us-west-1.rds.amazonaws.com',
    user     : 'root',
    password : '12345678',
    database : 'grubhub' 
  });

connection.connect((error) => {  // If you don't put this callback, app won't crash.
if(error)
  console.log(error);
});

// connection.query is a callbacl type one, so instead of putting inside a prime, we can return things from it stand-alone as return.

const dbCall = (query) => {
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

module.exports = dbCall;
