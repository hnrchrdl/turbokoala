module.exports = function(_module) {
	_module.directive('lastfmImage', ['LastFm', '$timeout', function(LastFm, $timeout) {
		
		const restrict = 'A';
		//const template = '';
		const scope = {
			artist: '=',
			album: '=',
			isActive: '=',
			size: '@',
			hover: '=',
			square: '=',
			isImgTag: '=',
			images: '='
		};
		const link = (scope, element) => {
			
			let _size = scope.size || 4; // 1, 2, 3, 4
			let _images = scope.images || [];
			let _isHovering = false;

			let getImageUrl = (size = 4) => {
				return _images[size]['#text']
			};

			let setImage = () => {
				if(scope.isActive!==false && _images && _images.length > 0) {

					if(scope.isImgTag) {
						element.attr('src', getImageUrl(_size));
					}

					else {
						
						if(scope.square) {
							element.css('background-size', 'contain');
						} else {
							element.css('background-size', 'cover');
						}

						if(_isHovering) {
							element.css(`background-image`,
							 	`linear-gradient( rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5) ), url(${getImageUrl(_size)})`);
						} else {
							element.css(`background-image`, 
								`linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8) ), url(${getImageUrl(_size)})`);
						}
					}

				} else {

					element.css('background-image', 'none');
				}
			};

			let update = () => {
				
				_images = [];
				setImage(); // empty out

				if(scope.artist && scope.album && scope.isActive !== false) {
					LastFm.getAlbumInfo(scope.artist, scope.album).then((response) => {
						if(response.data && response.data.album && Array.isArray(response.data.album.image)) {
							_images = response.data.album.image;
						} else {
							_images = [];
						}
						setImage();
					}, () => {
						// something went wrong
						_images = [];
						setImage();
					});
				}
				else if(scope.artist && scope.isActive !== false) {
					LastFm.getArtistInfo(scope.artist).then((response) => {
						if(response.data && response.data.artist && Array.isArray(response.data.artist.image)) {
							_images = response.data.artist.image;
						} else {
							_images = [];
						}
						setImage();
					}, () => {
						// something went wrong
						_images = [];
						setImage();
					});
				}
			};

			element.on('mouseenter', () => {
				if(scope.hover) {
					_isHovering = true;
					setImage();
				}
			});

			element.on('mouseleave', () => {
				$timeout(() => {
					_isHovering = false;
					setImage();
				});
			});

			scope.$watchGroup(['artist', 'album', 'isActive'], (updates) => {
				let [artist] = updates;
				if(artist) update();
			});

			scope.$watchCollection('images', (images) => {
				_images = images;
			});

			scope.$watchCollection(() => { return _images; }, (images) => {
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