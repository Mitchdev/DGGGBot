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
exports.commandHandler = async function(interaction) {
  await interaction.defer({ephemeral: true});
  interaction.editReply({content: `\`${interaction.options.get('input').value}\``, ephemeral: true});
};
