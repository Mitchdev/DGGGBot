module.exports = function(client) {
  client.on('channelCreate', (channel) => {
    if (channel.type == 'text') {
      if (channel.guild.id == options.guild) {
        channel.overwritePermissions([
          {
            id: options.role.mute,
            deny: ['SEND_MESSAGES', 'ADD_REACTIONS'],
          }, {
            id: '252128902418268161',
            deny: ['VIEW_CHANNEL'],
          }, {
            id: '235088799074484224',
            deny: ['VIEW_CHANNEL'],
          },
        ], 'Added mute role and removed rythm bots');
      }
    }
  });
};
