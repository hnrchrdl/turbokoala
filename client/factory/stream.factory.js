module.exports = function(_module) {
	_module.factory('Stream', ['$rootScope', '$timeout', function($rootScope, $timeout) {

		let _AudioElement  = _AudioElement ? _AudioElement : new Audio();

		// Audio Player Events
		_AudioElement.addEventListener('playing', (e) => {
			$timeout(() => { this.service.status = 1; });
		});
		
		this.service = {
			
			url: null,
			status: 0 ,// 0 = not streaming, 1 = streaming, 2 = loading

			init: (url) => {
				this.service.url = url;
				_AudioElement.src = url; // play
				this.service.start();
			},

			stop: () => {
				$timeout(() => { 
				 	_AudioElement.pause();
					this.service.status = 0;
				});
				$rootScope.$broadcast('stream:stop');
			},

			start: () => {
				$timeout(() => {
					this.service.status = 2;
					_AudioElement.load();
					_AudioElement.play();
				});
				$rootScope.$broadcast('stream:start');
			},

			toggle: () => {
				if(this.service.status === 0) {
					this.service.start();
				} else {
					this.service.stop();
				}
			}
		};
		
		return this.service;
	}]);
};