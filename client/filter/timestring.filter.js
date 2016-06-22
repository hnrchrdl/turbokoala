String.prototype.toHHMMSS = function () {
    
}


module.exports = function(_module) {

	_module.filter('timestring', () => {

		
		return (input) => {
			
			if(input === null || isNaN(parseFloat(input)) && !isFinite(input)) return "";
			
			var sec_num = parseInt(input, 10);
		    var hours   = Math.floor(sec_num / 3600);
		    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		    var seconds = sec_num - (hours * 3600) - (minutes * 60);

		    if (hours   < 10) {hours   = "0"+hours;}
		    if (minutes < 10) {minutes = "0"+minutes;}
		    if (seconds < 10) {seconds = "0"+seconds;}
		    if(!hours === '00') {
		    	return hours+':'+minutes+':'+seconds;
		    }
		    return minutes+':'+seconds; 
		};

	});
}
