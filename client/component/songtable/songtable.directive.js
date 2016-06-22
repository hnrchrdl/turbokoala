module.exports = (_module) => {
	_module.directive('songTable', () => {
		
		const restrict = 'E';
		const template = require('./songtable.html');
		const scope = {
			songs: '=',
			activeId: '=',
			options: '='
		};
		const controller = ['$scope','Favs', function($scope, Favs) {
			this.Favs = Favs;
			this.songs = $scope.songs;
			
			$scope.$watch('songs', (songs) => {
				this.songs = songs;
			});

			$scope.$watch('activeId', (activeId) => {
				this.activeId = activeId;
			});

			this.options = $scope.options;
		}];
		const controllerAs = 'stCtrl';

		return {
			restrict,
			template,
			scope,
			controller,
			controllerAs
		};
	});
}