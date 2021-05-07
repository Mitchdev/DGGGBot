module.exports = function(client) {
	client.on('guildBanAdd', (guild, user) => {
		client.channels.resolve(options.channel.log).send(`${user.username} got kicked.`);
	});
}