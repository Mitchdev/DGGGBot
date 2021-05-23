exports.name = ['emotesync']
exports.permission = 'mod'
exports.slash = [{
    name: 'emotesync',
    description: 'Syncs emotes in emote usage',
	defaultPermission: false,
    options: [{
        name: 'old',
        type: 'STRING',
        description: 'ID of old emote',
        required: true
    }, {
        name: 'new',
        type: 'STRING',
        description: 'ID of new emote',
        required: true
    }]
}]
exports.handler = function(interaction) {
	if (emotesUse.emotes[interaction.options[0].value]) {
		if (emotesUse.emotes[interaction.options[1].value]) {
			emotesUse.emotes[interaction.options[1].value].uses += emotesUse.emotes[interaction.options[0].value].uses;
			delete emotesUse.emotes[interaction.options[0].value];
			interaction.editReply(`Synced: ${client.guilds.resolve(options.guild).emojis.cache.get(interaction.options[1].value)}`);
		} else interaction.editReply(`Could not find ${interaction.options[1].value}`);
	} else interaction.editReply(`Could not find ${interaction.options[0].value}`);
}