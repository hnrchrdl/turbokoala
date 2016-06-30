module.exports = (_module) => {
	_module.directive('artist', () => {
		 
		 const restrict = 'E';
		 const template = require('./artist.html');
		 const controller = ['$stateParams', 'Mpd', 'LastFm',  function($stateParams, Mpd, LastFm) {
		 	
		 	this.artist = $stateParams.artist;
		 	this.categoryToShow = 'albums';

		 	Mpd.getAllAlbumsOfArtist(this.artist).then((albums) => {
		 		this.albums = albums;
		 	});
		 	
		 	LastFm.getArtistInfo(this.artist).then((response) => {
		 		this.artistinfo = response.data;
		 	});

		 	LastFm.getSimilarArtists(this.artist).then((response) => {
		 		this.similar = response.data;
		 	});

		 	this.countAlbums = () => {
		 		return this.albums ? Object.keys(this.albums).length : 0;
		 	}

		 	this.addToPlaylist = (songs) => {
		 		Mpd.addToPlaylist(songs).then(() => {
		 			window.console.log('songs added');
		 		});
		 	}

		 	this.albumoptions = {
		 		controls: {
		 			playlist: false
		 		},
		 		columns: {
		 			artist: false,
		 			pos: false
		 		}
		 	}
		 
		 }];
		 const controllerAs = 'artistCtrl';

		return {
			restrict,
			template,
			controller,
			controllerAs,
		};
	});

}