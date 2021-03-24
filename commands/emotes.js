exports.name = ['emotes']
exports.permission = 'none'
exports.handler = function(message) {
	client.guilds.fetch(options.guild).then(guild => {
		var e = [];
		guild.emojis.cache.each(emoji => {
			if (!emoji.animated) {
				if (emotesUse.emotes[emoji.id]) {
					e.push({"name": emoji.name, "id": emoji.id, "count": emotesUse.emotes[emoji.id].uses});
				} else {
					e.push({"name": emoji.name, "id": emoji.id, "count": 0});
				}
			}
		});
		e.sort((a, b) => a.count-b.count);

		var combined = [];
		for (var i = 0; i < e.length; i++) {
			if (i == 0) {
				combined.unshift([e[i]]);
			} else {
				if (e[i].count == combined[0][combined[0].length-1].count) {
					combined[0].push(e[i]);
				} else {
					combined.unshift([e[i]]);
				}
			}
		}

		console.log(combined)

		var difference = (new Date().getTime() - new Date(emotesUse.started).getTime()) / 1000;
		if (message.content.toLowerCase().replace('!emotes', '') == ' all') {
			message.channel.send('Emote usage since '+secondsToDhms(parseInt(difference))+'ago ('+new Date(emotesUse.started).toUTCString()+')\n'+combined.map(l => {
				if (l) {
					return l[0].count + ' - ' + l.map(em => {
						return '<:' + em.name + ':' + em.id + '>';
					}).join('')
				} else {
					return;
				}
			}).join('\n'), {split: true})
		} else {
			var top5 = [combined[0], combined[1], combined[2], combined[3], combined[4]];
			var bottom5 = [combined[combined.length-1], combined[combined.length-2], combined[combined.length-3], combined[combined.length-4], combined[combined.length-5]];
			message.channel.send('Emote usage since '+secondsToDhms(parseInt(difference))+'ago ('+new Date(emotesUse.started).toUTCString()+')\n**Most used**\n'+top5.map(l => {
				if (l) {
					return l[0].count + ' - ' + l.map(em => {
						return '<:' + em.name + ':' + em.id + '>';
					}).join('')
				} else {
					return;
				}
			}).join('\n') + '\n\n**Least used**\n' + bottom5.map(l => {
				if (l) {
					return l[0].count + ' - ' + l.map(em => {
						return '<:' + em.name + ':' + em.id + '>';
					}).join('')
				} else {
					return;
				}
			}).join('\n'), {split: true})
		}
	});
}