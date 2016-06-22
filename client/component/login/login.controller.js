module.exports = function(module) {
	module.controller('loginController', ['Mpd', 'Connection', function (Mpd, Connection) {

		this.error = null;
		
		let connection = Connection.get();
		this.host = connection.host || null;
		this.port = connection.port || null;
		this.pw = connection.pw || null;
		this.streamUrl = connection.streamUrl || null;

		this.connect = () => {
			Connection.set(this.host, this.port, this.pw, this.streamUrl);
			Mpd.connect(this.host, this.port, this.pw)
			.then(() => {
				// we have a connection
				//Stream.setUrl(this.stream.url);
			})
			.catch((err) => {
				this.error = err.toString();
			});
		};
	}]);
};