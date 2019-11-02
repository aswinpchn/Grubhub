const passport = require('passport');
const passportJWT = require('passport-jwt');
const { secret } = require('./constants');

// We initially get basic passport using import, then we add a straegy to it and export this modified passport to outside world.
// Anyone who wants to use our strategies, have to import this specific passport file and passport.authenticate
// Actually passport is mainly for authorisation and not authtication, we are using it for authentication here.(So only focus is on setting user, as per examples and all)
passport.use(new passportJWT.Strategy({
    jwtFromRequest : passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : secret,
}, function(decoded, done) {
    return done(null, decoded); // What ever you send as second para, it will be as req.user only  
}));

module.exports = passport;

// http://www.passportjs.org/docs/ for all passport related doc.
// See authenticate area for more details.
/*
By default, if authentication fails, Passport will respond with a 401 Unauthorized status, and any additional route handlers will not be invoked. 
If authentication succeeds, the next handler will be invoked and the <<<req.user>>>> property will be set to the authenticated user.
*/