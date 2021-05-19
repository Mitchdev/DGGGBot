exports.name = ['emotesync']
exports.permission = 'mod'
exports.slash = [{
    name: 'emotesync',
    description: 'Syncs emotes in emote usage',
    options: [{
        name: 'old',
        type: 'STRING',
        description: 'ID of old emote',
        required: true
    }, {
        name: 'new',
        type: 'STRING',
        description: 'ID of new emote',
        required: true
    }]
}]
exports.handler = function(message) {
    var args = message.content.split(' ');
    if (args.length == 3) {
        if (emotesUse.emotes[args[1]]) {
            if (emotesUse.emotes[args[2]]) {
                emotesUse.emotes[args[2]].uses += emotesUse.emotes[args[1]].uses;
                delete emotesUse.emotes[args[1]];
                if (message.interaction) message.interaction.editReply(`Synced: ${message.guild.emojis.cache.get(args[2])}`);
                else message.channel.send(`Synced: ${message.guild.emojis.cache.get(args[2])}`);
            } else {
                if (message.interaction) message.interaction.editReply(`Could not find ${args[2]}`);
                else message.channel.send(`Could not find ${args[2]}`);
            }
        } else {
            if (message.interaction) message.interaction.editReply(`Could not find ${args[1]}`);
            else message.channel.send(`Could not find ${args[1]}`);
        }
    }
}