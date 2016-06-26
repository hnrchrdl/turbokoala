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

module.exports.getAlbumDetails = function(req, res) {
	lastfm.request('album.getInfo', {
		artist: req.params.artistname,
		album: req.params.albumname,
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

module.exports.getSimilarArtists = function(req, res) {
	lastfm.request('artist.getSimilar', {
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