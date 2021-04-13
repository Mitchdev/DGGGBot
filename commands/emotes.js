exports.name = ['emotes']
exports.permission = 'none'
exports.handler = function(message) {
	client.guilds.fetch(options.guild).then(guild => {
		
		var e = [];
		var combined = [];
		var total = 0;
		var size = 0;

		guild.emojis.cache.each(emoji => {
			if (!emoji.animated) {
				total += parseInt(`<:${emoji.name}:${emoji.id}>`.length);
				size++;
				if (emotesUse.emotes[emoji.id]) {
					e.push({"name": emoji.name, "id": emoji.id, "count": message.content.toLowerCase().replace('!emotes', '').includes('total') ? emotesUse.emotes[emoji.id].uses : emotesUse.emotes[emoji.id].newUses});
				} else {
					e.push({"name": emoji.name, "id": emoji.id, "count": 0});
				}
			}
		});

		e.sort((a, b) => a.count-b.count);

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

		for (var i = 0; i < combined.length; i++) {
			if (combined[i].length > Math.round(1950/(total/size))) {
				combined[i] = [{"emotes": combined[i].length, "count": combined[i][0].count}];
			}
		}

		var difference = (new Date().getTime() - new Date(message.content.toLowerCase().replace('!emotes', '').includes('total') ? emotesUse.started : emotesUse.newStarted).getTime()) / 1000;
		if (message.content.toLowerCase().replace('!emotes', '').includes('all')) {
			message.channel.send('Emote usage since '+secondsToDhms(parseInt(difference))+'ago ('+new Date(message.content.toLowerCase().replace('!emotes', '').includes('total') ? emotesUse.started : emotesUse.newStarted).toUTCString()+')\n'+combined.map(l => {
				if (l) {
					if (l[0].emotes) {
						return l[0].count + ' - ' + l[0].emotes + ' emotes';
					} else {
						return l[0].count + ' - ' + l.map(em => {
							return '<:' + em.name + ':' + em.id + '>';
						}).join('')
					}
				} else {
					return;
				}
			}).join('\n'), {split: true})
		} else {
			var top5 = [combined[0], combined[1], combined[2], combined[3], combined[4]];
			var bottom5 = [combined[combined.length-1], combined[combined.length-2], combined[combined.length-3], combined[combined.length-4], combined[combined.length-5]];
			message.channel.send('Emote usage since '+secondsToDhms(parseInt(difference))+'ago ('+new Date(message.content.toLowerCase().replace('!emotes', '').includes('total') ? emotesUse.started : emotesUse.newStarted).toUTCString()+')\n**Most used**\n'+top5.map(l => {
				if (l) {
					if (l[0].emotes) {
						return l[0].count + ' - ' + l[0].emotes + ' emotes';
					} else {
						return l[0].count + ' - ' + l.map(em => {
							return '<:' + em.name + ':' + em.id + '>';
						}).join('')
					}
				} else {
					return;
				}
			}).join('\n') + '\n\n**Least used**\n' + bottom5.map(l => {
				if (l) {
					if (l[0].emotes) {
						return l[0].count + ' - ' + l[0].emotes + ' emotes';
					} else {
						return l[0].count + ' - ' + l.map(em => {
							return '<:' + em.name + ':' + em.id + '>';
						}).join('')
					}
				} else {
					return;
				}
			}).join('\n'), {split: true})
		}
	});
}