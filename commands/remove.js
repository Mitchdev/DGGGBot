exports.name = ['removerole']
exports.permission = 'mod'
exports.slash = [{
    name: 'removerole',
    description: 'Removes a role from the roles channel',
	defaultPermission: false,
    options: [{
        name: 'name',
        type: 'STRING',
        description: 'Name of role to remove',
        required: true
    }]
}]
exports.handler = function(interaction) {
	roles.list = roles.list.filter(role => role.name.toLowerCase() != interaction.options[0].value.toLowerCase());
	reloadRolesMessage();
	updateRoles();
}