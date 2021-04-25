exports.name = ['translate']
exports.permission = 'none'
exports.handler = function(message) {
	if (message.content.toLowerCase().replace('!translate ', '') === 'andlin') {
		message.channel.send(`**Svensk** - Language detection score: 777,777,777,777,777\n${message.content.replace('!translate ', '')}\n**English**\n🥺 0mar 😂 please mute me <:rustgarage:800754270550360104>`)
	} else {
		request({
			method: 'POST',
			url: options.api.translate.url,
			headers: {'Authorization': options.api.translate.auth},
			json: {"source": "auto", "target": "en", "text": escapeHtml(message.content.replace('!translate ', ''), false)}
		}, function (err, req, res) {
			if (!err) {
				if (res) {
					if (res.Message) {
						client.users.fetch(options.user.mitch).then(mitch => {
							mitch.send(`Translator: ${res.Message}\nSent: \`\`\`{"source": "auto", "target": "en", "text": ${escapeHtml(message.content.replace('!translate ', ''), false)}}\`\`\``);
						});
					} else if (res.length > 0) {
						if (res[0].translations) {
							if (res[0].translations.length > 0) {
								getLang(res[0].detectedLanguage.language, true, function(fromLang) {
									if (fromLang) {
										getLang(res[0].translations[0].to, true, function(toLang) {
										 	if (toLang) {
												message.channel.send(`**${fromLang}** - Language detection score: ${res[0].detectedLanguage.score}\n${message.content.replace('!translate ', '')}\n**${toLang}**\n${escapeHtml(res[0].translations[0].text, true)}`, {split: true});
										 	} else {
										 		client.users.fetch(options.user.mitch).then(mitch => {
													mitch.send(`Language missing: ${res[0].translations[0].to}`);
												});
										 	}
										});
									} else {
										client.users.fetch(options.user.mitch).then(mitch => {
											mitch.send(`Language missing: ${res[0].detectedLanguage.language}`);
										});
									}
								});
							}
						}
					}
				}
			} else {
				console.log(err);
			}
		});
	}
}