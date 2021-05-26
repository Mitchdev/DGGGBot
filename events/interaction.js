module.exports = function(client) {
  client.on('interaction', (interaction) => {
    if (!interaction.isCommand()) return;
    const command = commands.find((cmd) => {
      let found = false;
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
          interaction.defer();
          command.handler(interaction);
        }
      } else {
        interaction.defer();
        command.handler(interaction);
      }
    } else {
      console.log(interaction);
      interaction.reply('Not a valid command.');
    }
  });
};
