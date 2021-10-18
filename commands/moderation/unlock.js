exports.commands = {'unlock': 'mod'};
exports.buttons = {};
exports.slashes = [{
  name: 'unlock',
  description: 'Unlocks channel',
  defaultPermission: false,
}];
exports.commandHandler = async function(interaction) {
  await interaction.deferReply({ephemeral: true});
  await interaction.channel.permissionOverwrites.create(client.guilds.resolve(process.env.GUILD_ID).roles.everyone, {
    VIEW_CHANNEL: null,
    SEND_MESSAGES: null,
  });

  interaction.editReply('Unlocked');
};
