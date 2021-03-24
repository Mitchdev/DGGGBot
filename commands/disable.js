exports.name = ['disable']
exports.permission = 'mod'
exports.handler = function(message) {
	message.channel.send('Disabled');
	options.disabled = true;
}