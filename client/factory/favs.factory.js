
module.exports = function(_module) {

	_module.factory('Favs', ['$http', function($http) {

		let _userFavs, _allFavs = [];

		let _addFav = (artist, title) => {
			return $http({
				method: 'POST',
				url: 'api/favs',
				data: {
					artist,
					title
				}
			});
		};

		let _removeFav = (id) => {
			return $http({
				method: 'DELETE',
				url: 'api/favs/' + id
			});
		};


		let $$service = {

			updateUserFavs()  { 
				$http.get('api/userfavs').then((response) => {
					_userFavs = response.data;
				});
			},

			updateAllFavs() {
				return $http.get('api/favs').then((response) => {
					_allFavs = response.data;
				});
			},

			// getUserFavs() { return _userFavs; },

			// getAllFAvs() { return _allFavs; },

			toggleFav: (artist, title) => {
				let fav = _userFavs.find((fav) => fav.artist === artist && fav.title === title );
				if(fav) {
					_removeFav(fav._id).then($$service.updateUserFavs);
				} else {
					_addFav(artist, title).then($$service.updateUserFavs);
				}
			},

			isUserFav(song) {
				let fav = _userFavs.find((fav) => fav.artist === song.Artist && fav.title === song.Title );
				return !!fav;
			}
		};

		$$service.updateUserFavs();
		$$service.updateAllFavs();

		return $$service;
	}]);
}
