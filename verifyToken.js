const { secret } = require('./constants');
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined') {
        
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;

        jwt.verify(req.token, secret, function(err, decoded) {
        if(err) {
            console.log(err.message);
            res.writeHead(403);
            res.end("Forbidden");
        } else {
            req.decoded = decoded;
            next();
        }
        });
    } else { 
        res.writeHead(403);
        res.end("Forbidden");
    }
}

module.exports = verifyToken;