module.exports = function(client) {
  client.on('guildMemberRemove', (member) => {
    client.channels.resolve(process.env.CHANNEL_LOGS).send(`${member.user.username} (${member.nickname}) left.`);
  });
};
