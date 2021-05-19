exports.name = ['avatar']
exports.permission = 'none'
exports.handler = function(message) {
	var user = (message.mentions.users.size == 1) ? message.mentions.users.first() : message.author;
    if (user) {
        message.channel.send(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`);
    }
}