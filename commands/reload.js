exports.name = ['reload']
exports.permission = 'mod'
exports.handler = function(message) {
	message.delete({timeout: 1000});
	reloadRolesMessage(message);
}