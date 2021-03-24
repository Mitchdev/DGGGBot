exports.name = ['vote']
exports.permission = 'mod'
exports.handler = function(message) {
	if (message.content.includes('?')) {
		var args = message.content.replace('!vote ', '');
		var parts = args.split('?');
		var question = parts[0]+'?';
		if (parts[1].trim() !== '') {
			var answers = parts[1].split(/\bor\b/i).map(a => a.trim());
			if (answers.length < 2 || answers.length > 9) {
				message.channel.send('Vote must have between 2 and 9 answers `!vote [question]? [answer] or [answer] or...`');
			} else {
				message.delete();
				message.channel.send(`**Vote** *started by ${message.author.username.toLowerCase()} for 30 seconds (after bot adds emotes)*\n${question}\n`+answers.map((a,i) => {
					return '**['+(i+1)+']** '+a;
				}).join('\n')).then(vote => {
					currentVoteID = vote.id;
					for (var i = 0; i < answers.length; i++) {
						vote.react(options.voteReactions[i]);
						voteValidReactions.push(options.voteReactions[i]);
						if (i == answers.length-1) {

						}
					}
					setTimeout(function() {
						var results = [];
						var i = 0;
						vote.reactions.cache.each(reaction => {
							if (voteValidReactions.includes(reaction._emoji.name)) {
								results.push([answers[i], reaction.count-1]);
								i++;
							}
						});
						results.sort((a,b) => b[1]-a[1]);
						vote.delete();
						currentVoteID = null;
						voteValidReactions = [];
						vote.channel.send('**Vote Results**\n'+question+'\n'+results.map((a,i) => {
							return a[0]+' - **'+a[1]+'**';
						}).join('\n'));
					}, (30+answers.length) * 1000);
				})
			}
		} else {
			message.channel.send('Vote must have between 2 and 9 answers `!vote [question]? [answer] or [answer] or...`');
		}
	} else {
		message.channel.send('Vote must contain a question `!vote [question]? [answer] or [answer] or...`');
	}
}