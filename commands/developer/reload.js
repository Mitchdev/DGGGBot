exports.commands = {'reload': 'dev'};
exports.buttons = {};
exports.slashes = [{
  name: 'reload',
  description: 'Reloads a command',
}];
exports.commandHandler = async function(interaction, Discord, client) {
  await interaction.defer({ephemeral: true});
  loadCommands(client, () => {
    interaction.editReply({content: 'Reloaded', ephemeral: true});
  });
};
