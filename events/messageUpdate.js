module.exports = function(client) {
  client.on('messageUpdate', (oldMessage, newMessage) => {
    if (newMessage.author.id != process.env.BOT_ID && oldMessage.content != newMessage.content) {
      const Discord = require('discord.js');
      const embed = new Discord.MessageEmbed()
          .setTitle(`**${newMessage.author.username}s edited message in #${newMessage.channel.name}**`)
          .setURL(`https://discord.com/channels/${newMessage.channel.guild.id}/${newMessage.channel.id}/${newMessage.id}`)
          .addFields([{
            name: 'Original',
            value: oldMessage.content
          }, {
            name: 'New',
            value: newMessage.content
          }])

      const hook = new Discord.WebhookClient('849106698878582795', 'kdi2mflSZKN0me43rZe2gDg76K13OR8MFNOgbd3f97-x6vMolgum2GB2JVOcyihijPTq');
      hook.send(embed);
    }
  });
};
