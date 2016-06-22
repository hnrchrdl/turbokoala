var angular = require('angular');
const module = angular.module('app', ['ui.router', 'restangular', 'ngAnimate', 'ngSanitize']);

/******** controller *********************************************/
require('client/component/login/login.controller')(module);

/******** components *********************************************/
require('client/component/artist/artist.directive.js')(module);
require('client/component/lastfm/image.directive.js')(module);
require('client/component/app/app.directive.js')(module);
require('client/component/controls/controls.directive.js')(module);
require('client/component/mpd/mpd.directive.js')(module);
require('client/component/navbar/navbar.directive.js')(module);
require('client/component/nowplaying/nowplaying.directive.js')(module);
require('client/component/queue/queue.directive.js')(module);
require('client/component/search/search.directive.js')(module);
require('client/component/settings/settings.directive.js')(module);
require('client/component/songtable/songtable.directive.js')(module);

/******** factories *********************************************/
require('client/factory/favs.factory')(module);
require('client/factory/lastfm.factory')(module);
require('client/factory/mpd.factory')(module);
require('client/factory/settings.factory')(module);
require('client/factory/stream.factory')(module);
require('client/factory/user.factory')(module);

/******** filters *********************************************/
require('client/filter/timestring.filter')(module);


/******** routes *********************************************/
module.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider
    .state('app', {
        url: '/',
        template: '<app></app>',
        resolve: {
            // authorizationCheck: ['$http', function($http) {
            //     return $http.get()
            //    // Do your API checks or whatever
            // }],
        }
    })
    .state('app.nowplaying', {
        url: 'nowplaying',
        template: '<nowplaying></nowplaying>',
    })
    .state('app.queue', {
        url: 'queue',
        template: '<queue></queue>',
    })
    .state('app.search', {
        url: 'search/:input',
        template: '<search></search>',
    })
    .state('app.artist', {
        url: 'artist/:artist',
        template: '<artist></artist>',
    })
}]);


module.exports = module;