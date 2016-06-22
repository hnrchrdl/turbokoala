
module.exports = function(_module) {
	_module.directive('settings', function() {
		
		const restrict = 'E';
		const template = require('./settings.container.html');
		const controller = ['Settings', function (Settings) {
			this.Settings = Settings;
		}];
		const controllerAs = 'settingsCtrl';

		return {
			restrict,
			template,
			controller,
			controllerAs
		};	
	});

	_module.directive('settings', ['Settings', function(Settings) {
		
		const restrict = 'A';
		const scope = {
			settings: '@'
		};
		const link = (scope, element) => {
			element.on('click', () => {
				Settings.setActive(Settings.active === scope.settings ? null : scope.settings);
			});
		}

		return {
			restrict,
			scope,
			link
		};	
	}]);


	_module.directive('connectionSettings', ['Mpd', 'User', function(Mpd, User) {
		
		const restrict = 'E';
		const template = require('./settings.connection.html');
		const controller = function() {

			this.status = 0; // 1 = ok, 0 = failed, 2 = loading
			
			User.loggedInUser.then((user) => {
				this.connection = user.connection;
			}); 

			this.Mpd = Mpd;

			this.save = () => {
				// get loggedInUser
				User.loggedInUser.then((me) => {
					// find user and update
					me.connection = this.connection;
					me.put();
				});
			};

			this.test = () => {
				this.status = 2;
				Mpd.test(this.connection).then(() => {
					//resolved
					return this.status = 1;
				}, () => {
					//rejected
					return this.status = 0;
				});
			};

			this.connect = () => {
				Mpd.connect(this.connection);
			};
			
		};
		const controllerAs = 'csCtrl';

		return {
			restrict,
			template,
			controller,
			controllerAs 
		};	
	}]);

	_module.directive('streamSettings', function() {
		
		const restrict = 'E';
		const template = require('./settings.stream.html');
		const controller = ['Stream', 'User', function(Stream, User) {
			this.Stream = Stream;
			window.console.log(this.Stream.url)
			this.save = () => {
				Stream.url = this.url;
				// get loggedInUser
				User.loggedInUser.then((me) => {
					me.connection.stream = this.url;
					me.put().then(() => {
						this.alert = { class: 'alert-success', msg: 'Saved.'};
					});
				});
			};
		}];
		const controllerAs = 'ssCtrl';

		return {
			restrict,
			template,
			controller,
			controllerAs 
		};	
	});

	_module.directive('userSettings', function() {
		
		const restrict = 'E';
		const template = require('./settings.user.html');
		const controller = ['User', function(User) {
			User.loggedInUser.then((user) => {
				this.me = user;
			});
			this.save = () => {
				// get loggedInUser
				this.me.put().then(() => {
					this.alert = { class: 'alert-success', msg: 'Saved.'};
				});
			};
		}];
		const controllerAs = 'usCtrl';
		
		return {
			restrict,
			template,
			controller,
			controllerAs 
		};	
	});
};