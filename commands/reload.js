exports.name = ['reload']
exports.permission = 'mod'
exports.slash = [{
    name: 'reload',
    description: 'Reloads roles channel if bugged'
}]
exports.handler = function(message) {
	if (message.interaction) {
        message.interaction.editReply(options.emote.ok.string).then(msg => msg.delete({timeout: 2000}));
    } else {
        message.delete({timeout: 1000});
    }
	reloadRolesMessage(message);
}