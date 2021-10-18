module.exports = function(client) {
  client.on('guildBanAdd', (ban) => {
    client.channels.resolve(process.env.CHANNEL_LOGS).send({content: `${ban.user.username} got banned.`});
  });
};
