module.exports = function(client) {
  client.on('messageReactionRemove', (reaction, user) => {
    const id = recentReactions.find((r) => r === user.id + '-' + reaction._emoji.name);
    if (id) {
      const Discord = require('discord.js');
      const embed = new Discord.MessageEmbed()
          .setTitle(`**${user.username}s deleted reaction (within 5s) in #${reaction.message.channel.name}**`)
          .setURL(`https://discord.com/channels/${reaction.message.channel.guild.id}/${reaction.message.channel.id}/${reaction.message.id}`);

      const fields = [{
        name: `${reaction.message.author.username}s message`,
        value: reaction.message.content != '' ? reaction.message.content : 'null',
      }, {
        name: 'Reaction',
        value: reaction._emoji.name.match(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g) ? reaction._emoji.name : `<:${reaction._emoji.name}:${reaction._emoji.id}>`,
      }];

      console.log(reaction);
      console.log(reaction._emoji);
      console.log(fields);

      embed.addFields(fields);

      const hook = new Discord.WebhookClient({id: process.env.WEBHOOK_LOG_ID, token: process.env.WEBHOOK_LOG_AUTH});
      hook.send({embeds: [embed]});
    }
  });
};
