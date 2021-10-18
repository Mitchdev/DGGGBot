module.exports = function(client) {
  const Discord = require('discord.js');
  const guild = client.guilds.resolve(process.env.GUILD_ID);
  client.on('messageCreate', async (message) => {
    if (message.author.id != process.env.BOT_ID) {
      if (message.author.id == process.env.DEV_ID && message.content.startsWith('!eval')) executeEval(message, Discord, message.content.startsWith('!evalnc'));
      else if (message.author.id == process.env.DEV_ID && message.content.toLowerCase() == '!channels') {
        const channels = client.guilds.resolve(process.env.GUILD_ID).channels.cache;
        const categories = channels.filter((channel) => channel.type == 'GUILD_CATEGORY');

        splitMessage(null, `${categories.map((category) => {
          const textCategoryChannels = channels.filter((channel) => channel.parentId == category.id && channel.type == 'GUILD_TEXT');
          const voiceCategoryChannels = channels.filter((channel) => channel.parentId == category.id && channel.type == 'GUILD_VOICE');
          return `${category.rawPosition}^#${category.name}\n> Text Channels\n${
            textCategoryChannels.map((channel) => `${channel.rawPosition}^  ${channel.name}`).sort((a, b) => parseInt(a.split('^')[0]) - parseInt(b.split('^')[0])).map((item) => item.split('^')[1]).join('\n')
          }\n> Voice Channels\n${
            voiceCategoryChannels.map((channel) => `${channel.rawPosition}^  ${channel.name}`).sort((a, b) => parseInt(a.split('^')[0]) - parseInt(b.split('^')[0])).map((item) => item.split('^')[1]).join('\n')
          }`;
        }).sort((a, b) => parseInt(a.split('^')[0]) - parseInt(b.split('^')[0])).map((item) => item.split('^')[1]).join('\n')}\n#No Category\n${channels.filter((channel) => {
          return categories.map((category) => category.id).includes(channel.id) && categories.map((category) => category.id).includes(channel.parentId);
        }).map((channel) => `  ${channel.name}`).join('\n')}`, 'markdown', message);
      } else {
        if (message.channel.type == 'dm' && process.env.DEV_ID != message.author.id) client.users.fetch(process.env.DEV_ID).then((devLog) => devLog.send({content: `DM: ${message.author.username}#${message.author.discriminator}: ${message.content}`}));
        else if (message.content.length >= 750) message.react(message.guild.emojis.cache.get(options.emote.donowall.id));

        const emotes = message.content.match(/<:.+?:\d+>/gmi);
        if (emotes) {
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
        }
      }
    }
  });
};
