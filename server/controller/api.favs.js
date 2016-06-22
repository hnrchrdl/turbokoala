var Fav = require('../models/fav')

module.exports.getUserFavs = function(req, res) {
	Fav.find({ userid: req.user._id }, function(err, favs) {
		console.log(favs)
		res.json(favs)
	})
}

module.exports.getAllFavs = function(req, res) {
	Fav.find(function(err, favs) {
		res.json(favs)
	})
}

module.exports.createNew = function(req, res) {				
	var fav = new Fav(req.body);
	fav.userid = req.user._id;
	var error = fav.validateSync()
	if(error) {
		return res.status(400).send('Fav not valid.')
	}
	fav.save(function(err, user) {
		if(err) return res.status(400).send('Could not save user') 
		res.json(fav);
	})
}

module.exports.delete = function(req, res) {		
	Fav.remove({ _id: req.params.id }, function(err, response) {
		return res.json(response)
	})
}