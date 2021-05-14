exports.name = ['info']
exports.permission = 'none'
exports.slash = [{
    name: 'info',
    description: 'Shows uptime & ping'
}]
exports.handler = function(message) {
    var pre = new Date();
    request({
        method: 'POST',
        url: options.api.andlinPing.url,
        headers: {'Authorization': options.api.andlinPing.auth}
    }, (coordinatesErr, coordinatesReq, coordinatesRes) => {
        var post = new Date();
        var content = `**Client Uptime** ${secondsToDhms(client.uptime/1000)}\n**System Uptime** ${secondsToDhms(os.uptime())}\n\n**Client Ping** ${pre - message.createdTimestamp}ms\n**Discord API Ping** ${Math.round(client.ws.ping)}ms\n**Andlin API Ping** ${(post - pre)}ms`;
        if (message.interaction) {
            message.interaction.editReply(content);
        } else {
            message.channel.send(content);
        }
    });
}