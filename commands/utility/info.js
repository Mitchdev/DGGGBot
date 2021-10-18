exports.commands = {'info': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'info',
  description: 'Shows uptime and ping',
}];
exports.commandHandler = async function(interaction, Discord) {
  await interaction.deferReply();

  const pre = new Date();
  await fetch(process.env.ANDLIN_PING_API);
  const post = new Date();

  const embed = new Discord.MessageEmbed().setTitle('Info').addFields([{
    name: 'Client Uptime',
    value: secondsToDhms(client.uptime/1000),
    inline: true,
  }, {name: '\u200B', value: '\u200B', inline: true}, {
    name: 'Discord API Ping',
    value: `${Math.round(client.ws.ping)}ms`,
    inline: true,
  }, {
    name: 'System Uptime',
    value: secondsToDhms(os.uptime()),
    inline: true,
  }, {name: '\u200B', value: '\u200B', inline: true}, {
    name: 'Andlin API Ping',
    value: `${(post - pre)}ms`,
    inline: true,
  }]);

  interaction.editReply({embeds: [embed]});
};
