var express = require('express')
var app = express()
var http = require('http')
var passport = require('passport')
 
var app = express()

 // init mongodb
require('./server/config/db').connect(function(db) {
	console.log(`
***
*** Mongo connected to ${db.name}
***
`)
}); 

// express config
require('./server/config/app')(app) 

// passport config
require('./server/config/auth').configure(passport)

// route config
require('./server/config/routes')(app) // routes

app.listen(3000, function() {
	console.log(`
***
*** Turbokoala is listening on Port 3000
***
`																					);
})