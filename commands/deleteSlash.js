exports.name = ['deleteslash']
exports.permission = 'mod'
exports.slash = [{
    name: 'deleteslash',
    description: 'Deletes a slash command that is broken',
	defaultPermission: false,
    options: [{
        name: 'id',
        type: 'STRING',
        description: 'ID of slash command',
        required: true
    }]
}]
exports.handler = function(interaction) {
	client.guilds.resolve('768734582648209409').commands.resolve(interaction.options[0].value).delete().then(success => {
		interaction.editReply('Deleted');
	}).catch(err => {
		interaction.editReply('Could not delete');
	});
}