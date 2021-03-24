exports.name = ['define']
exports.permission = 'none'
exports.handler = function(message) {
	if (!timedout) {
		var prase = message.content.toLowerCase().replace('!define ', '');
		if (prase == 'mitch') {
			message.channel.send("**mitch**\nThe best moderator.");
		} else {
			request('http://api.urbandictionary.com/v0/define?term=' + prase, function(err, res) {
				if (!err && res) {
					var data = JSON.parse(res.body).list
					if (data.length > 0) {
						if (data[0].example) {
							if ((`**${prase}**\n${data[0].definition}\n\n${data[0].example}`).length >= 2000) {
								message.channel.send(options.emote.donowall.string);
							}
							message.channel.send(`**${prase}**\n${data[0].definition}\n\n${data[0].example}`);
							setTimeout(function() {
								timedout = false;
							}, 30*1000);
							timedout = true;
						} else {
							if ((`**${prase}**\n${data[0].definition}`).length >= 2000) {
								message.channel.send(options.emote.donowall.string);
							}
							message.channel.send(`**${prase}**\n${data[0].definition}`);
							setTimeout(function() {
								timedout = false;
							}, 30*1000);
							timedout = true;
						}
					} else {
						message.channel.send(`Couldn\'t find anything for **${prase}**.`);
					}
				}
			})
		}
	} else {
		message.react(message.guild.emojis.cache.get(options.emote.donowall.id));
	}
}