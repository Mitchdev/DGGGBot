module.exports = function(client) {
  client.on('messageUpdate', (oldMessage, newMessage) => {
    if (newMessage.author.id != process.env.BOT_ID && oldMessage.content != newMessage.content) {
      const Discord = require('discord.js');
      const embed = new Discord.MessageEmbed()
          .setTitle(`**${newMessage.author.username}s edited message in #${newMessage.channel.name}**`)
          .setURL(`https://discord.com/channels/${newMessage.channel.guild.id}/${newMessage.channel.id}/${newMessage.id}`)
          .addFields([{
            name: 'Original',
            value: oldMessage.content,
          }, {
            name: 'New',
            value: newMessage.content,
          }]);

      const hook = new Discord.WebhookClient(process.env.WEBHOOK_LOG_ID, process.env.WEBHOOK_LOG_AUTH);
      hook.send({embeds: [embed]});
    }
  });
};
