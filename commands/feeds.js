exports.name = ['feeds']
exports.permission = 'mod'
exports.slash = [{
    name: 'feeds',
    description: 'Lists all the feeds'
}]
exports.handler = function(message) {
    var content = `**Feeds**\n${feeds.list.map(item => {
        return `${client.channels.cache.find(c => c.id === item.channel)} every ${item.interval} seconds`;
    }).join('\n')}`;
    if (message.interaction) {
        message.interaction.editReply(content);
    } else {
        message.channel.send(content);
    }
}