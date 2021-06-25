module.exports = function(client) {
  client.on('message', (message) => {
    if (message.author.id != process.env.BOT_ID) {
      if (message.channel.type == 'dm' && process.env.DEV_ID != message.author.id) {
        client.users.fetch(process.env.DEV_ID).then((devLog) => {
          devLog.send({content: `DM: ${message.author.username}#${message.author.discriminator}: ${message.content}`});
        });
      } else if (message.content.length >= 750) {
        message.react(message.guild.emojis.cache.get(options.emote.donowall.id));
      }
      if (message.author.id == process.env.DEV_ID && message.content.startsWith('!eval')) executeEval(message);

      const emotes = message.content.match(/<:.+?:\d+>/gmi);
      if (emotes) {
        client.guilds.fetch(process.env.GUILD_ID).then((guild) => {
          const addedIDs = {};
          for (let i = 0; i < emotes.length; i++) {
            const e = emotes[i].replace('>', '').replace('<:', '').split(':');
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
          client.guilds.fetch(process.env.GUILD_ID).then((guild) => {
            guild.members.fetch(message.author.id).then((guildMember) => {
              guild.roles.fetch(process.env.ROLE_WEEB).then((role) => {
                if (!guildMember._roles.includes(process.env.ROLE_WEEB)) {
                  guildMember.roles.add(role);
                  message.channel.send(options.emote.weird.string);
                  mutes.list.push({
                    'user': message.author.id,
                    'username': message.author.username,
                    'role': process.env.ROLE_WEEB,
                    'roleName': 'Weeb',
                    'startTime': new Date(),
                    'time': 86400,
                    'timeRaw': '1d',
                    'gamble': 5,
                  });
                  updateMutes();
                } else {
                  guild.roles.fetch(process.env.ROLE_WEEBLEADER).then((weebLeader) => {
                    if (!guildMember._roles.includes(process.env.ROLE_WEEBLEADER)) {
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
    }
  });
};
