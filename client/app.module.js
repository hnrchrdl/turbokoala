var angular = require('angular');
const module = angular.module('app', ['ui.router', 'restangular', 'ngAnimate', 'ngSanitize']);

/******** controller *********************************************/
require('client/component/login/login.controller')(module);

/******** components *********************************************/
require('client/component/alert/alert.directive.js')(module);
require('client/component/artist/artist.directive.js')(module);
require('client/component/lastfm/image.directive.js')(module);
require('client/component/app/app.directive.js')(module);
require('client/component/controls/controls.directive.js')(module);
require('client/component/mpd/mpd.directive.js')(module);
require('client/component/navbar/navbar.directive.js')(module);
require('client/component/nowplaying/nowplaying.directive.js')(module);
require('client/component/playlists/playlists.directive.js')(module);
require('client/component/queue/queue.directive.js')(module);
require('client/component/search/search.directive.js')(module);
require('client/component/settings/settings.directive.js')(module);
require('client/component/songtable/songtable.directive.js')(module);

/******** factories *********************************************/
require('client/factory/common.factory')(module);
require('client/factory/favs.factory')(module);
require('client/factory/lastfm.factory')(module);
require('client/factory/mpd.factory')(module);
require('client/factory/playlist.factory')(module);
require('client/factory/settings.factory')(module);
require('client/factory/stream.factory')(module);
require('client/factory/user.factory')(module);

/******** filters *********************************************/
require('client/filter/timestring.filter')(module);


/******** routes *********************************************/

require('client/app.routes')(module);


module.exports = module;