var LocalStrategy = require('passport-local').Strategy
var User = require('../models/user')

module.exports.configure = function(passport) {

	passport.use(new LocalStrategy(function(username, password, done) {
		
		// Look for a user with given username
	    User.findOne({ email: username }, function (err, user) {
	    	if (err) { return done(err); }
	    	if (!user) {
	        	return done(null, false, { message: 'Incorrect username.' })
	    	}
	      	if (!user.validatePassword(password)) {
	        	return done(null, false, { message: 'Incorrect password.' })
	    	}
	    	return done(null, user);
	    })

	}))

	passport.serializeUser(function(user, done) {
	    done(null, user._id)
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
	    	if(err) done(err)
	    	console.log('user:', user)
	    	done(null, user)
		})
	});

	console.log(`
***
*** Passport configured
***
`)

}


// Create middleware to authenticate requests
module.exports.auth = function(req, res, next) {
	console.log('auth:', req.user)
	if(!req.user) return res.redirect('/login'); // not authenticated
	// ok
	next();
}
module.exports.authApi = function(req, res, next) {
	if(!req.user) return res.sendStatus(403); // not authenticated
	// ok
	next();
}