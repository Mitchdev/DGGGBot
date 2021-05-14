exports.name = ['raw']
exports.permission = 'none'
exports.slash = [{
    name: 'raw',
    description: 'Shows raw input of message (what bot sees)',
    options: [{
        name: 'input',
        type: 'STRING',
        description: 'Input to return as raw',
        required: true
    }]
}]
exports.handler = function(message) {
    var content = `\`${message.content.replace('!raw ', '')}\``;
    if (message.interaction) {
        message.interaction.editReply(content);
    } else {
        message.channel.send(content);
    }
}