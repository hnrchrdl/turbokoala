module.exports = function(_module) {
	_module.directive('app', function() {
		
		const restrict = 'E';
		const template = require('./app.html');
		const controller = ['$scope', '$timeout', 'Mpd', 'Stream', '$state', 'User', 
			function ($scope, $timeout, Mpd, Stream, $state, User) {
			
			this.showNav = false;

			this.toggleNav = () => { this.showNav = !this.showNav; };

			User.loggedInUser.then((user) => {
				this.connection = user.connection;
				// connect to MPD
				Mpd.connect(this.connection).then(() => {
					// Mpd connection established
					Stream.init(this.connection.stream);
				});
			});

			// bin Stream to controller instance
			this.Stream = Stream;

			// bind Mpd to controller instance
			this.Mpd = Mpd;

			this.getCurrentStateName = () => {
				return $state.current.name;
			};
			
			this.changeState = (name) => {
				$state.go(name);

				$timeout(() => {
					
					this.showNav = false;
				}, 200);
			};

			$scope.$on('nav:close', () => {
				$timeout(() => {
					this.showNav = false;
				}, 200);
			});
			$scope.$on('nav:open', () => {
				$timeout(() => {
					this.showNav = true;
				}, 0);
			});


			// close connection when scope gets detroyed
			$scope.$on('destroy', () => {
				Mpd.close();
			});

			
		}];
		const controllerAs = 'appCtrl';

		return {
			restrict,
			template,
			controller,
			controllerAs
		};	
	});

};