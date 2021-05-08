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
                    command.handler({'interaction': interaction, 'guild': interaction.guild, 'channel': client.channels.resolve(interaction.channelID), 'author': interaction.user, 'content': `!${interaction.commandName}${interaction.options.length > 0 ? ' ' : ''}${interaction.options.map(option => {
                        return option.value;
                    }).join(' ')}`})
                }
            } else {
                interaction.defer()
                command.handler({'interaction': interaction, 'guild': interaction.guild, 'channel': client.channels.resolve(interaction.channelID), 'author': interaction.user, 'content': `!${interaction.commandName}${interaction.options.length > 0 ? ' ' : ''}${interaction.options.map(option => {
                    return option.value;
                }).join(' ')}`})
            }
        } else {
            console.log(interaction);
            interaction.reply('Not a valid command.');
        }
    });
}