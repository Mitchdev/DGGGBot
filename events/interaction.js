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
			interaction.defer()
			command.handler(interaction);
        } else {
            console.log(interaction);
            interaction.reply('Not a valid command.');
        }
    });
}