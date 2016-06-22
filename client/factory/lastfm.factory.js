
module.exports = function(_module) {

	_module.factory('LastFm', ['$http', function($http) {

		this.service = {
			getArtistInfo: (artistname) => {
				var url = `api/artist/${artistname}`;
				return $http.get(url);
			},
			getTopAlbums: (artistname) => {
				var url = `api/artist/${artistname}/topalbums`;
				return $http.get(url);
			}
		};

		return this.service;
	}]);
}
