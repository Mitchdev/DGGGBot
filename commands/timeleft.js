exports.name = ['timeleft']
exports.permission = 'none'
exports.handler = function(message) {
	var user = (message.mentions.users.size == 1) ? message.mentions.users.first() : message.author;
	var mutesForUser = mutes.list.filter(m => {
		return m.user == user.id;
	});

	for (var i = 0; i < mutesForUser.length; i++) {

		var difference = (new Date().getTime() - new Date(mutesForUser[i].startTime).getTime()) / 1000;
		var time = (parseInt(mutesForUser[i].time) - parseInt(difference) <= 0) ? 0 : parseInt(mutesForUser[i].time) - parseInt(difference);

		message.channel.send(`${user.username} is a ${mutesForUser[i].roleName} until ${secondsToDhms(time)}`)
	}
}