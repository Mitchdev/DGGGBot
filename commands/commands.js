exports.commands = {'commands': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'commands',
  description: 'Links to command list on github',
}];
exports.commandHandler = function(interaction) {
  interaction.defer({ephemeral: true});

  interaction.editReply({content: `**Commands** https://github.com/Mitchdev/DGGGBot#readme`, ephemeral: true}).then((msg) => {
    if (msg.type != 20) msg.suppressEmbeds();
  });
};
