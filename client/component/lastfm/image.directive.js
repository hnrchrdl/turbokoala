module.exports = function(_module) {
	_module.directive('lastfmImage', ['LastFm', '$timeout', function(LastFm, $timeout) {
		
		const restrict = 'A';
		//const template = '';
		const scope = {
			artist: '=',
			album: '=',
			isActive: '=',
			size: '@',
			hover: '='
		};
		const link = (scope, element) => {
			
			let size = scope.size || 4; // 1, 2, 3, 4

			scope.images = [];

			let isHovering = false;

			let getImageUrl = (images, size = 4) => {
				return scope.images[size]['#text']
			};

			let setImage = () => {
				if(scope.isActive1!==false && scope.artist && scope.images.length > 0) {
					if(isHovering) {
						element.css('background-image', 'linear-gradient( rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5) ), url(' + getImageUrl(scope.images, scope.size) + ')');
					} else {
						element.css('background-image', 'linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8) ), url(' + getImageUrl(scope.images, scope.size) + ')');
					}
				} else {
					element.css('background-image', 'none');
				}
			};

			let update = () => {
				
				scope.images = [];
				setImage(); // empty out

				window.console.log(scope.artist, scope.isActive)

				if(scope.artist && scope.album && scope.isActive !== false) {
					LastFm.getAlbumInfo(scope.artist, scope.album).then((response) => {
						if(response.data && response.data.album && Array.isArray(response.data.album.image)) {
							scope.images = response.data.album.image;
						} else {
							scope.images = [];
						}
					}, () => {
						// something went wrong
						scope.images = [];
					});
				}
				else if(scope.artist && scope.isActive !== false) {
					LastFm.getArtistInfo(scope.artist).then((response) => {
						window.console.log(response)
						if(response.data && response.data.artist && Array.isArray(response.data.artist.image)) {
							scope.images = response.data.artist.image;
						} else {
							scope.images = [];
						}
					}, () => {
						// something went wrong
						scope.images = [];
					});
				}
			};

			element.on('mouseenter', () => {
				if(scope.hover) {
					isHovering = true;
					setImage();
				}
			});

			element.on('mouseleave', () => {
				$timeout(() => {
					isHovering = false;
					setImage();
				});
			});

			scope.$watch('artist', (artist) => {
				if(artist) {
					update();
				}
			});

			scope.$watch('isActive', (isActive) => {
				update();
			});

			scope.$watchCollection('images', (images) => {
				setImage();
			});

		};

		return {
			restrict,
			scope,
			link 
		};	
	}]);

};