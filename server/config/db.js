var mongoose = require('mongoose')
var User = require('../models/user')

module.exports.loadModels = function() {
	
}


module.exports.connect = function(callback) {
	mongoose.connect('mongodb://localhost/koala');
	var db = mongoose.connection;
	db.on('error', console.log.bind(console, 'mongo connection error'));
	db.once('open', function() {
	});
	if(callback) return callback(db);
}

module.exports.disconnect = function(argument) {
	// body...
}