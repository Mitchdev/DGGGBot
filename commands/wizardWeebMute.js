exports.name = ['wizard', 'weeb', 'mute']
exports.permission = 'none'
exports.handler = function(message) {
	if (message.mentions.users.size > 0) {
		var roleRaw = message.content.toLowerCase().startsWith('!wizard ') ? 'Wizard' : (message.content.toLowerCase().startsWith('!weeb ') ? 'Weeb' : 'Mute');
		var roleID = roleRaw == 'Wizard' ? options.role.wizard : (roleRaw == 'Weeb' ? options.role.weeb : options.role.mute);
		var timeRaw = message.content.toLowerCase().replace('!wizard ', '').replace('!weeb ', '').replace('!mute ', '').replace(/ /g, '');
		message.mentions.users.each(user => {timeRaw = timeRaw.replace(`<@!${user.id}>`, '').replace(`<@${user.id}>`, '')});
		var time = timeToSeconds(timeRaw);
		
		message.mentions.users.each(user => {
			client.guilds.fetch(options.guild).then(guild => {
				guild.members.fetch(message.author.id).then(member => {
					if (member._roles.includes(options.role.mod)) {
						if (time != null && time > 0) {
							if (time <= 2592000) {
								guild.members.fetch(user.id).then(guildMember => {
									guild.roles.fetch(roleID).then(role => {
										var startTime = new Date();
										var inc = mutes.list.filter(m => {
											return m.user == user.id && m.role == roleID;
										});
										if (inc.length == 0) {
											if (!gunCooldown) {
												if (Math.round(Math.random() * 100) == 70) {
													if (!member._roles.includes(roleID)) member.roles.add(role);
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
												} else if (Math.round(Math.random() * 20) == 14) {
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
										} else if (message.author.id != user.id) {
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
										} else {
											message.channel.send(options.emote.pogo.string);
										}
									}).catch(console.error);
								}).catch(console.error);
							} else {
								message.channel.send('Max of 30d');
							}
						}
					} else {
						guild.roles.fetch(roleID).then(role => {
							if (!member._roles.includes(roleID)) {
								member.roles.add(role);
								message.channel.send(`${message.author.username} wasn't trained in gun safety and killed himself ${options.emote.sadge.string} (2m)`);
								mutes.list.push({
									"user": message.author.id,
									"username": message.author.username,
									"role": roleID,
									"roleName": roleRaw,
									"startTime": startTime,
									"time": 120,
									"timeRaw": "2m"
								});
								updateMutes();
							}
						}).catch(console.error);
					}
				});
			}).catch(console.error);
		});
	}
}
