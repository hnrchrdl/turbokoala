var passport = require('passport')
var path = require('path')

module.exports.get = function(req, res) {
	res.sendFile(path.resolve('server/views/login.html'))
}

module.exports.post = passport.authenticate('local', { 
	successRedirect: '/#/nowplaying', // angular routes
    failureRedirect: '/login',
    failureFlash: true 
})