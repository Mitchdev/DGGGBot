module.exports = function(client) {
  const Discord = require('discord.js');
  client.on('interactionCreate', async (interaction) => {
    if (interaction.type === 'APPLICATION_COMMAND') {
      const command = commands.find((cmd) => cmd.commands[interaction.commandName] != undefined);
      if (command) {
        if (options.BFCCUsers[interaction.commandName]?.includes(interaction.user.id)) {
          await interaction.defer({ephemeral: true});
          interaction.editReply({content: `You have been banned from using the command **${interaction.commandName}**\nPlease message ${client.users.resolve(process.env.DEV_ID)} if you think this is a mistake.`});
        } else {
          if (command.commands[interaction.commandName] === 'mod') {
            if (interaction.member._roles.includes(process.env.ROLE_MOD)) command.commandHandler(interaction, Discord, client);
          } else if (command.commands[interaction.commandName] === 'dev') {
            if (interaction.user.id === process.env.DEV_ID) command.commandHandler(interaction, Discord, client);
          } else if (command.commands[interaction.commandName] === 'trusted') {
            if (interaction.member._roles.includes(process.env.ROLE_MOD) || interaction.member._roles.includes(process.env.ROLE_TRUSTED)) command.commandHandler(interaction, Discord, client);
          } else if (command.commands[interaction.commandName] === 'weeb/wizard') {
            if (interaction.member._roles.includes(process.env.ROLE_WEEB) || interaction.member._roles.includes(process.env.ROLE_WIZARD)) command.commandHandler(interaction, Discord);
          } else {
            command.commandHandler(interaction, Discord, client);
          }
        }
      } else {
        console.log('<==== COMMAND ====>');
        console.log(interaction);
        console.log('<==== COMMAND_END ====>');
      }
    } else if (interaction.componentType === 'BUTTON') {
      if (interaction.customId.split('|')[0] === 'counter') {
        await interaction.deferUpdate();
        const button = interaction.message.components[0];
        button.components[0].setCustomId(`counter|${parseInt(interaction.customId.split('|')[1])+1}`);
        interaction.editReply({content: interaction.customId.split('|')[1], components: [button]});
      } else {
        const command = commands.find((cmd) => cmd.buttons[interaction.customId.split('|')[0]] != undefined);
        if (command) {
          if (command.buttons[interaction.customId.split('|')[0]] === 'mod') {
            if (interaction.member._roles.includes(process.env.ROLE_MOD)) command.buttonHandler(interaction, Discord, client);
          } else if (command.buttons[interaction.customId.split('|')[0]] === 'dev') {
            if (interaction.user.id === process.env.DEV_ID) command.buttonHandler(interaction, Discord, client);
          } else if (command.buttons[interaction.customId.split('|')[0]] === 'trusted') {
            if (interaction.member._roles.includes(process.env.ROLE_MOD) || interaction.member._roles.includes(process.env.ROLE_TRUSTED)) command.buttonHandler(interaction, Discord);
          } else if (command.buttons[interaction.customId.split('|')[0]] === 'weeb/wizard') {
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
    }
  });
};
