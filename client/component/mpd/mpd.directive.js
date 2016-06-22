module.exports = function(_module) {
	_module.directive('mpd', ['Mpd', function(Mpd) {
		
		const restrict = 'A';
		const scope = {
			mpd: '@',
			args: '='
		};
		const link = function(scope, element) {
			element.on('click', function() {
				Mpd.exec(scope.mpd, scope.args);
			});
		};

		return {
			restrict,
			scope,
			link
		}
	}]);
};