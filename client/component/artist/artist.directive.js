module.exports = (_module) => {
	_module.directive('artist', () => {
		 
		 const restrict = 'E';
		 const template = require('./artist.html');
		 const controller = ['$stateParams', 'Mpd', 'LastFm',  function($stateParams, Mpd, LastFm) {
		 	
		 	this.artist = $stateParams.artist;

		 	Mpd.getAllAlbumsOfArtist(this.artist).then((albums) => {
		 		this.albums = albums;
		 	});
		 	
		 	LastFm.getArtistInfo(this.artist).then((response) => {
		 		this.artistinfo = response.data;
		 	});

		 	this.albumoptions = {
		 		controls: {
		 			fav: false,
		 			play: false,
		 			move: false,
		 			delete: false
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