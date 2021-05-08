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
                client.guilds.fetch(options.guild).then(guild => {
                    guild.members.fetch(message.author.id).then(guildMember => {
                        if (guildMember._roles.includes(options.role.mod)) {
                            interaction.defer()
                            command.handler({'interaction': interaction, 'channel': client.channels.resolve(interaction.channelID), 'author': interaction.user, 'content': `!${interaction.commandName}${interaction.options.length > 0 ? ' ' : ''}${interaction.options.map(option => {
                                return option.value;
                            }).join(' ')}`})
                        }
                    });
                });
            } else {
                interaction.defer()
                command.handler({'interaction': interaction, 'channel': client.channels.resolve(interaction.channelID), 'author': interaction.user, 'content': `!${interaction.commandName}${interaction.options.length > 0 ? ' ' : ''}${interaction.options.map(option => {
                    return option.value;
                }).join(' ')}`})
            }
        } else {
            client.application.commands.delete(interaction.command);
        }
    });
}