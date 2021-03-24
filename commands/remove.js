exports.name = ['remove']
exports.permission = 'mod'
exports.handler = function(message) {
	message.delete({timeout: 1000});
	roles.list = roles.list.filter(role => role.name.toLowerCase() != message.content.toLowerCase().replace('!remove ', ''));
	reloadRolesMessage(message);
	updateRoles();
}