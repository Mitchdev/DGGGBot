module.exports = function(client) {
  client.on('guildMemberRemove', (member) => {
    client.channels.resolve(process.env.CHANNEL_LOGS).send({content: `${member.user.username}#${member.user.discriminator} (${member.nickname}) (${member.user}) left.`});
  });
};
