module.exports = function(client) {
  const Discord = require('discord.js');
  client.on('interaction', (interaction) => {
    if (interaction.type === 'APPLICATION_COMMAND') {
      const command = commands.find((cmd) => cmd.commands[interaction.commandName] != undefined);
      if (command) {
        if (command.commands[interaction.commandName] === 'mod') {
          if (interaction.member._roles.includes(options.role.mod)) command.commandHandler(interaction, Discord);
        } else if (command.commands[interaction.commandName] === 'mitch') {
          if (interaction.user.id === '399186129288560651') command.commandHandler(interaction, Discord);
        } else if (command.commands[interaction.commandName] === 'weeb/wizard') {
          if (interaction.member._roles.includes(options.role.weeb) || interaction.member._roles.includes(options.role.wizard)) command.commandHandler(interaction, Discord);
        } else {
          command.commandHandler(interaction, Discord);
        }
      } else {
        console.log('<==== COMMAND ====>');
        console.log(interaction);
        console.log('<==== COMMAND_END ====>');
      }
    } else if (interaction.componentType === 'BUTTON') {
      const command = commands.find((cmd) => cmd.buttons[interaction.customID.split('|')[0]] != undefined);
      if (command) {
        if (command.buttons[interaction.customID.split('|')[0]] === 'mod') {
          if (interaction.member._roles.includes(options.role.mod)) command.buttonHandler(interaction, Discord);
        } else if (command.buttons[interaction.customID.split('|')[0]] === 'mitch') {
          if (interaction.user.id === '399186129288560651') command.buttonHandler(interaction, Discord);
        } else if (command.buttons[interaction.customID.split('|')[0]] === 'weeb/wizard') {
          if (interaction.member._roles.includes(options.role.weeb) || interaction.member._roles.includes(options.role.wizard)) command.buttonHandler(interaction, Discord);
        } else {
          command.buttonHandler(interaction, Discord);
        }
      } else {
        console.log('<==== BUTTON ====>');
        console.log(interaction);
        console.log('<==== BUTTON_END ====>');
      }
    }
  });
};
