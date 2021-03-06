exports.commands = {'slash': 'dev'};
exports.buttons = {};
exports.slashes = [{
  name: 'slash',
  description: 'Slash commands',
  options: [{
    name: 'delete',
    type: 'SUB_COMMAND',
    description: 'Deletes one or all slash command',
    options: [{
      name: 'id',
      type: 'STRING',
      description: 'ID of slash command',
      required: false,
    }],
  }, {
    name: 'reload',
    type: 'SUB_COMMAND',
    description: 'Reloads all slash commands',
  }],
}];
exports.commandHandler = async function(interaction) {
  await interaction.deferReply({ephemeral: true});

  console.log(interaction.options);

  if (interaction.options.getSubcommand() === 'delete') {
    if (interaction.options.get('id')) {
      const clientCommand = client.application.commands.resolve(interaction.options.get('id').value);
      const guildCommand = client.guilds.resolve(process.env.GUILD_ID).commands.resolve(interaction.options.get('id').value);
      if (guildCommand) {
        guildCommand.delete().catch((err) => interaction.editReply({content: `Could not delete ${guildCommand.name}`, ephemeral: true}));
        interaction.editReply({content: `Deleted ${guildCommand.name}`, ephemeral: true});
      } else if (clientCommand) {
        clientCommand.delete().catch((err) => interaction.editReply({content: `Could not delete ${clientCommand.name}`, ephemeral: true}));
        interaction.editReply({content: `Deleted ${clientCommand.name}`, ephemeral: true});
      } else {
        interaction.editReply({content: `Could not find command ${interaction.options.get('id')}`, ephemeral: true});
      }
    } else {
      client.guilds.resolve(process.env.GUILD_ID).commands.set([]);
      client.application.commands.set([]);
      interaction.editReply({content: 'Deleted all commands', ephemeral: true});
    }
  } else if (interaction.options.getSubcommand() === 'reload') {
    interaction.editReply({content: 'Reloading slash commands'});
    reloadSlashCommands();
  }
};
