module.exports = function(client) {
  pinMessage = function(message) {
    if (!pins.list.includes(message.id)) {
      const Discord = require('discord.js');

      let imageURL = /(https?:\/\/.*\.(?:png|jpg))/gmi.exec(message.content);

      if (message.attachments.size > 0) {
        const attachmentImage = /(https?:\/\/.*\.(?:png|jpg))/gmi.exec(message.attachments.first().url);
        if (attachmentImage) imageURL = attachmentImage;
      }

      const embed = new Discord.MessageEmbed()
          .setTitle(`Pinned Message from #${message.channel.name}`)
          .setURL(`https://discord.com/channels/${message.channel.guild.id}/${message.channel.id}/${message.id}`)
          .setColor((message.member) ? (message.member.displayHexColor) ? message.member.displayHexColor : 'WHITE' : 'WHITE')
          .setDescription(message.content)
          .setTimestamp(message.createdTimestamp);

      if (imageURL) {
        embed.setImage(imageURL[0]);
      }

      const hook = new Discord.WebhookClient(process.env.WEBHOOK_PIN_ID, process.env.WEBHOOK_PIN_AUTH);

      hook.edit({'name': message.author.username, 'avatar': `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp`}).then((webhook) => {
        webhook.send(embed);
        // message.channel.send({content: `Pinned a message in <#819782211406397500> (https://discord.com/channels/${message.channel.guild.id}/${message.channel.id}/${message.id})`}).then(msg => {
        //  msg.suppressEmbeds();
        // })
        pins.list.push(message.id);
        updatePins();
      });
    }
  };
};
