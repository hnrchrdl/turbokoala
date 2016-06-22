module.exports = function(_module) {
	_module.directive('navbarTop', function() {
		
		const restrict = 'E';
		const template = require('./navbar-top.html');

		return {
			restrict,
			template
		};	
	});

	_module.directive('navbarSide', function() {
		
		const restrict = 'E';
		const template = require('./navbar-side.html');
		return {
			restrict,
			template
		};	
	});

};