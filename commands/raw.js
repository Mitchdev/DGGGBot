exports.name = ['raw']
exports.permission = 'none'
exports.handler = function(message) {
	message.channel.send(`\`${message.content.replace('!raw ', '')}\``);
}