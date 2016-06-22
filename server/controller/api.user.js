var User = require('../models/user')

module.exports.getAll = function(req, res) {		
	var users = User.find()
	res.json(users)
}

module.exports.getOne = function(req, res) {
	User.where({ _id: req.params.id }).findOne(function(err, user) {
		res.json(user)
	})
}

module.exports.getLoggedInUser = function(req, res) {
	res.json(req.user)
}

module.exports.createNew = function(req, res) {				
	var user = new User(req.body)
	var error = user.validateSync()
	if(error) {
		return res.status(400).send('User not valid.')
	}
	user.save(function(err, user) {
		if(err) return res.status(400).send('Could not save user') 
		res.json(user);
	})
}

module.exports.update = function(req, res) {	
	User.findOneAndUpdate({_id: req.params.id}, req.body, {
		runValidators: true
	}, function(err, user) {
		if(err) return res.status(400).send('Could not save user:' + err.toString()) 
		res.json(user);
	})
}