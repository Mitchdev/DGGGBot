exports.commands = {};
exports.buttons = {'autoroles': 'none'};
exports.slashes = [];
exports.buttonHandler = function(interaction) {
  interaction.defer({ephemeral: true});

  const foundRole = roles.list.find((role) => role.name === interaction.customID.split('|')[1]);
  if (foundRole) {
    interaction.member.guild.roles.fetch(foundRole.role).then((role) => {
      if (interaction.member._roles.includes(foundRole.role)) {
        interaction.member.roles.remove(role);
        interaction.editReply(`${foundRole.name} role removed`, {ephemeral: true});
      } else {
        interaction.member.roles.add(role);
        interaction.editReply(`${foundRole.name} role added`, {ephemeral: true});
      }
    }).catch(console.error)
  }
}