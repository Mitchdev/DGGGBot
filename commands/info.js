exports.name = ['info']
exports.permission = 'none'
exports.slash = [{
    name: 'info',
    description: 'Shows uptime & ping'
}]
exports.handler = function(interaction) {
    var pre = new Date();
    request({
        method: 'POST',
        url: options.api.andlinPing.url,
        headers: {'Authorization': options.api.andlinPing.auth}
    }, (coordinatesErr, coordinatesReq, coordinatesRes) => {
        var post = new Date();
        interaction.editReply(`**Client Uptime** ${secondsToDhms(client.uptime/1000)}\n**System Uptime** ${secondsToDhms(os.uptime())}\n\n**Discord API Ping** ${Math.round(client.ws.ping)}ms\n**Andlin API Ping** ${(post - pre)}ms`);
    });
}