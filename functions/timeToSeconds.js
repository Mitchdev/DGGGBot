module.exports = function(client) {
	timeToSeconds = function(str) {
		var time = str.slice(0, -1);
		time = parseInt(time);
		switch(str.replace(time, '')) {
			case 'd':
				time = time*86400;
				break;
			case 'h':
				time = time*3600;
				break;
			case 'm':
				time = time*60;
				break;
			case 's':
				time = time;
				break;
			default:
				return null;
		}
		return time;
	}
}