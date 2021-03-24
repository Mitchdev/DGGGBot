exports.name = ['id']
exports.permission = 'none'
exports.handler = function(message) {
	if (message.mentions.users.size > 0) {
		message.channel.send(message.mentions.users.first().id);
	} else if (emotes) {
		message.channel.send(emotes[0].replace('>', '').replace('<:', '').split(':')[1]);
	}
}