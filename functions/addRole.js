module.exports = function(client) {
  addRole = function(role, pos, interaction, Discord) {
    const generalRoles = roles.list.filter((r) => r.type == 'General');
    const gamingRoles = roles.list.filter((r) => r.type == 'Gaming');

    if (pos != undefined) {
      if (role.type == 'Gaming') {
        if (pos <= gamingRoles.length && pos > 0) {
          roles.list.splice(generalRoles.length+parseInt(pos)-1, 0, role);
          interaction.editReply(`Added ${role.name}`, {ephemeral: true});
        } else {
          interaction.editReply(`Position out of range (1-${gamingRoles.length})`, {ephemeral: true});
          return;
        }
      } else {
        if (pos <= generalRoles.length && pos > 0) {
          roles.list.splice(parseInt(pos)-1, 0, role);
          interaction.editReply(`Added ${role.name}`, {ephemeral: true});
        } else {
          interaction.editReply(`Position out of range (1-${generalRoles.length})`, {ephemeral: true});
          return;
        }
      }
    } else {
      if (role.type == 'Gaming') {
        roles.list.push(role);
        interaction.editReply(`Added ${role.name}`, {ephemeral: true});
      } else {
        roles.list.splice(generalRoles.length, 0, role);
        interaction.editReply(`Added ${role.name}`, {ephemeral: true});
      }
    }
    reloadRolesMessage(Discord);
    updateRoles();
  };
};
