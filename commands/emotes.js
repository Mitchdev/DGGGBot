exports.name = ['emotes']
exports.permission = 'none'
exports.slash = [{
    name: 'emotes',
    description: 'Shows emote usage since last emote added',
    options: [{
        name: 'total',
        type: 'BOOLEAN',
        description: 'Shows emote useage since the begining',
        required: false
    }, {
        name: 'all',
        type: 'BOOLEAN',
        description: 'Shows all the emotes',
        required: false
    }]
}]
exports.handler = function(interaction) {
	client.guilds.fetch(options.guild).then(guild => {

		var total = false;
		var all = false;
		for (var i = 0; i < interaction.options.length; i++) {
			if (interaction.options[i].name === 'total') total = interaction.options[i].value;
			if (interaction.options[i].name === 'all') all = interaction.options[i].value;
		}

		var e = [];
		var combined = [];
		var totalLen = 0;
		var size = 0;

		guild.emojis.cache.each(emoji => {
			if (!emoji.animated) {
				total += parseInt(`<:${emoji.name}:${emoji.id}>`.length);
				size++;
				if (emotesUse.emotes[emoji.id]) {
					e.push({"name": emoji.name, "id": emoji.id, "count": total ? emotesUse.emotes[emoji.id].uses : emotesUse.emotes[emoji.id].newUses});
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
			if (combined[i].length > Math.round(1950/(totalLen/size))) {
				combined[i] = [{"emotes": combined[i].length, "count": combined[i][0].count}];
			}
		}

		var difference = (new Date().getTime() - new Date(total ? emotesUse.started : emotesUse.newStarted).getTime()) / 1000;
		if (all) {
			var content = 'Emote usage since '+secondsToDhms(parseInt(difference))+'ago ('+new Date(total ? emotesUse.started : emotesUse.newStarted).toUTCString()+')\n'+combined.map(l => {
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
			}).join('\n');
			interaction.editReply(content.length > 2000 ? `Working on a fix to post more than 2000 characters` : content);
		} else {
			var top5 = [combined[0], combined[1], combined[2], combined[3], combined[4]];
			var bottom5 = [combined[combined.length-1], combined[combined.length-2], combined[combined.length-3], combined[combined.length-4], combined[combined.length-5]];
			interaction.editReply('Emote usage since '+secondsToDhms(parseInt(difference))+'ago ('+new Date(total ? emotesUse.started : emotesUse.newStarted).toUTCString()+')\n**Most used**\n'+top5.map(l => {
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
			}).join('\n'))
		}
	});
}