module.exports = function(_module) {

	_module.factory('User', ['$http', 'Restangular', function($http, Restangular) {

		let url = 'api/user';

		let RestUser = Restangular.withConfig(function (config) {
		     config.setRestangularFields({"id": "_id"});
		 });

		let resource = RestUser.all(url);
		
		let loggedInUser = $http.get('api/me').then((response) => {
			let me = response.data;
			return RestUser.one(url, me._id).get();
		});

		let $$service = {
			resource,
			loggedInUser
		};
		return $$service;
	}]);

}
