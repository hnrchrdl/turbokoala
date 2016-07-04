module.exports = function(_module) {
	
	_module.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

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
	    .state('app.playlists', {
	        url: 'playlists',
	        template: '<playlists></playlists>',
	    })
	    .state('app.search', {
	        url: 'search/:input',
	        template: '<search></search>',
	    })
	    .state('app.artist', {
	        url: 'artist/:artist',
	        template: '<artist></artist>',
	    })
	    .state('app.settings', {
	        url: 'settings',
	        template: '<settings></settings>',
	    });
	}]);

}