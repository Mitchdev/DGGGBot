module.exports = function(client) {
  const Discord = require('discord.js');
  client.on('guildMemberRemove', (member) => {
    const embed = new Discord.MessageEmbed().setTitle('User Leave').setColor('RED').addFields([{
      name: 'Username',
      value: `${member.user.username}#${member.user.discriminator}`,
      inline: true,
    }, {
      name: 'Nickname',
      value: member.nickname ? member.nickname : 'null',
      inline: true,
    }, {
      name: 'User',
      value: `<@${member.user.id}>`,
      inline: true,
    }]);
    client.channels.resolve(process.env.CHANNEL_LOGS).send({embeds: [embed]});
  });
};
