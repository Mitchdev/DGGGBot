exports.commands = {'deleteslash': 'mitch'};
exports.buttons = {};
exports.slashes = [{
  name: 'deleteslash',
  description: 'Deletes one or all slash commands',
  defaultPermission: false,
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
    client.guilds.resolve(options.guild).commands.resolve(interaction.options.get('id').value).delete().then((success) => {
      interaction.editReply('Deleted', {ephemeral: true});
    }).catch((err) => {
      client.application.commands.resolve(interaction.options.get('id').value).delete().then((success) => {
        interaction.editReply('Deleted', {ephemeral: true});
      }).catch((err) => {
        interaction.editReply('Could not delete', {ephemeral: true});
      });
    });
  } else {
    client.guilds.resolve(options.guild).commands.set([]);
    client.application.commands.set([]);
    interaction.editReply('Deleted', {ephemeral: true});
  }

  // client.guilds.resolve('768734582648209409').commands.resolve(interaction.options.get('id').value).delete().then((success) => {
  //   interaction.editReply('Deleted', {ephemeral: true});
  // }).catch((err) => {
  //   interaction.editReply('Could not delete', {ephemeral: true});
  // });
};
