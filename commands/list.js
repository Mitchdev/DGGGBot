exports.name = ['list']
exports.permission = 'none'
exports.handler = function(message) {
	var sorted = mutes.list.sort((a, b) => {
		var differenceA = (new Date().getTime() - new Date(a.startTime).getTime()) / 1000;
		var differenceB = (new Date().getTime() - new Date(b.startTime).getTime()) / 1000;
		return (parseInt(b.time) - parseInt(differenceB))-(parseInt(a.time) - parseInt(differenceA));
	});

	message.channel.send(`${sorted.map(m => {
		var difference = (new Date().getTime() - new Date(m.startTime).getTime()) / 1000;
		var time = (parseInt(m.time) - parseInt(difference) <= 0) ? 0 : parseInt(m.time) - parseInt(difference);
		return `${m.username} is a ${m.roleName} until ${secondsToDhms(time)}`;
	}).join('\n')}`);
}