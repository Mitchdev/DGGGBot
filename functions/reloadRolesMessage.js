module.exports = function(client) {
  reloadRolesMessage = function(Discord) {
    const generalRoles = roles.list.filter((role) => role.type == 'General');
    const gamingRoles = roles.list.filter((role) => role.type == 'Gaming');
    client.channels.resolve(process.env.CHANNEL_ROLES).messages.fetch(process.env.MESSAGE_ROLES).then((msg) => {

      const buttons = [];
      const buttonsTemp = [[], []];

      for (let i = 0; i < roles.list.length; i++) {
        const emoji = roles.list[i].reaction.type == 'custom' ? client.guilds.resolve(process.env.GUILD_ID).emojis.cache.get(roles.list[i].reaction.id) : roles.list[i].reaction.id
        buttonsTemp[roles.list[i].type === 'General' ? 0 : 1].push(new Discord.MessageButton({custom_id: `autoroles|${roles.list[i].name}`, label: roles.list[i].name, style: 'PRIMARY'}).setEmoji(emoji));
      }
      
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < Math.ceil(buttonsTemp[i].length/5); j++) {
          buttons.push(new Discord.MessageActionRow());
          for (let k = (j*5); k < 5 + (j*5); k++) {
            if (buttonsTemp[i][k]) {
              buttons[buttons.length-1].addComponents(buttonsTemp[i][k]);
            }
          }
        }
      }

      msg.edit('**Instructions**\n'+
        'Press a button to get the role and access to the channels.\n'+
        'Ask a mod to give you a regional role\n\n**General Roles**\n'+
        generalRoles.map((role) => {
          const emoji = role.reaction.type == 'custom' ? client.guilds.resolve(process.env.GUILD_ID).emojis.cache.get(role.reaction.id) : role.reaction.id;
          return `${emoji}    ${role.name}`;
        }).join('\n')+
        '\n\n**Gaming Roles**\n'+
        gamingRoles.map((role) => {
          const emoji = role.reaction.type == 'custom' ? client.guilds.resolve(process.env.GUILD_ID).emojis.cache.get(role.reaction.id) : role.reaction.id;
          return `${emoji}    ${role.name}`;
        }).join('\n'), {components: buttons});
    }).catch(console.error);
  };
};
