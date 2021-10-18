module.exports = function(client) {
  const Discord = require('discord.js');
  client.on('guildMemberAdd', async (member) => {
    let found = false;
    const embed = new Discord.MessageEmbed().setTitle('User Join').setColor('GREEN').addFields([{
      name: 'Username',
      value: `${member.user.username}#${member.user.discriminator}`,
      inline: true,
    }]);
    const invites = await member.guild.invites.fetch();
    await invites.each((invite) => {
      if (invite.uses > inviteList[invite.code].uses) {
        found = true;
        inviteList[invite.code].uses = invite.uses;
        embed.addFields([{
          name: 'Inviter',
          value: inviteList[invite.code].user,
          inline: true,
        }, {
          name: 'Invite Code',
          value: invite.code,
          inline: true,
        }]);
        client.channels.resolve(process.env.CHANNEL_LOGS).send({embeds: [embed]});
      }
    });
    if (!found) {
      embed.addFields([{
        name: 'Inviter',
        value: 'Vanity',
        inline: true,
      }, {
        name: 'Invite Code',
        value: member.guild.vanityURLCode,
        inline: true,
      }]);
      client.channels.resolve(process.env.CHANNEL_LOGS).send({embeds: [embed]});
    }
  });
};
