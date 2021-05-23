exports.name = ['raw'];
exports.permission = 'none';
exports.slash = [{
  name: 'raw',
  description: 'Shows raw input of message (what bot sees)',
  options: [{
    name: 'input',
    type: 'STRING',
    description: 'Input to return as raw',
    required: true,
  }],
}];
exports.handler = function(interaction) {
  interaction.editReply(`\`${interaction.options[0].value}\``);
};
