exports.name = ['info']
exports.permission = 'none'
exports.slash = {
    name: 'info',
    description: 'Shows uptime & ping'
}
exports.handler = function(message) {
    var content = `**Client Uptime** ${secondsToDhms(client.uptime/1000)}\n**System Uptime** ${secondsToDhms(os.uptime())}\n\n**Client Ping** ${Date.now() - message.createdTimestamp}ms\n**API Ping** ${Math.round(client.ws.ping)}ms`;
    if (message.interaction) {
        message.interaction.editReply(content);
    } else {
        message.channel.send(content);
    }
}