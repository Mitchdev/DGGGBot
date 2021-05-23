exports.name = ['info'];
exports.permission = 'none';
exports.slash = [{
  name: 'info',
  description: 'Shows uptime and ping',
}];
exports.handler = function(interaction) {
  const pre = new Date();
  request({
    method: 'POST',
    url: options.api.andlinPing.url,
    headers: {'Authorization': options.api.andlinPing.auth},
  }, (coordinatesErr, coordinatesReq, coordinatesRes) => {
    const post = new Date();
    interaction.editReply(`**Client Uptime** ${secondsToDhms(client.uptime/1000)}\n**System Uptime** ${secondsToDhms(os.uptime())}\n\n**Discord API Ping** ${Math.round(client.ws.ping)}ms\n**Andlin API Ping** ${(post - pre)}ms`);
  });
};
