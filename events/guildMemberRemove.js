module.exports = function(client) {
  client.on('guildMemberRemove', (member) => {
    client.channels.resolve(options.channel.log).send(`${member.user.username} (${member.nickname}) left.`);
  });
};
