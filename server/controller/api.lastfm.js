var lastfm = require('../config/lastfm')

module.exports.getArtistDetails = function(req, res) {
	lastfm.request('artist.getinfo', {
		artist: req.params.artistname,
		handlers: {
			success: function(data) {
				res.json(data);
			},
			error: function(err) {
				res.status(500);
				res.end();
			}
		}
	})
}

module.exports.getTopAlbums = function(req, res) {
	lastfm.request('artist.gettopalbums', {
		artist: req.params.artistname,
		handlers: {
			success: function(data) {
				res.json(data);
			},
			error: function(err) {
				res.status(500);
				res.end();
			}
		}
	})
}