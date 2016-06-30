module.exports = (_module) => {
	_module.directive('alert', ($rootScope) => {
		
		const ALERT_TIMEOUT = 5000;

		const template = require('./alert.html');
		const controller = ['$scope', '$timeout', function($scope, $timeout) {
			
			this.content = {};

			// Map of alert classes, will effect the background color of alert
			let classes = new Map();
			classes.set('ERROR', 'error');
			classes.set('SUCCESS', 'success');
			
			let activateAlert = (_class, header, body) => {

				$timeout(() => {
					// set content and class of alert
					this.class 				= _class;
					this.content.header 	= header;
					this.content.body 		= body;
					// show alert
					this.isShown 			= true;

					$timeout(() => {
						// hide alert after some ALERT_TIMEOUT milliseconds
						this.isShown = false;

					}, ALERT_TIMEOUT);
				});
			};

			// watch for events that trigger alert 
			$scope.$on('mpd:error', (e, msg) => {
				activateAlert(classes.get('ERROR'), 'Mpd error', msg);
			});

			$scope.$on('mpd:success', (e, msg) => {
				activateAlert(classes.get('SUCCESS'), null, msg);
			});

		}];
		const controllerAs = 'alertCtrl';
		const link = ($scope, $element, $attr, $ctrl) => {
			
			let alertElem = angular.element($element[0].querySelector('.alert'));

			// watch for class changes and set and remove class on element
			$scope.$watch(() => { return $ctrl.class; }, (classNew, classOld) => {
				
				if(classOld) {
					alertElem.removeClass(classOld);
				}

				if(classNew) {
					alertElem.addClass(classNew);
				}

			});

			// watch for hide/show and add and remove active class
			$scope.$watch(() => { return $ctrl.isShown; }, (isShown) => {

				if(isShown) {
					alertElem.addClass('active');
				}
				else {
					alertElem.removeClass('active');
				}

			});
		};
		const require = 'alert';

		return {
			template,
			controller,
			controllerAs,
			link,
			require
		};

	});
};