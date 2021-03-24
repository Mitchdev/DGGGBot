exports.name = ['add']
exports.permission = 'mod'
exports.handler = function(message) {
	message.delete({timeout: 1000});
	var role = {"name": "","type": "","role": "","reaction": {"type": "","name": "","id": ""}};
	var argsTRE = message.content.replace('!add ', '').split(' ');
	var name = message.content.replace('!add ', '').split(' ');
	name.shift();
	name.pop();
	name.pop();
	if (message.content.replace('!add', '').match(/\d$/g)) name.pop();
	var args = [argsTRE[0], name.join(' ')];
	if (message.content.replace('!add', '').match(/\d$/g)) {
		args.push(argsTRE[argsTRE.length-3], argsTRE[argsTRE.length-2], argsTRE[argsTRE.length-1]);
	} else {
		args.push(argsTRE[argsTRE.length-2], argsTRE[argsTRE.length-1]);
	}

	if (args.length == 4 || args.length == 5) {
		if (args[0].toLowerCase() == 'general' || args[0].toLowerCase() == 'gaming') {
			role.type = capitalize(args[0]);
			
			var sameName = roles.list.filter(r => {return r.name.toLowerCase() == args[1].toLowerCase();});
			if (sameName.length > 0) {
				message.reply('Role name already exists `!add (gaming/general) (name) (roleid/@role) (emoji) [position in category]`').then(reply => reply.delete({timeout: 3000}));
				return;
			}

			role.name = args[1];

			var emojiMatch = args[3].match(/\<\:(.+?)\:(\d+?)\>/g);
			var unicodeEmojiMatch = args[3].match(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g);
			if (emojiMatch != undefined) {
				var emoji = client.emojis.cache.find(emoji => emoji.id == emojiMatch[0].split(':')[2].replace('>', ''));
				if (emoji != undefined) {
					role.reaction.type = 'custom';
					role.reaction.name = emoji.name;
					role.reaction.id = emoji.id;
				} else {
					message.reply('Invalid emoji `!add (gaming/general) (name) (roleid/@role) (emoji) [position in category]`').then(reply => reply.delete({timeout: 3000}));
					return;
				}
			} else if (unicodeEmojiMatch != undefined) {
					role.reaction.type = 'unicode';
					role.reaction.name = unicodeEmojiMatch[0];
					role.reaction.id = unicodeEmojiMatch[0];
			} else {
				message.reply('Invalid emoji `!add (gaming/general) (name) (roleid/@role) (emoji) [position in category]`').then(reply => reply.delete({timeout: 3000}));
				return;
			}

			var sameReaction = roles.list.filter(r => r.reaction.id == role.reaction.id);
			if (sameReaction.length > 0) {
				message.reply('Role reaction already exists `!add (gaming/general) (name) (roleid/@role) (emoji) [position in category]`').then(reply => reply.delete({timeout: 3000}));
				return;
			}

			if (message.mentions.roles.size > 0) {
				role.role = message.mentions.roles.first().id;
				addRole(role, args[4], message);
			} else {
				message.guild.roles.fetch(args[2]).then(guildRole => {
					if (guildRole != null) {
						role.role = args[2];
						addRole(role, args[4], message);
					} else {
						message.reply('Invalid role `!add (gaming/general) (name) (roleid/@role) (emoji) [position in category]`').then(reply => reply.delete({timeout: 3000}));
						return;
					}
				}).catch(console.error);
			}

		} else {
			message.reply('Invalid role type `!add (gaming/general) (name) (roleid/@role) (emoji) [position in category]`').then(reply => reply.delete({timeout: 3000}));
			return;
		}
	} else {
		message.reply('Invalid command `!add (gaming/general) (name) (roleid/@role) (emoji) [position in category]`').then(reply => reply.delete({timeout: 3000}));
		return;
	}
}