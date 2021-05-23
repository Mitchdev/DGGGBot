module.exports = function(client) {
	addRole = function(role, pos, interaction) {
		var generalRoles = roles.list.filter(r => r.type == 'General');
		var gamingRoles = roles.list.filter(r => r.type == 'Gaming');

		if (pos != undefined) {
			if (role.type == 'Gaming') {
				if (pos <= gamingRoles.length && pos > 0) {
					roles.list.splice(generalRoles.length+parseInt(pos)-1, 0, role);
					interaction.editReply(`Added ${role.name}`);
				} else {
					interaction.editReply(`Position out of range (1-${gamingRoles.length})`)
					return;
				}
			} else {
				if (pos <= generalRoles.length && pos > 0) {
					roles.list.splice(parseInt(pos)-1, 0, role);
					interaction.editReply(`Added ${role.name}`);
				} else {
					interaction.editReply(`Position out of range (1-${generalRoles.length})`)
					return;
				}
			}
		} else {
			if (role.type == 'Gaming') {
				roles.list.push(role);
				interaction.editReply(`Added ${role.name}`);
			} else {
				roles.list.splice(generalRoles.length, 0, role);
				interaction.editReply(`Added ${role.name}`);
			}
		}
		reloadRolesMessage();
		updateRoles();
	}
}