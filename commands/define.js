exports.name = ['define']
exports.permission = 'none'
exports.slash = [{
    name: 'define',
    description: 'Gets definition of a phrase via urban dictionary',
    options: [{
        name: 'phrase',
        type: 'STRING',
        description: 'Phrase to be defined',
        required: true
    }]
}]
exports.handler = function(message) {
	if (!timedout) {
		var prase = message.content.toLowerCase().replace('!define ', '');
		if (prase == 'mitch') {
            var content = `**mitch**\nThe best moderator.`;
            if (message.interaction) {
                message.interaction.editReply(content);
            } else {
                message.channel.send(content);
            }
		} else {
			request('http://api.urbandictionary.com/v0/define?term=' + prase, function(err, res) {
				if (!err && res) {
					var data = JSON.parse(res.body).list
					if (data.length > 0) {
						if (data[0].example) {
							if ((`**${prase}**\n${data[0].definition}\n\n${data[0].example}`).length >= 2000) {
								if (!message.interaction) message.channel.send(options.emote.donowall.string);
							}
                            var content = `**${prase}**\n${data[0].definition}\n\n${data[0].example}`;
                            if (message.interaction) {
                                message.interaction.editReply(content);
                            } else {
                                message.channel.send(content);
                            }
							setTimeout(function() {
								timedout = false;
							}, 30*1000);
							timedout = true;
						} else {
							if ((`**${prase}**\n${data[0].definition}`).length >= 2000) {
								if (!message.interaction) message.channel.send(options.emote.donowall.string);
							}
                            var content = `**${prase}**\n${data[0].definition}`;
                            if (message.interaction) {
                                message.interaction.editReply(content);
                            } else {
                                message.channel.send(content);
                            }
							setTimeout(function() {
								timedout = false;
							}, 30*1000);
							timedout = true;
						}
					} else {
                        var content = `Couldn\'t find anything for **${prase}**.`;
                        if (message.interaction) {
                            message.interaction.editReply(content);
                        } else {
                            message.channel.send(content);
                        }
					}
				}
			})
		}
	} else if (!message.interaction) {
        message.react(message.guild.emojis.cache.get(options.emote.donowall.id));
	}
}