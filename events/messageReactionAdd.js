module.exports = function(client) {
  client.on('messageReactionAdd', (reaction, user) => {
    if (user.id != process.env.BOT_ID) {
      if (reaction.message.id == currentVoteID) {
        // TODO:
        //  Add possiblity for single vote only
        //    currently people can vote on more than one option.

        // ?change to buttons

        if (!voteValidReactions.includes(reaction._emoji.name)) {
          reaction.users.remove(user.id);
        }
      } else {
        if (reaction._emoji.name == '📌') {
          if (reaction.users.cache.size == 5) {
            reaction.message.pin();
          }
        }

        const id = user.id + '-' + reaction._emoji.name;
        recentReactions.push(id);
        setTimeout(() => {
          recentReactions = recentReactions.filter((r) => r != id);
        }, 5000);

        client.guilds.fetch(process.env.GUILD_ID).then((guild) => {
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
  });
};
