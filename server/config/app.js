var express = require('express')
var passport = require('passport')
var netApi = require('net-browserify')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')
var flash = require('connect-flash')

module.exports = function(app) {
	// Connect to the net-browserify using sockets
	app.use(netApi()) 
	
	// Static things in public folder
	app.use(express.static('public'))
	
	// Use cookie parser
	app.use(cookieParser())

	// Use body parser
	app.use(bodyParser.json())
	app.use(bodyParser.urlencoded({
		extended: true // using qs as parser
	}))

	// Use a session
	app.use(session({ 
		secret: 'gae§$&tvw45z4zh',
		resave: false,
	  	saveUninitialized: true
	}))

	// Flash Message Middleware
	app.use(flash())

	// Use passport
	app.use(passport.initialize())
	app.use(passport.session())
}