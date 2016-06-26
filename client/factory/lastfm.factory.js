module.exports = function(_module) {

	_module.factory('LastFm', ['$http', function($http) {

		this.service = {
			getArtistInfo: (artistname) => {
				var url = `api/artist/${artistname}`;
				return $http.get(url);
			},
			getAlbumInfo: (artistname, albumname) => {
				var url = `api/artist/${artistname}/album/${albumname}`;
				return $http.get(url);
			},
			getTopAlbums: (artistname) => {
				var url = `api/artist/${artistname}/topalbums`;
				return $http.get(url);
			},
			getSimilarArtists: (artistname) => {
				var url = `api/artist/${artistname}/similar`;
				return $http.get(url);
			}
		};

		return this.service;
	}]);
}
