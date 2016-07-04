module.exports = (_module) => {
	_module.directive('playlists', () => {
		
		const template = require('./playlists.html');
		const controller = ['$scope', 'Mpd', 'Playlist', function($scope, Mpd, Playlist) {
			this.storedPlaylists = Mpd.playlists;

			this.mode = 'stored'; // the default playlist mode
			this.activePlaylist = null;

			this.numberOfSongs = 50;
			this.artistName = "";

			this.changeMode = (name) => {
				this.mode = name; // stored || dynamic
			};

			this.loadPlaylist = (name) => {
				this.activePlaylist = name;
				Mpd.getPlaylistByName(name).then((playlist) => {
					window.console.log(playlist)
					this.playlist = playlist;
				});
			};

			this.createDynamicPlaylist = () => {
				Playlist.createDynamicPlaylistFromArtistName(this.artistName, this.numberOfSongs).then((songs) => {
					window.console.log(songs);
					this.dynamicPlaylist = songs;
				});
			};

			this.songTableOptions = {
				controls: {
		 			playlist: false
		 		},
		 		columns: {
		 			// artist: false,
		 			pos: false
		 		}
			};

		}];
		const controllerAs = 'playlistsCtrl';


		return {
			template,
			controller,
			controllerAs
		};
	});
}