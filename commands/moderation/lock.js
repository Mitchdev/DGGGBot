exports.commands = {'lock': 'mod'};
exports.buttons = {};
exports.slashes = [{
  name: 'lock',
  description: 'Lock channel',
  defaultPermission: false,
  options: [{
    name: 'hide',
    description: 'Hide the channel (only mods can see it)',
    type: 'BOOLEAN',
    required: true,
  }],
}];
exports.commandHandler = async function(interaction) {
  await interaction.deferReply({ephemeral: true});

  await interaction.channel.permissionOverwrites.create(client.guilds.resolve(process.env.GUILD_ID).roles.everyone, {
    VIEW_CHANNEL: !interaction.options.get('hide').value,
    SEND_MESSAGES: false,
  });

  await interaction.channel.permissionOverwrites.create(client.guilds.resolve(process.env.GUILD_ID).roles.resolve(process.env.ROLE_MOD), {
    VIEW_CHANNEL: true,
    SEND_MESSAGES: true,
  });

  interaction.editReply(`Locked${interaction.options.get('hide').value ? ' and hid.' : ''}`);
};
