exports.name = ['unmuteid']
exports.permission = 'mod'
exports.handler = function(message) {
	var id = message.content.toLowerCase().replace('!unmuteid ', '')
	if (id != '') {
		var inc = mutes.list.filter(m => {return m.user == id && m.role == options.role.mute;});
		if (inc.length > 0) {
			client.guilds.fetch(options.guild).then(guild => {
				guild.members.fetch(id).then(guildMember => {
					guild.roles.fetch(options.role.mute).then(role => {
						if (guildMember._roles.includes(options.role.mute)) guildMember.roles.remove(role);
						message.channel.send(`Unmuted ${guildMember.displayName}`);
						mutes.list = mutes.list.filter(m => {return (m.user != id) || (m.role != options.role.mute);});
						updateMutes();
					}).catch(console.error);
				}).catch(console.error);
			}).catch(console.error);
		}
	}
}
