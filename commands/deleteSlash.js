exports.commands = {'deleteslash': 'dev'};
exports.buttons = {};
exports.slashes = [{
  name: 'deleteslash',
  description: 'Deletes one or all slash commands',
  options: [{
    name: 'id',
    type: 'STRING',
    description: 'ID of slash command',
    required: false,
  }],
}];
exports.commandHandler = function(interaction) {
  interaction.defer({ephemeral: true});

  if (interaction.options.get('id')) {
    const clientCommand = client.application.commands.resolve(interaction.options.get('id').value);
    const guildCommand = client.guilds.resolve(process.env.GUILD_ID).commands.resolve(interaction.options.get('id').value);
    if (guildCommand) {
      guildCommand.delete().catch((err) => interaction.editReply(`Could not delete ${guildCommand.name}`, {ephemeral: true}));
      interaction.editReply({content: `Deleted ${guildCommand.name}`, ephemeral: true});
    } else if (clientCommand) {
      clientCommand.delete().catch((err) => interaction.editReply(`Could not delete ${clientCommand.name}`, {ephemeral: true}));
      interaction.editReply({content: `Deleted ${clientCommand.name}`, ephemeral: true});
    } else {
      interaction.editReply({content: `Could not find command ${interaction.options.get('id')}`, ephemeral: true});
    }
  } else {
    client.guilds.resolve(process.env.GUILD_ID).commands.set([]);
    client.application.commands.set([]);
    interaction.editReply({content: 'Deleted all commands', ephemeral: true});
  }
};
