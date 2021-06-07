exports.commands = {'reload': 'dev'};
exports.buttons = {};
exports.slashes = [{
  name: 'reload',
  description: 'Reloads a command',
}];
exports.commandHandler = function(interaction, Discord, client) {
  interaction.defer({ephemeral: true});
  reloadCommands(client);
  interaction.editReply(`Reloading`, {ephemeral: true});
};
