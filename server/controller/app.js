var path = require('path')

module.exports.get = function(req, res) {
	console.log('wtf')
	res.sendFile(path.resolve('server/views/app.html'))
}