exports.name = ['info']
exports.permission = 'none'
exports.handler = function(message) {
    message.channel.send(`**Client Uptime** ${secondsToDhms(client.uptime/1000)}\n**System Uptime** ${secondsToDhms(os.uptime())}\n\n**Client Ping** ${Date.now() - message.createdTimestamp}ms\n**API Ping** ${Math.round(client.ws.ping)}ms`);
}