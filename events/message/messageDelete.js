module.exports = function(client) {
  client.on('messageDelete', (message) => {
    if (message.author.id != process.env.BOT_ID && message.author.id != process.env.WEBHOOK_LOG_ID) {
      const Discord = require('discord.js');
      const embed = new Discord.MessageEmbed()
          .setTitle(`**${message.author.username}s deleted message in #${message.channel.name}**`)
          .setDescription(message.content);

      const hook = new Discord.WebhookClient({id: process.env.WEBHOOK_LOG_ID, token: process.env.WEBHOOK_LOG_AUTH});
      hook.send({embeds: [embed]});
    }
  });
};
