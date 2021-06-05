exports.commands = {'raw': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'raw',
  description: 'Shows raw input of message (what bot sees)',
  options: [{
    name: 'input',
    type: 'STRING',
    description: 'Input to return as raw',
    required: true,
  }],
}];
exports.commandHandler = function(interaction) {
  interaction.defer({ephemeral: true});
  interaction.editReply(`\`${interaction.options.get('input').value}\``, {ephemeral: true});
};
