exports.name = ['commands']
exports.permission = 'none'
exports.slash = [{
    name: 'commands',
    description: 'Links to command list on github'
}]
exports.handler = function(message) {
    var content = `**Commands** https://github.com/Mitchdev/DGGGBot#readme`;
    if (message.interaction) {
        message.interaction.editReply(content).then(msg => msg.suppressEmbeds(true));
    } else {
        message.channel.send(content).then(msg => msg.suppressEmbeds(true));
    }
}