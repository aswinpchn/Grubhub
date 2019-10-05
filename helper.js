var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 50,
    host     : 'grubhub.cwotr7vrym6h.us-west-1.rds.amazonaws.com',
    user     : 'root',
    password : '12345678',
    database : 'grubhub' 
  });

// pool.on('acquire', function(connection) { // Just acquiring a existing connection. // https://www.npmjs.com/package/mysql -- See pooling area.
//   console.log('Connection %d acquired', connection.threadId);
// });

// pool.on('release', function (connection) {
//   console.log('Connection %d released', connection.threadId);
// });

// pool.on('connection', function (connection) { // this is create a new connection till pool limit when no connection is available.
//   console.log('Connection %d connected', connection.threadId);
// });

// pool.on('enqueue', function () {
//   console.log('Waiting for available connection slot');
// });

const dbCall = (query) => {
    //console.log(query);
    var callPromise = new Promise ((resolve, reject) => {
      pool.query(query, (error, results, fields) => {
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

// Very very important, Most RDS management cant be done from MySqlWorkbench, AWS CLI is very hectic set-up to be done, Workbench does the job good.
// To see connections currently to a db, go to Workbench AWS RDS tile, You can see client connections in administrator.
/*
Generally, without pooling, db connection is created at first and kept open till node application close(Nodemon if we use/Ctrl+C, connection is closed safely).
The thing is without pooling, the system will work, but there will be so much backlog and db server has to service one by one.(When there are 100 hits, connection are not opened and closed, same connection persists). 

In case of pooling, db connection is created when we make first hit(Lazy), it can open a maximum number of connections we are specifying in config.
-->These are in pool terminology, Once connections is created, it exists in pool till appn is open, It will be acquired by a process and released by it.
--> pool.query tries to get one connection from pool(Connection is creation), if not creates a new one, use it release it. 
All these what I have said can be tested in MySqlWorkbench.

https://npmjs.com/package/mysql -- See pooling part.
https://stackoverflow.com/questions/58246890/port-not-released-when-i-have-a-custom-process-onexit-in-nodejs/58247029#58247029

*/





/* Single connection type.

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


*/
