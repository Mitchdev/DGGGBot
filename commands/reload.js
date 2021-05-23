exports.name = ['reload'];
exports.permission = 'mod';
exports.slash = [{
  name: 'reload',
  description: 'Reloads roles channel if bugged',
  defaultPermission: false,
}];
exports.handler = function(interaction) {
  interaction.editReply(options.emote.ok.string).then((msg) => msg.delete({timeout: 2000}));
  reloadRolesMessage();
};
