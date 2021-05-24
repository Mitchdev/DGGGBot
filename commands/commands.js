exports.name = ['commands'];
exports.permission = 'none';
exports.slash = [{
  name: 'commands',
  description: 'Links to command list on github',
}];
exports.handler = function(interaction) {
  interaction.editReply(`**Commands** https://github.com/Mitchdev/DGGGBot#readme`).then((msg) => {
		if (msg.type != 20) msg.suppressEmbeds();
	});
};
