module.exports = function(client) {
  client.on('messageReactionRemove', (reaction, user) => {
    const id = recentReactions.find((r) => r === user.id + '-' + reaction._emoji.name);
    if (id) {
      
      console.log(reaction.message.content);
      console.log(reaction._emoji.name.match(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g) ? reaction._emoji.name : `<:${reaction._emoji.name}:${reaction._emoji.id}>`)
      console.log('<====== Message Reaction Remove ======>');

      const Discord = require('discord.js');
      const embed = new Discord.MessageEmbed()
          .setTitle(`**${user.username}s deleted reaction (within 5s) in #${reaction.message.channel.name}**`)
          .setURL(`https://discord.com/channels/${reaction.message.channel.guild.id}/${reaction.message.channel.id}/${reaction.message.id}`)
          .addFields([{
            name: `${reaction.message.author.username}s message`,
            value: reaction.message.content
          }, {
            name: 'Reaction',
            value: reaction._emoji.name.match(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g) ? reaction._emoji.name : `<:${reaction._emoji.name}:${reaction._emoji.id}>`
          }])

      const hook = new Discord.WebhookClient('849106698878582795', 'kdi2mflSZKN0me43rZe2gDg76K13OR8MFNOgbd3f97-x6vMolgum2GB2JVOcyihijPTq');
      hook.send(embed);
    }
  });
};
