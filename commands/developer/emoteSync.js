exports.commands = {'emotesync': 'dev'};
exports.buttons = {};
exports.slashes = [{
  name: 'emotesync',
  description: 'Syncs emotes in emote usage',
  options: [{
    name: 'old',
    type: 'STRING',
    description: 'ID of old emote',
    required: true,
  }, {
    name: 'new',
    type: 'STRING',
    description: 'ID of new emote',
    required: true,
  }],
}];
exports.commandHandler = async function(interaction) {
  await interaction.defer({ephemeral: true});

  if (emotesUse.emotes[interaction.options.get('old').value]) {
    if (emotesUse.emotes[interaction.options.get('new').value]) {
      emotesUse.emotes[interaction.options.get('new').value].uses += emotesUse.emotes[interaction.options.get('old').value].uses;
      delete emotesUse.emotes[interaction.options.get('old').value];
      interaction.editReply({content: `Synced: ${client.guilds.resolve(process.env.GUILD_ID).emojis.cache.get(interaction.options.get('new').value)}`, ephemeral: true});
    } else interaction.editReply({content: `Could not find ${interaction.options.get('new').value}`, ephemeral: true});
  } else interaction.editReply({content: `Could not find ${interaction.options.get('old').value}`, ephemeral: true});
};
