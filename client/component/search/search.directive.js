module.exports = function(_module) {
	
	_module.directive('search', function() {
		
		const restrict = 'E';
		const template = require('./search.html');
		const controller = ['$stateParams', 'Mpd', function($stateParams, Mpd) {


			this.input = $stateParams.input;
			
			this.search = (input) => {
				if(input.length > 2) {

					this.isLoading = true;

					Mpd.search('any', input).then((response) => {

						let results = { 
							artists: [],
							albums: [],
							albumartists: [],
							composer: [],
							title: [],
							genres: [],
						};

						this.results = response.reduce((prev, curr) => {
							let artist = curr.Artist;
							let album = curr.Album;
							let albumartist = curr.AlbumArtist;
							let composer = curr.Composer;
							let title = curr.Title;
							let genre = curr.Genre;
							if(artist && artist.length > 1
									&& artist.toLowerCase().indexOf(input.toLowerCase()) > -1 
									&& prev.artists.indexOf(artist) === -1) {
								prev.artists.push(artist);
							}
							if(album && album.length > 1
									&& album.toLowerCase().indexOf(input.toLowerCase()) > -1 
									&& prev.albums.indexOf(album) === -1) {
								prev.albums.push(album);
							}
							this.isLoading = false;
							return prev;
						}, Object.assign({}, results));
					});
				}
				else {
					// input too short

				}
			}

			// Perform a search when scope gets active
			this.search(this.input);
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