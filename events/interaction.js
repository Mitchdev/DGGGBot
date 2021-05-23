module.exports = function(client) {
    client.on('interaction', (interaction) => {
        if (!interaction.isCommand()) return;
        var command = commands.find(cmd => {
            var found = false;
            for (i = 0; i < cmd.name.length; i++) {
                if (!found) {
                    found = (interaction.commandName == cmd.name[i]);
                }
            }
            return found;
        });
        if (command) {
			if (command.permission == 'mod') {
				if (interaction.member._roles.includes(options.role.mod)) {
					interaction.defer()
					command.handler(interaction);
				} else {
					interaction.defer()
					var int = interaction;
					client.guilds.resolve(options.guild).roles.fetch(options.role.mute).then(role => {
						int.member.roles.add(role);
						int.editReply(`Dumbfuck (1h)`);
						mutes.list.push({
							"user": int.user.id,
							"username": int.user.username,
							"role": options.role.mute,
							"roleName": "Mute",
							"startTime": new Date(),
							"time": 3600,
							"timeRaw": "1h"
						});
						updateMutes();
					});
				}
			} else {
			}
        } else {
            console.log(interaction);
            interaction.reply('Not a valid command.');
        }
    });
}