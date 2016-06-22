module.exports = function(_module) {
	
	_module.directive('nowplaying', ['LastFm', 'Mpd', function(LastFm, Mpd) {
		
		const restrict = 'E';
		const template = require('./nowplaying.html');
		const controller = ['$scope', function($scope) {
			
			this.isLoading = false;
			this.artistinfo = null;

			let update = (artist) => {

				this.isLoading = true;
				
				if(artist) {
					LastFm.getArtistInfo(artist).then((response) => {
						this.artistinfo = response.data.artist;
						this.isLoading = false;
					});
				} else {
					this.artistinfo = null;
					this.isLoading = false;
				}
			};

			// Whenver Status song changes, call update.
			$scope.$watch(() => { return Mpd.currentsong.Artist; }, (artist) => { 
				update(artist); 
			});
		}];
		const controllerAs = 'nowCtrl';

		return {
			restrict,
			template,
			controller,
			controllerAs
		};	
	}]);

};