module.exports = function(client) {
  client.on('messageDelete', (message) => {
    if (message.author.id != process.env.BOT_ID) {
      const Discord = require('discord.js');
      const embed = new Discord.MessageEmbed()
          .setTitle(`**${message.author.username}s deleted message in #${message.channel.name}**`)
          .setDescription(message.content)

      const hook = new Discord.WebhookClient('849106698878582795', 'kdi2mflSZKN0me43rZe2gDg76K13OR8MFNOgbd3f97-x6vMolgum2GB2JVOcyihijPTq');
      hook.send(embed);
    }
  });
};
