module.exports = function(client) {
  client.on('guildMemberAdd', (member) => {
    client.guilds.fetch(process.env.GUILD_ID).then((guild) => {
      guild.fetchInvites().then((invites) => {
        for (let i = 0; i < inviteList.length; i++) {
          const inviteItem = invites.find((inv) => {
            return inv.code == inviteList[i].code;
          });
          if (inviteItem) {
            if (inviteItem.uses > inviteList[i].uses) {
              inviteList[i].uses = inviteItem.uses;
              client.channels.resolve(process.env.CHANNEL_LOGS).send(`${member.displayName} joined via ${inviteList[i].inviter.username}'s invite link (${inviteList[i].code}).`);
            }
          }
        }
      });
    });
  });
};
