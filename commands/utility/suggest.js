exports.commands = {'suggest': 'trusted'};
exports.buttons = {'suggest': 'mod'};
exports.slashes = [{
  name: 'suggest',
  description: 'Suggest a change / feature or bug',
  options: [{
    name: 'type',
    type: 'STRING',
    description: 'Bot or Server suggestion',
    required: true,
    choices: [{
      name: 'Bot',
      value: 'Bot',
    }, {
      name: 'Server',
      value: 'Server',
    }],
  }, {
    name: 'suggestion',
    type: 'STRING',
    description: 'Suggestion',
    required: true,
  }],
}];
exports.commandHandler = async function(interaction, Discord) {
  await interaction.deferReply({ephemeral: true});
  if (!suggestions.blacklist.find((id) => id === interaction.user.id)) {
    const id = makeID();
    const channel = await client.channels.resolve((interaction.options.get('type').value === 'Bot') ? process.env.CHANNEL_BOT_TESTING : process.env.CHANNEL_LOGS);
    const buttons = [new Discord.MessageActionRow().addComponents([
      new Discord.MessageButton({customId: `suggest|bl|${interaction.user.id}`, label: 'Blacklist User', style: 'DANGER'}),
      new Discord.MessageButton({customId: `suggest|delmute|${interaction.user.id}|${interaction.user.username}`, label: 'Delete & Mute (10m)', style: 'DANGER'}),
      new Discord.MessageButton({customId: `suggest|del|${interaction.user.id}`, label: 'Delete', style: 'DANGER'}),
    ]), new Discord.MessageActionRow().addComponents([
      new Discord.MessageButton({customId: `suggest|th|${interaction.user.id}|${id}`, label: 'Create Thread', style: 'SUCCESS'}),
      new Discord.MessageButton({customId: `suggest|inp`, label: 'In Progress', style: 'SUCCESS'}),
      new Discord.MessageButton({customId: `suggest|com`, label: 'Complete', style: 'SUCCESS'}),
      new Discord.MessageButton({customId: `suggest|den`, label: 'Denied', style: 'DANGER'}),
    ])];
    const embed = new Discord.MessageEmbed().setTitle(`${interaction.options.get('type').value} Suggestion - Pending`).setDescription(interaction.options.get('suggestion').value).setTimestamp().addFields([{
      name: 'User Username',
      value: interaction.user.username,
      inline: true,
    }, {
      name: 'User ID',
      value: interaction.user.id,
      inline: true,
    }]);
    suggestions.suggestions[id] = {
      'type': interaction.options.get('type').value,
      'suggestion': interaction.options.get('suggestion').value,
      'asker': interaction.user,
    };
    updateSuggestions();
    channel.send({embeds: [embed], components: buttons}).then(() => interaction.editReply({content: `Thank you for your ${interaction.options.get('type').value} suggestion.`}));
  } else {
    interaction.editReply({content: `You're blacklist from suggesting.\nPlease message ${client.users.resolve(process.env.DEV_ID)} if you think this is a mistake.`});
  }
};
exports.buttonHandler = async function(interaction, Discord) {
  await interaction.deferUpdate();
  const type = interaction.customId.split('|')[1];
  const userid = interaction.customId.split('|')[2];
  const button = new Discord.MessageActionRow();
  if (type === 'bl' || type === 'wl') {
    if (type === 'bl') {
      if (!suggestions.blacklist.find((id) => id === userid)) suggestions.blacklist.push(userid);
      await button.addComponents([new Discord.MessageButton({customId: `suggest|wl|${userid}`, label: 'Whitelist User', style: 'SUCCESS'})]);
    } else if (type === 'wl') {
      const index = suggestions.blacklist.findIndex((id) => id === userid);
      if (index >= 0) suggestions.blacklist.splice(index, 1);
      await button.addComponents([new Discord.MessageButton({customId: `suggest|bl|${userid}`, label: 'Blacklist User', style: 'DANGER'})]);
    }
    updateSuggestions();
    interaction.editReply({embeds: interaction.message.embeds, components: [button]});
  } else if (type === 'delmute' || type === 'del') {
    if (type === 'delmute') {
      try {
        if (!client.guilds.resolve(process.env.GUILD_ID).members.resolve(userid)._roles.includes(process.env.ROLE_MUTE)) client.guilds.resolve(process.env.GUILD_ID).members.resolve(userid).roles.add(client.guilds.resolve(process.env.GUILD_ID).roles.resolve(process.env.ROLE_MUTE));
        mutes.list = mutes.list.filter((m) => {
          return (m.user != userid) || (m.role != process.env.ROLE_MUTE);
        });
        mutes.list.push({
          'user': userid,
          'username': interaction.customId.split('|')[3],
          'role': process.env.ROLE_MUTE,
          'roleName': 'ROLE_MUTE',
          'startTime': new Date(),
          'time': 600,
          'timeRaw': '10m',
          'gamble': 5,
        });
        updateMutes();
      } catch (err) {
        console.log(err);
      }
    }
    interaction.deleteReply();
  } else if (type === 'th') {
    const data = suggestions.suggestions[interaction.customId.split('|')[3]];
    const thread = await client.channels.resolve(process.env.CHANNEL_GENERAL).threads.create({
      name: `${data.suggestion.substring(0, 95)}${(data.suggestion.length > 95 ? '...' : '')}`,
      autoArchiveDuration: 10080,
      type: 'private_thread',
      reason: `${data.type} Suggestion Thread`,
    });
    await thread.send({content: `${data.type} Suggestion Thread from ${suggestions.suggestions[interaction.customId.split('|')[3]].asker}\nThread created by ${interaction.user}\n\n**${data.suggestion}**`});
    const buttons = interaction.message.components;
    buttons[1].components[0].label = 'Thread Created';
    buttons[1].components[0].disabled = true;
    interaction.editReply({embeds: interaction.message.embeds, components: buttons});
  } else if (type === 'inp' || type === 'com' || type === 'den') {
    const embed = interaction.message.embeds;
    embed[0].setTitle(`${embed[0].title.split('-')[0]}- ${(type === 'inp' ? 'In Progress' : (type === 'com' ? 'Complete' : 'Denied'))}`);
    embed[0].setColor((type === 'inp' ? 'YELLOW' : (type === 'com' ? 'GREEN' : 'RED')));
    interaction.editReply({embeds: embed, components: interaction.message.components});
  }
};
