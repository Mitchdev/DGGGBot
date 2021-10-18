exports.commands = {'commands': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'commands',
  description: 'Links to command list on github',
}];
exports.commandHandler = async function(interaction) {
  await interaction.deferReply({ephemeral: true});
  interaction.editReply({content: `**Commands** https://github.com/Mitchdev/DGGGBot#readme`, ephemeral: true});
};
