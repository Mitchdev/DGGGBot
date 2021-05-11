module.exports = function(client) {
	client.on('guildMemberRemove', (member) => {
        console.log(member)
		client.channels.resolve(options.channel.log).send(`${member.username} left.`);
	});
}