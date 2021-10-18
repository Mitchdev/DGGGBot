module.exports = function(client) {
  client.on('channelCreate', (channel) => {
    if (channel.type == 'text') {
      if (channel.guild.id == process.env.GUILD_ID) {
        channel.overwritePermissions([
          {
            id: process.env.ROLE_MUTE,
            deny: ['SEND_MESSAGES', 'ADD_REACTIONS'],
          }, {
            id: '235088799074484224',
            deny: ['VIEW_CHANNEL'],
          },
        ], 'Added mute role and removed rythm bot');
      }
    }
  });
};
