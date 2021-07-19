exports.commands = {'info': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'info',
  description: 'Shows uptime and ping',
}];
exports.commandHandler = async function(interaction) {
  await interaction.defer();

  const pre = new Date();
  await fetch(process.env.ANDLIN_PING_API);
  const post = new Date();

  interaction.editReply({content: `**Client Uptime** ${secondsToDhms(client.uptime/1000)}\n**System Uptime** ${secondsToDhms(os.uptime())}\n\n**Discord API Ping** ${Math.round(client.ws.ping)}ms\n**Andlin API Ping** ${(post - pre)}ms`});
};
