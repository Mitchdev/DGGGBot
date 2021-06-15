exports.commands = {'info': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'info',
  description: 'Shows uptime and ping',
}];
exports.commandHandler = function(interaction) {
  interaction.defer();

  const pre = new Date();
  request({
    method: 'POST',
    url: process.env.ANDLIN_PING_API,
    headers: {'Authorization': process.env.ANDLIN_TOKEN},
  }, () => {
    const post = new Date();
    interaction.editReply({content: `**Client Uptime** ${secondsToDhms(client.uptime/1000)}\n**System Uptime** ${secondsToDhms(os.uptime())}\n\n**Discord API Ping** ${Math.round(client.ws.ping)}ms\n**Andlin API Ping** ${(post - pre)}ms`});
  });
};
