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
    url: options.api.andlinPing.url,
    headers: {'Authorization': options.api.andlinPing.auth},
  }, () => {
    const post = new Date();
    interaction.editReply(`**Client Uptime** ${secondsToDhms(client.uptime/1000)}\n**System Uptime** ${secondsToDhms(os.uptime())}\n\n**Discord API Ping** ${Math.round(client.ws.ping)}ms\n**Andlin API Ping** ${(post - pre)}ms`);
  });
};
