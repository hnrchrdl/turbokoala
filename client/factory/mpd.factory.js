var angular = require('angular');
var _ = require('lodash');

var mpd = require('mpd');
var cmd = mpd.cmd;

module.exports = function(_module) {
	_module.factory('Mpd', ['$rootScope', '$q', '$timeout', 'Stream', 'Favs', function($rootScope, $q, $timeout, Stream, Favs) {
		
		let lastConnection;
		this.client;

		this.whenConnected = $q.defer();

		// react to mpd events
		this.events = new Map();

		this.events.set('player', () => {
			this.$$service.updateStatus();
			this.$$service.updateCurrentSong();
		});

		this.events.set('options', () => {
			this.$$service.updateStatus();
		});

		this.events.set('playlist', () => {
			this.$$service.updatePlaylist();
		});


		this.$$service = {
			
			isConnected: false,
			currentsong: {},
			status: {},
			playlist: {},

			connect: (connection) => {

				connection = connection || lastConnection;
				lastConnection = connection;

				if(!connection) {
					$q.reject();
				}

				this.$$service.isConnecting = true;

				if(this.client && this.client.idling) {
					this.$$service.close(); // close existing connection
				}
				// connect to mpd
				this.client = mpd.connect(connection);
				
				// --------   Mpd Events   --------------------------

				// client ready event
				this.client.once('ready', () => {
					
					let { pw } = connection;
					this.client.sendCommand(cmd('password', [pw]), (err, response) => {
						
						$timeout(() => {
							this.$$service.isConnecting = false;
							
							if(err) {
								// Error.
								window.console.error(err)
								$rootScope.$broadcast('mpd:error', err);
								return;
							}

							// Successfully connected to mpd!
							$rootScope.$broadcast('mpd:success', 'Connected to MPD');


							this.$$service.isConnected = true;

							this.client.emit('system', 'player'); // Emit mpd player event.
							this.client.emit('system', 'playlist'); // Emit mpd playlist event.
							
							// Resolving promise.
							this.whenConnected.resolve();
						});
					});
				});

				// client error events
				$timeout(() => {
				  	this.client.on('error', (err) => {
				  		window.console.error(err)
				  		$rootScope.$broadcast('mpd:error', err);
					});
				});
			  	
			  	// client system events
				this.client.on('system', (name) => {
					window.console.info(`\n# CLIENT:EVENT\n'${name}\n\n`)

				  	// Call special event actions when mpd emits events
				  	let eventAction = this.events.get(name);
				  	if(typeof eventAction === 'function') {
				  		// EventAction is a function, so we call it
				  		eventAction();
				  	};
				
				});

				// client system events
				this.client.on('end', (name) => {
					window.console.info(`#CLIENT:END\n${name}\n\n`)

				});

				return this.whenConnected.promise;
				
			},

			close: () => {
				if(this.client) {
					this.client.sendCommand('close', []);
					this.$$service.isConnected = false;
				}
			},

			updateStatus: () => {
				this.whenConnected.promise.then(() => {
					this.client.sendCommand('status', (err, response) => {
						$timeout(() => {
							if(err) { return this.$$service.status = {}; }
							this.$$service.status = mpd.parseKeyValueMessage(response);
						});
					});
				});
			},

			updateCurrentSong: () => {
				this.whenConnected.promise.then(() => {
					this.client.sendCommand('currentsong', (err, response) => {
						$timeout(() => {
							if(err) { return this.$$service.currentsong = {}; }
							this.$$service.currentsong = mpd.parseKeyValueMessage(response);
						});
					});
				});
			},

			updatePlaylist: () => {
				this.whenConnected.promise.then(() => {
					// send playlist command
					this.client.sendCommand('playlistinfo', (err, response) => {
						if(err) { this.$$service.playlist = []; }
						$timeout(() => {
							// parse response
							this.$$service.playlist = mpd.parseArrayMessage(response);
						});
					});
				});
			},

			search: (type, what) => {
				
				type = type || 'any';
				what = what || '';
				
				return this.whenConnected.promise.then(() => {

					let results = $q.defer();

					this.$$service.exec('search', [type, what], function(err, response) {

						if(err) results.reject(err);

						let resultArr = mpd.parseArrayMessage(response);
						
						if(_.isArray(resultArr) && resultArr.length > 0 && !_.isEmpty(resultArr[0])) {
							results.resolve(_.groupBy(resultArr, type));
						} else {
							results.resolve(null);
						}
					});
					return results.promise;
				});
				
				
			},

			getAllAlbumsOfArtist: (artistname) => {

				let type = 'Artist';
				let what = artistname;
				
				return this.whenConnected.promise.then(() => {
					let results = $q.defer();
					this.$$service.exec('search', [type, what], function(err, response) {
						if(err) results.reject(err);

						let resultArr = mpd.parseArrayMessage(response);
						
						if(_.isArray(resultArr) && resultArr.length > 0 && !_.isEmpty(resultArr[0])) {
							results.resolve(_.groupBy(resultArr, 'Album'));
						} else {
							results.resolve(null);
						}
					});
					return results.promise;
				});

				
			},

			addToPlaylist: (songs) => {
				
				let complete = $q.defer();

				let addSong = (song) => {
					let defer = $q.defer();
					let file = song.file;
					this.$$service.exec('findadd', ['file', file], (err, response) => {
						if(err) return defer.reject();
						return defer.resolve(response);
					});
					return defer.promise;
				};

				let added = [];
				let addSongsRecursive = (songs) => {

					if(songs.length === 0) {
						$rootScope.$broadcast('mpd:success', `${add.length} song${added.length > 1 ? 's' : ''} added to playlist.`);
						return complete.resolve(added);
					}

					let song = songs.pop();
					
					addSong(song).then(() => {
						added.push(song);
						return addSongsRecursive(songs);
					}, () => {
						// something failed. keep going anyways
						return addSongsRecursive(songs);
					});
				};

				songs = Array.isArray(songs) ? songs : [songs];
				songs.reverse();

				addSongsRecursive(songs);

				return complete.promise;
			},



			exec: (cmdName, args, cb) => {
				//convert args to array if it is not already an array
				if(typeof args === 'undefined') {
					args = [];
				}
				if(!angular.isArray(args)) { args = [args]; }

				window.console.info('\n\n# CLIENT:SEND COMMAND\n\n', cmdName, args);
				
				try {	
					this.whenConnected.promise.then(() => {
						// send Command to mpd client
						this.client.sendCommand(cmd(cmdName, args), function(err, msg) {
							if(!err) {
								// control audio stream
								if(['play', 'next', 'previous'].find((item) => { return cmdName === item; })) {
									Stream.start();
								}
								if(['stop', 'pause'].find((item) => { return cmdName === item; })) {
									Stream.stop();
								}
							} 
							if(cb) { return cb(err, msg); }
						});
					}, (err) => {
						// not connected
						if(cb) { cb(err, null); }
					});
				}
				catch(err) {
					// mpd error while executing command
					$rootScope.$broadcast('mpd:error', err);
				}
			}
		};
		
		return this.$$service;
	}]);
}