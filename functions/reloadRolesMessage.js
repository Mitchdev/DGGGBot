module.exports = function(client) {
  reloadRolesMessage = function() {
    const generalRoles = roles.list.filter((role) => role.type == 'General');
    const gamingRoles = roles.list.filter((role) => role.type == 'Gaming');
    const dndChannel = client.channels.cache.find((c) => c.id === options.channel.dnd);
    client.channels.resolve(options.channel.roles).messages.fetch(options.message.roles).then((msg) => {
      msg.edit('**Instructions**\n'+
        'React to this message to get a role and access to the channels.\n'+
        'I suggest you mute this channel so you don\'t get spammed. 🙂\n\n'+
        'Ask a mod to give you a regional role\n\n**General Roles**\n'+
        generalRoles.map((role) => {
          const emoji = role.reaction.type == 'custom' ? client.guilds.resolve(options.guild).emojis.cache.get(role.reaction.id) : role.reaction.id;
          return `${emoji}    ${role.name}`;
        }).join('\n')+
        '\n\n**Gaming Roles**\n'+
        gamingRoles.map((role) => {
          const emoji = role.reaction.type == 'custom' ? client.guilds.resolve(options.guild).emojis.cache.get(role.reaction.id) : role.reaction.id;
          return `${emoji}    ${role.name}`;
        }).join('\n')+
        `\n\n*Invite Only - DND query in* ${dndChannel}`);
      msg.reactions.removeAll();
      for (let i = 0; i < roles.list.length; i++) {
        msg.react(roles.list[i].reaction.type == 'custom' ? client.guilds.resolve(options.guild).emojis.cache.get(roles.list[i].reaction.id) : roles.list[i].reaction.id);
      }
    }).catch(console.error);
  };
};
