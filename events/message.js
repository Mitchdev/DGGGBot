module.exports = function(client) {
  client.on('message', (message) => {
    if (message.author.id != options.bot) {
      if (message.channel.type == 'dm') {
        client.users.fetch(options.user.mitch).then((mitch) => {
          if (mitch.id != message.author.id) {
            mitch.send(`DM: ${message.author.username}#${message.author.discriminator}: ${message.content}`);
          }
        });
      } else if (message.content.length >= 750) {
        message.react(message.guild.emojis.cache.get(options.emote.donowall.id));
      }
      if (message.author.id == options.user.mitch && message.content.startsWith('!eval')) executeEval(message);

      const emotes = message.content.match(/<:.+?:\d+>/gmi);
      if (emotes) {
        client.guilds.fetch(options.guild).then((guild) => {
          const addedIDs = {};
          for (let i = 0; i < emotes.length; i++) {
            var e = emotes[i].replace('>', '').replace('<:', '').split(':');
            if (addedIDs[e[1]]) {
              if (addedIDs[e[1]].count < 5) {
                if (guild.emojis.cache.find((emoji) => emoji.id == e[1])) {
                  if (emotesUse.emotes[e[1]]) {
                    emotesUse.emotes[e[1]].uses++;
                    emotesUse.emotes[e[1]].newUses++;
                    updateEmoteUse();
                  } else {
                    emotesUse.emotes[e[1]] = {'id': e[1], 'uses': 1, 'newUses': 1};
                    updateEmoteUse();
                  }
                  addedIDs[e[1]].count++;
                }
              }
            } else {
              if (guild.emojis.cache.find((emoji) => emoji.id == e[1])) {
                if (emotesUse.emotes[e[1]]) {
                  emotesUse.emotes[e[1]].uses++;
                  emotesUse.emotes[e[1]].newUses++;
                  updateEmoteUse();
                } else {
                  emotesUse.emotes[e[1]] = {'id': e[1], 'uses': 1, 'newUses': 1};
                  updateEmoteUse();
                }
                addedIDs[e[1]] = {'count': 1};
              }
            }
          }
        });
      }

      for (let i = 0; i < options.weebPhrases.length; i++) {
        if (new RegExp('(<=\\s|\\b|\:)'+ options.weebPhrases[i] +'(?=[]\\b|\\s|$|\:)').test(message.content.toLowerCase())) {
          client.guilds.fetch(options.guild).then((guild) => {
            guild.members.fetch(message.author.id).then((guildMember) => {
              guild.roles.fetch(options.role.weeb).then((role) => {
                if (!guildMember._roles.includes(options.role.weeb)) {
                  guildMember.roles.add(role);
                  message.channel.send(options.emote.weird.string);
                  mutes.list.push({
                    'user': message.author.id,
                    'username': message.author.username,
                    'role': options.role.weeb,
                    'roleName': 'Weeb',
                    'startTime': new Date(),
                    'time': 86400,
                    'timeRaw': '1d',
                  });
                  updateMutes();
                } else {
                  guild.roles.fetch(options.role.weebleader).then((weebLeader) => {
                    if (!guildMember._roles.includes(options.role.weebleader)) {
                      weebLeader.members.each((member) => member.roles.remove(weebLeader));
                      guildMember.roles.add(weebLeader);
                      message.channel.send(options.emote.weird.string);
                    }
                  });
                }
              }).catch(console.error);
            }).catch(console.error);
          }).catch(console.error);
        }
      }

      // if (message.content.toLowerCase().startsWith('!')) {
      // 	var possibleCommand = message.content.toLowerCase().substr(1);
      // 	possibleCommand = possibleCommand.split(' ')[0];
      //     var command = commands.find(cmd => cmd.name.includes(possibleCommand));

      // 	if (command) {
      // 		if (!command.onlySlash) {
      // 			if (command.permission == 'mod') {
      // 				client.guilds.fetch(options.guild).then(guild => {
      // 					guild.members.fetch(message.author.id).then(guildMember => {
      // 						if (guildMember._roles.includes(options.role.mod)) {
      // 							command.handler(message);
      // 						}
      // 					});
      // 				});
      // 			} else {
      // 				command.handler(message);
      // 			}
      // 		}
      // 	}
      // }
    }
  });
};
