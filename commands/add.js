exports.name = ['addrole']
exports.permission = 'mod'
exports.slash = [{
    name: 'addrole',
    description: 'Adds a role to the roles channel',
	defaultPermission: false,
    options: [{
        name: 'category',
        type: 'STRING',
        description: 'Category you want to role to appear in',
        required: true,
		choices: [{
			name: 'General',
			value: 'General'
		}, {
			name: 'Gaming',
			value: 'Gaming'
		}]
    }, {
        name: 'name',
        type: 'STRING',
        description: 'Name of role',
        required: true
    }, {
        name: 'role',
        type: 'ROLE',
        description: 'Role that gets added when doing the reaction',
        required: true
    }, {
        name: 'emoji',
        type: 'STRING',
        description: 'Emoji for reaction',
        required: true
    }, {
        name: 'position',
        type: 'INTEGER',
        description: 'Position in category',
        required: false
    }]
}]
exports.handler = function(interaction) {
	var role = {
		"name": interaction.options[1].value,
		"type": interaction.options[0].value,
		"role": interaction.options[2].value,
		"reaction": {"type": "", "name": "", "id": ""}
	};

	var emojiMatch = interaction.options[3].value.match(/\<\:(.+?)\:(\d+?)\>/g);
	var unicodeEmojiMatch = interaction.options[3].value.match(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g);
	if (emojiMatch != undefined) {
		var emoji = client.emojis.cache.find(emoji => emoji.id == emojiMatch[0].split(':')[2].replace('>', ''));
		if (emoji != undefined) {
			role.reaction.type = 'custom';
			role.reaction.name = emoji.name;
			role.reaction.id = emoji.id;
		} else {
			interaction.editReply('Invalid emoji, guild or unicode emoji only');
			return;
		}
	} else if (unicodeEmojiMatch != undefined) {
		role.reaction.type = 'unicode';
		role.reaction.name = unicodeEmojiMatch[0];
		role.reaction.id = unicodeEmojiMatch[0];
	} else {
		interaction.editReply('Invalid emoji, guild or unicode emoji only');
		return;
	}

	var alreadyUsed = roles.list.filter(r => (r.reaction.id == role.reaction.id || r.name.toLowerCase() == role.name.toLowerCase()));
	if (alreadyUsed.length > 0) {
		if (alreadyUsed.reaction.id == role.reaction.id) interaction.editReply('Role reaction already exists');
		else interaction.editReply('Role name already exists');
		return;
	}

	addRole(role, interaction.options.length == 5 ? interaction.options[4].value : undefined, interaction);
}