var auth 			= require('./auth').auth
var authApi 		= require('./auth').authApi

var loginCtrl 		= require('../controller/login')
var logoutCtrl 		= require('../controller/logout')
var appCtrl 		= require('../controller/app')
var userCtrl		= require('../controller/api.user')
var lastfmCtrl		= require('../controller/api.lastfm')
var favCtrl			= require('../controller/api.favs')

module.exports = function(app) {

	app.get('/', auth, appCtrl.get)

	app.get('/login', loginCtrl.get)
	app.post('/login', loginCtrl.post)
	app.get('/logout', logoutCtrl.get)
	
	app.get('/api/me',authApi, userCtrl.getLoggedInUser)
	app.get('/api/user', authApi, userCtrl.getAll)
	app.get('/api/user/:id', authApi, userCtrl.getOne)
	app.post('/api/user', authApi, userCtrl.createNew)
	app.put('/api/user/:id', authApi, userCtrl.update)

	app.get('/api/artist/:artistname', authApi, lastfmCtrl.getArtistDetails);
	app.get('/api/artist/:artistname/topalbums', authApi, lastfmCtrl.getTopAlbums);

	app.get('/api/userfavs', authApi, favCtrl.getUserFavs)
	app.get('/api/favs', authApi, favCtrl.getAllFavs)
	app.post('/api/favs', authApi, favCtrl.createNew)
	app.delete('/api/favs/:id', authApi, favCtrl.delete)
}