module.exports = (_module) => {
	_module.factory('Playlist', ['$q', 'Mpd', 'LastFm', ($q, Mpd, LastFm) => {
		
		let $$service = {
			createDynamicPlaylistFromArtistName(artistName, numberOfSongs) {
				
				var defer = $q.defer();

				LastFm.getSimilarArtists(artistName).then((response) => {
					
					let similarPool = response.data;
					let artists = similarPool.similarartists.artist;
					
					let findSongsRecusive = (artists, maxSongs, results) => {

						if(results.length > maxSongs) {
							return defer.resolve(results);
						}

						let random = artists[Math.floor(Math.random() * artists.length)]; // select random

						Mpd.search('Artist', random.name).then((result) => {
							window.console.log(result && Object.keys(result));
							if(result && Object.keys(result).filter((item) => item === random.name).length > 0) {

								let songs = result[random.name];
								results.push(songs[Math.floor(Math.random() * songs.length)]); // push random

							}

							return findSongsRecusive(artists, maxSongs, results);
						});
					};

					findSongsRecusive(artists, numberOfSongs, []);

					
				});
				
				
				return defer.promise;
			}
		};

		return $$service;
	}]);
};