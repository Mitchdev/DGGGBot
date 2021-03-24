module.exports = function(client) {
	addRole = function(role, pos, message) {
		var generalRoles = roles.list.filter(role => role.type == 'General');
		var gamingRoles = roles.list.filter(role => role.type == 'Gaming');

		if (pos != undefined) {
			if (role.type == 'Gaming') {
				if (pos <= gamingRoles.length && pos > 0) {
					roles.list.splice(generalRoles.length+parseInt(pos)-1, 0, role);
				} else {
					message.reply('Position out of range (1-'+gamingRoles.length+') `!add (gaming/general) (name) (roleid/@role) (emoji) [position in category]`').then(reply => reply.delete({timeout: 3000}));
					return;
				}
			} else {
				if (pos <= generalRoles.length && pos > 0) {
					roles.list.splice(parseInt(pos)-1, 0, role);
				} else {
					message.reply('Position out of range (1-'+generalRoles.length+') `!add (gaming/general) (name) (roleid/@role) (emoji) [position in category]`').then(reply => reply.delete({timeout: 3000}));
					return;
				}
			}
		} else {
			if (role.type == 'Gaming') {
				roles.list.push(role);
			} else {
				roles.list.splice(generalRoles.length, 0, role);
			}
		}
		reloadRolesMessage(message);
		updateRoles();
	}
}