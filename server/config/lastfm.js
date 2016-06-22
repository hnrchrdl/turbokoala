// last fm
var LastFmNode = require('lastfm').LastFmNode
var lastfmConfig = require('../../config.json').lastfm

var lastfm = new LastFmNode(lastfmConfig)

console.log(`
***
*** Last.FM configured
*** API KEY    ${lastfm.api_key}
*** USERAGENT  ${lastfm.useragent}
***
`)

module.exports = lastfm