module.exports = function(_module) {
	
	_module.directive('queue', ['LastFm', 'Mpd', 'Favs', function(LastFm, Mpd, Favs) {
		
		const restrict = 'E';
		const template = require('./queue.html');
		const controller = ['$scope', function($scope) {
			this.Mpd = Mpd;
			$scope.$watchCollection(() => { return Mpd.playlist; }, (playlist) => {
				this.playlist = playlist;
				window.console.log(this.playlist)
			});

		}];
		const controllerAs = 'qCtrl';

		return {
			restrict,
			template,
			controller,
			controllerAs
		};	
	}]);

};