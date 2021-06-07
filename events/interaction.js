module.exports = function(client) {
  const Discord = require('discord.js');
  client.on('interaction', (interaction) => {
    if (interaction.type === 'APPLICATION_COMMAND') {
      const command = commands.find((cmd) => cmd.commands[interaction.commandName] != undefined);
      if (command) {
        if (command.commands[interaction.commandName] === 'mod') {
          if (interaction.member._roles.includes(process.env.ROLE_MOD)) command.commandHandler(interaction, Discord, client);
        } else if (command.commands[interaction.commandName] === 'dev') {
          if (interaction.user.id === '399186129288560651') command.commandHandler(interaction, Discord, client);
        } else if (command.commands[interaction.commandName] === 'weeb/wizard') {
          if (interaction.member._roles.includes(process.env.ROLE_WEEB) || interaction.member._roles.includes(process.env.ROLE_WIZARD)) command.commandHandler(interaction, Discord);
        } else {
          command.commandHandler(interaction, Discord, client);
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
          if (interaction.member._roles.includes(process.env.ROLE_MOD)) command.buttonHandler(interaction, Discord, client);
        } else if (command.buttons[interaction.customID.split('|')[0]] === 'dev') {
          if (interaction.user.id === process.env.DEV_ID) command.buttonHandler(interaction, Discord, client);
        } else if (command.buttons[interaction.customID.split('|')[0]] === 'weeb/wizard') {
          if (interaction.member._roles.includes(process.env.ROLE_WEEB) || interaction.member._roles.includes(process.env.ROLE_WIZARD)) command.buttonHandler(interaction, Discord);
        } else {
          command.buttonHandler(interaction, Discord, client);
        }
      } else {
        console.log('<==== BUTTON ====>');
        console.log(interaction);
        console.log('<==== BUTTON_END ====>');
      }
    }
  });
};
