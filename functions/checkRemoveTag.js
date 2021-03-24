module.exports = function(client) {
	checkRemoveTag = function(guild, mute) {
		guild.members.fetch(mute.user).then(guildMember => {
			guild.roles.fetch(mute.role).then(role => {
				if (!guildMember._roles.includes(mute.role)) guildMember.roles.add(role);
				var difference = (new Date().getTime() - new Date(mute.startTime).getTime()) / 1000;
				var time = parseInt(mute.time) - parseInt(difference);
				if (time <= 0)  {
					guildMember.roles.remove(role);
					mutes.list = mutes.list.filter(m => {
						return (m.user != mute.user) || (m.role != mute.role);
					});
					updateMutes();
				} else if (!guildMember._roles.includes(mute.role)) {
					guildMember.roles.add(role);
				}
			}).catch(console.error);
		}).catch(console.error);
	}
}