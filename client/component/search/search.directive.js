module.exports = function(_module) {
	
	_module.directive('search', function() {
		
		const restrict = 'E';
		const template = require('./search.html');
		const controller = ['$scope', '$state', '$stateParams', 'Mpd', function($scope, $state, $stateParams, Mpd) {

			this.input = $stateParams.input;
			this.artists = [];
			this.albums = [];
			
			this.search = (input) => {
				window.console.log(input)
				if(input.length > 2) {

					$state.go('app.search', { input: input });
					
				}
				else {
					// input too short

				}
			}

			$scope.$watch(() => { return $stateParams.input; }, (input) => {

				doSearch(input);

			});

			let doSearch = (input) => {

				this.isLoading = true;
				var done = _.after(2, () => { this.isLoading = false; });

				Mpd.search('Artist', input).then((artists) => {

					this.artistGroups = artists ? artists : null;
					this.artists = artists ? Object.keys(artists) : [];
					this.artists = _.orderBy(this.artists, (artist) => {
						return this.artistGroups[artist].length;
					}, 'desc');
					done();
				});

				Mpd.search('Album', input).then((albums) => {
					this.albumGroups = albums ? albums : null;
					this.albums = albums ? Object.keys(albums) : [];
					this.albums = _.orderBy(this.albums, (album) => {
						return this.albumGroups[album].length;
					}, 'desc');
					done();
				});
			};

		}];
		const controllerAs = 'searchCtrl';
		const link = (scope, element) => {
			
		};

		return {
			restrict,
			template,
			controller,
			controllerAs,
			link
		};	
	});

	_module.directive('searchbar', function() {
		
		const restrict = 'E';
		const template = require('./searchbar.html');
		const controller = ['$rootScope', '$state', function($rootScope, $state) {
			this.input = '';

			this.search = (input) => {
				this.input = '';
				window.console.log(input);
				$state.go('app.search', { input: input });
				$rootScope.$broadcast('nav:close');
			}
		}];
		const controllerAs = 'searchbarCtrl';
		const link = (scope, element) => {
			// focus input element
			// scope.$on('') = () => {

			// 	element.find('input').focus();
			// }
		};

		return {
			restrict,
			template,
			controller,
			controllerAs,
			link
		};	
	});

};