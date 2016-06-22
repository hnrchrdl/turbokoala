
module.exports = function(_module) {
	_module.directive('controls', function() {
		
		const restrict = 'E';
		const template = require('./controls.html');
		const controller = ['$scope', '$timeout', '$interval', 'Stream', 'Mpd', function ($scope, $timeout, $interval, Stream, Mpd) {

			let timer;

			//this.status = Status;
			this.stream = Stream;

			this.Mpd = Mpd;

			// Update songprogress when song changes
			$scope.$watch(() => this.Mpd.currentsong, () => {
				$timeout(() => {
					
					this.totaltime = this.Mpd.currentsong.Time;

					// recalculate the current song progress
					if(this.Mpd.status.time) {
						
						let [currenttime, totaltime] = this.Mpd.status.time.split(':'); // [108:211] = 108, 211

						if(angular.isDefined(timer)) {
							$interval.cancel(timer);
							timer = undefined;

						};

						timer = $interval(() => {

							currenttime = +currenttime +1; // Add one second every second
							
							this.songprogress = currenttime / totaltime * 100;
							this.currenttime= currenttime;

				        }, 1000);
					}
					else {
						
						this.songprogress = 0;
						this.currenttime = null;
						
						if(angular.isDefined(timer)) {
							$interval.cancel(timer);
							timer = undefined;

						};
					}
				});
			});

			// close connection when scope gets detroyed
			$scope.$on('destroy', () => {
				Mpd.close();
			});


		}];
		const controllerAs = 'controlsCtrl';

		return {
			restrict,
			template,
			controller,
			controllerAs 
		};	
	});

};