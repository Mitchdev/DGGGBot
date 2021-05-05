exports.name = ['commands']
exports.permission = 'none'
exports.handler = function(message) {
	message.channel.send(`**Commands** https://github.com/Mitchdev/DGGGBot#readme`).then(msg => msg.suppressEmbeds(true));
}