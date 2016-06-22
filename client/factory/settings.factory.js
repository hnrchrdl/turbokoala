module.exports = function(_module) {

	_module.factory('Settings', function() {

		this.service = {
			
			active: null,

			setActive: (active) => {
				this.service.active = active || null;
			}
		};

		return this.service;
	});

}
