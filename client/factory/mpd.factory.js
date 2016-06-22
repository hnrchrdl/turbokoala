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

			errors: [],

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
								return this.$$service.errors.push(err);
							}

							// Successfully connected to mpd!
							this.$$service.isConnected = true;

							this.client.emit('system', 'player'); // Emit mpd player event.
							this.client.emit('system', 'playlist'); // Emit mpd playlist event.
							
							// Resolving promise.
							this.whenConnected.resolve();
						})
					});
				});

				// client error events
			  	this.client.on('error', (err) => {
					window.console.error('\n\n# CLIENT:ERROR\n', err);
					this.$$service.errors.push(err);
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

			test: (connection) => {
				
				let whenConnected = $q.defer();
				
				let testclient = mpd.connect(connection);
				// client ready event
				testclient.once('ready', () => {
					
					let { pw } = connection;
					this.client.sendCommand(cmd('password', [pw]), (err, response) => {
						
						// close connection right away
						testclient.sendCommand('close', []);
						
						$timeout(() => {
							if(err) {
								// Error.
								return whenConnected.reject();
							}
							// Resolving promise.
							return whenConnected.resolve();							
						});
					});
				});

				return whenConnected.promise;
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
						// parse response
						this.$$service.playlist = mpd.parseArrayMessage(response);
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
						results.resolve(mpd.parseArrayMessage(response));
					});
					return results.promise;
				});
				
				
			},

			getAllAlbumsOfArtist: (artistname) => {

				window.console.log('search: ', artistname)
				window.console.log(this.whenConnected.promise)
				let type = 'Artist';
				let what = artistname;
				
				return this.whenConnected.promise.then(() => {
					let results = $q.defer();
					window.console.log('h')
					this.$$service.exec('search', [type, what], function(err, response) {
						if(err) results.reject(err);
						results.resolve(_.groupBy(mpd.parseArrayMessage(response), 'Album'));
					});
					return results.promise;
				});

				
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
				catch(exception) {
					// mpd error. reconnect
					window.console.error('\n\n#CLIENT:EXCEPTION\n\n', exception.toString());
					this.$$service.connect();
				}
			}
		};
		
		return this.$$service;
	}]);
}