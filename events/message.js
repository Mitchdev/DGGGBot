module.exports = function(client) {
	client.on('message', message => {
		if (!options.disabled) {
			if (message.author.id != options.bot) {
				if (message.channel.type == 'dm') {
					client.users.fetch(options.user.mitch).then(mitch => {
						if (mitch.id != message.author.id) {
							mitch.send(`DM: ${message.author.username}#${message.author.discriminator}: ${message.content}`);
						}
					});
				}
				if (message.author.id == options.user.mitch && message.content.startsWith('!eval')) executeEval(message);

				var emotes = message.content.match(/<:.+?:\d+>/gmi);
				if (emotes) {
					client.guilds.fetch(options.guild).then(guild => {
						var addedIDs = {};
						for (var i = 0; i < emotes.length; i++) {
							var e = emotes[i].replace('>', '').replace('<:', '').split(':');
							if (addedIDs[e[1]]) {
								if (addedIDs[e[1]].count < 5) {
									if (guild.emojis.cache.find(emoji => emoji.id == e[1])) {
										if (emotesUse.emotes[e[1]]) {
											emotesUse.emotes[e[1]].uses++;
											updateEmoteUse();
										} else {
											emotesUse.emotes[e[1]] = {"id": e[1], "uses": 1}
											updateEmoteUse();
										}
										addedIDs[e[1]].count++;
									}
								}
							} else {
								if (guild.emojis.cache.find(emoji => emoji.id == e[1])) {
									if (emotesUse.emotes[e[1]]) {
										emotesUse.emotes[e[1]].uses++;
										updateEmoteUse();
									} else {
										emotesUse.emotes[e[1]] = {"id": e[1], "uses": 1}
										updateEmoteUse();
									}
									addedIDs[e[1]] = {"count": 1}
								}
							}
						}
					})
				}

				// if (message.content.toLowerCase().includes('nigger') || message.content.toLowerCase().includes('nigga')) {
				// 	client.guilds.fetch(options.guild).then(guild => {
				// 		guild.members.fetch(message.author.id).then(guildMember => {
				// 			guild.roles.fetch(options.role.wizard).then(role => {
				// 				if (!guildMember._roles.includes(options.role.wizard)) {
				// 					guildMember.roles.add(role);
				// 					client.users.fetch(options.user.mitch).then(mitch => {
				// 						mitch.send(`Added wizard role to ${message.author.username} for their message:\n${message.content}\n`);
				// 					});
				// 					message.channel.send(options.emote.tony.string);
				// 					mutes.list.push({
				// 						"user": message.author.id,
				// 						"username": message.author.username,
				// 						"role": options.role.wizard,
				// 						"roleName": 'Wizard',
				// 						"startTime": new Date(),
				// 						"time": 86400,
				// 						"timeRaw": '1d'
				// 					});
				// 					updateMutes();
				// 				} else {
				// 					var inc = mutes.list.filter(m => {return m.user == message.author.id && m.role == options.role.wizard});
				// 					if (inc.length > 0) {
				// 						mutes.list = mutes.list.filter(m => {return (m.user != message.author.id) || (m.role != options.role.wizard)});
				// 						message.channel.send(options.emote.tony.string);
				// 						mutes.list.push({
				// 							"user": message.author.id,
				// 							"username": message.author.username,
				// 							"role": options.role.wizard,
				// 							"roleName": 'Wizard',
				// 							"startTime": inc[0].startTime,
				// 							"time": inc[0].time+86400,
				// 							"timeRaw": parseInt(inc[0].timeRaw.replace('d', ''))+1 + 'd'
				// 						});
				// 						updateMutes();
				// 					}
				// 				}
				// 			}).catch(console.error);
				// 		}).catch(console.error);
				// 	}).catch(console.error);
				// }

				for (var i = 0; i < options.weebPhrases.length; i++) {
					if (new RegExp("(<=\\s|\\b|\:)"+ options.weebPhrases[i] +"(?=[]\\b|\\s|$|\:)").test(message.content.toLowerCase())) {
						client.guilds.fetch(options.guild).then(guild => {
							guild.members.fetch(message.author.id).then(guildMember => {
								guild.roles.fetch(options.role.weeb).then(role => {
									if (!guildMember._roles.includes(options.role.weeb)) {
										guildMember.roles.add(role);
										client.users.fetch(options.user.mitch).then(mitch => {
											mitch.send(`Added shit weeb role to ${message.author.username} for their message:\n${message.content}\n`);
										});
										message.channel.send(options.emote.weird.string);
										mutes.list.push({
											"user": message.author.id,
											"username": message.author.username,
											"role": options.role.weeb,
											"roleName": 'Weeb',
											"startTime": new Date(),
											"time": 86400,
											"timeRaw": '1d'
										});
										updateMutes();
									} else {
										guild.roles.fetch(options.role.weebleader).then(weebLeader => {
											if (!guildMember._roles.includes(options.role.weebleader)) {
												weebLeader.members.each(member => member.roles.remove(weebLeader));
												guildMember.roles.add(weebLeader);
												client.users.fetch(options.user.mitch).then(mitch => {
													mitch.send(`Added weeb leader role to ${message.author.username} for their message:\n${message.content}\n`);
												});
												message.channel.send(options.emote.weird.string);
											}
										})
									}
								}).catch(console.error);
							}).catch(console.error);
						}).catch(console.error);
					}
				}

				if (message.content.toLowerCase().startsWith('!')) {
					var possibleCommand = message.content.toLowerCase().substr(1);
					possibleCommand = possibleCommand.split(' ')[0];

					var command = commands.find(cmd => {
						var found = false;
						for (i = 0; i < cmd.name.length; i++) {
							if (!found) {
								found = (possibleCommand == cmd.name[i]);
								if (cmd.hasRegex && !found) {
									found = cmd.regex.exec(possibleCommand);
								}
							}
						}
						return found;
					});

					if (command) {
						if (command.permission == 'mod') {
							client.guilds.fetch(options.guild).then(guild => {
								guild.members.fetch(message.author.id).then(guildMember => {
									if (guildMember._roles.includes(options.role.mod)) {
										command.handler(message);
									}
								});
							});
						} else {
							command.handler(message);
						}
					}
				}
			}
		} else {
			if (message.content.toLowerCase() == '!enable') {
				client.guilds.fetch(options.guild).then(guild => {
					guild.members.fetch(message.author.id).then(guildMember => {
						if (guildMember._roles.includes(options.role.mod)) {
							message.channel.send('Enabled');
							options.disabled = false;
							updateOptions();
						}
					});
				});
			}
		}
	});
}