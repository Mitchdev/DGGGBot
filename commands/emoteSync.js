exports.commands = {'emotesync': 'mitch'};
exports.buttons = {};
exports.slashes = [{
  name: 'emotesync',
  description: 'Syncs emotes in emote usage',
  defaultPermission: false,
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
exports.commandHandler = function(interaction) {
  interaction.defer({ephemeral: true});
  
  if (emotesUse.emotes[interaction.options.get('old').value]) {
    if (emotesUse.emotes[interaction.options.get('new').value]) {
      emotesUse.emotes[interaction.options.get('new').value].uses += emotesUse.emotes[interaction.options.get('old').value].uses;
      delete emotesUse.emotes[interaction.options.get('old').value];
      interaction.editReply(`Synced: ${client.guilds.resolve(options.guild).emojis.cache.get(interaction.options.get('new').value)}`, {ephemeral: true});
    } else interaction.editReply(`Could not find ${interaction.options.get('new').value}`, {ephemeral: true});
  } else interaction.editReply(`Could not find ${interaction.options.get('old').value}`, {ephemeral: true});
};
