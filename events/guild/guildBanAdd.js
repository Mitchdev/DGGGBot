module.exports = function(client) {
  client.on('guildBanAdd', (guild, user) => {
    client.channels.resolve(process.env.CHANNEL_LOGS).send({content: `${user.username} got kicked.`});
  });
};
