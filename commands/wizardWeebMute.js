exports.name = ['wizard', 'weeb', 'mute']
exports.permission = 'mod'
exports.handler = function(message) {
	if (message.mentions.users.size > 0) {
		var roleRaw = message.content.toLowerCase().startsWith('!wizard ') ? 'Wizard' : (message.content.toLowerCase().startsWith('!weeb ') ? 'Weeb' : 'Mute');
		var roleID = roleRaw == 'Wizard' ? options.role.wizard : (roleRaw == 'Weeb' ? options.role.weeb : options.role.mute);
		var timeRaw = message.content.toLowerCase().replace('!wizard ', '').replace('!weeb ', '').replace('!mute ', '').replace(/ /g, '');
		message.mentions.users.each(user => {timeRaw = timeRaw.replace(`<@!${user.id}>`, '').replace(`<@${user.id}>`, '')});
		var time = timeToSeconds(timeRaw);
		
		message.mentions.users.each(user => {
			if (user.id != message.author.id) {
				if (time != null && time > 0) {
					if (time <= 2592000) {
						client.guilds.fetch(options.guild).then(guild => {
							guild.members.fetch(user.id).then(guildMember => {
								guild.roles.fetch(roleID).then(role => {
									var startTime = new Date();
									var inc = mutes.list.filter(m => {
										return m.user == user.id && m.role == roleID;
									});
									if (inc.length == 0) {
										if (!gunCooldown) {
											if (Math.round(Math.random() * 50) == 35) {
												guild.members.fetch(message.author.id).then(bfGuildMember => {
													if (!bfGuildMember._roles.includes(roleID)) bfGuildMember.roles.add(role);
													client.users.fetch(options.user.mitch).then(mitch => {
														mitch.send(`Gun backfired: ${message.author.username} gave themself ${roleRaw} role to ${user.username} for ${timeRaw}`);
													});
													message.channel.send(`${options.emote.gun.string} gun backfired!`);
													mutes.list.push({
														"user": message.author.id,
														"username": message.author.username,
														"role": roleID,
														"roleName": roleRaw,
														"startTime": startTime,
														"time": time,
														"timeRaw": timeRaw
													});
													updateMutes();
												})
											} else if (Math.round(Math.random() * 10) == 7) {
												message.channel.send(`Looks like the gun jammed.`);
												gunCooldown = true;

												client.users.fetch(options.user.mitch).then(mitch => {
													mitch.send(`My gun broke`);
												});

												setTimeout(function() {
													gunCooldown = false;
												}, 600000);
											} else {
												if (!guildMember._roles.includes(roleID)) guildMember.roles.add(role);
												client.users.fetch(options.user.mitch).then(mitch => {
													mitch.send(`${message.author.username} gave ${roleRaw} role to ${user.username} for ${timeRaw}`);
												});
												message.channel.send(`${options.emote.ok.string} ${user.username} is a ${roleRaw} for ${timeRaw}`);
												mutes.list.push({
													"user": user.id,
													"username": user.username,
													"role": roleID,
													"roleName": roleRaw,
													"startTime": startTime,
													"time": time,
													"timeRaw": timeRaw
												});
												updateMutes();
											}
										}  else {
											message.channel.send(`Fixing the gun...`);
										}
									} else {
										if (!guildMember._roles.includes(roleID)) guildMember.roles.add(role);
										message.channel.send(`${options.emote.ok.string} Updated ${user.username}\'s ${roleRaw} time from ${inc[0].timeRaw} to ${timeRaw}`);
										mutes.list = mutes.list.filter(m => {
											return (m.user != user.id) || (m.role != roleID);
										});
										mutes.list.push({
											"user": user.id,
											"username": user.username,
											"role": roleID,
											"roleName": roleRaw,
											"startTime": startTime,
											"time": time,
											"timeRaw": timeRaw
										});
										updateMutes();
									}
								}).catch(console.error);
							}).catch(console.error);
						}).catch(console.error);
					} else {
						message.channel.send('Max of 30d');
					}
				}
			} else {
				message.channel.send(options.emote.pogo.string)
			}
		});
	}
}
