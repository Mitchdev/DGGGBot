module.exports = function(client) {
  client.on('messageReactionAdd', (reaction, user) => {
    if (!options.disabled) {
      if (user.id != options.bot) {
        if (reaction.message.id == options.message.roles) {
          const validRole = roles.list.filter((role) => role.reaction.name === reaction._emoji.name);
          reaction.users.remove(user.id);
          if (validRole.length == 1) {
            client.guilds.fetch(options.guild).then((guild) => {
              guild.members.fetch(user.id).then((guildMember) => {
                guild.roles.fetch(validRole[0].role).then((role) => {
                  if (guildMember._roles.includes(validRole[0].role)) {
                    guildMember.roles.remove(role);
                    client.channels.resolve(options.channel.roles).send(`<@${user.id}>, ${validRole[0].name} role removed`).then((reply) => reply.delete({timeout: 2000}));
                  } else {
                    guildMember.roles.add(role);
                    client.channels.resolve(options.channel.roles).send(`<@${user.id}>, ${validRole[0].name} role added`).then((reply) => reply.delete({timeout: 2000}));
                  }
                }).catch(console.error);
              }).catch(console.error);
            }).catch(console.error);
          }
        } else if (reaction.message.id == currentVoteID) {
          // TODO:
          //  Add possiblity for single vote only
          //    currently people can vote on more than one option.

          if (!voteValidReactions.includes(reaction._emoji.name)) {
            reaction.users.remove(user.id);
          }
        } else {
          if (reaction._emoji.name == '📌') {
            if (reaction.users.cache.size == 5) {
              reaction.message.pin();
            }
          }

          client.guilds.fetch(options.guild).then((guild) => {
            if (guild.emojis.cache.find((emoji) => emoji.id == reaction._emoji.id)) {
              if (emotesUse.emotes[reaction._emoji.id]) {
                emotesUse.emotes[reaction._emoji.id].uses++;
                emotesUse.emotes[reaction._emoji.id].newUses++;
                updateEmoteUse();
              } else {
                emotesUse.emotes[reaction._emoji.id] = {'id': reaction._emoji.id, 'uses': 1, 'newUses': 1};
                updateEmoteUse();
              }
            }
          }).catch(console.error);
        }
      }
    }
  });
};
