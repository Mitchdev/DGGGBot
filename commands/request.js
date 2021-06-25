exports.commands = {'feature': 'none', 'bug': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'feature',
  description: 'Request a feature',
  options: [{
    name: 'text',
    type: 'STRING',
    description: 'Describe the feature you want added',
    required: true,
  }],
}, {
  name: 'bug',
  description: 'Report a bug',
  options: [{
    name: 'text',
    type: 'STRING',
    description: 'Describe the bug',
    required: true,
  }],
}];
exports.commandHandler = async function(interaction, Discord) {
  interaction.defer({ephemeral: true});

  const channel = await client.channels.resolve(process.env.BOT_TESTING_CHANNEL_ID);
  const embed = new Discord.MessageEmbed()
    .setTitle(capitalize(interaction.commandName))
    .setColor((interaction.commandName === 'bug' ? 'RED' : 'GREEN'))
    .setDescription(interaction.options.get('text').value)
    .addFeilds([{
      name: 'User Username',
      value: interaction.user.username,
      inline: true,
    }, {
      name: 'User ID',
      value: interaction.user.id,
      inline: true,
    }])
    .setTimestamp();

  channel.send({embeds: [embed]}).then(() => interaction.editReply({content: options.emote.ok.string}));
};
