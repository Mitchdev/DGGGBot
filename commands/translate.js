exports.name = ['translate']
exports.permission = 'none'
exports.slash = [{
    name: 'translate',
    description: 'Translate a phrase into english',
    options: [{
        name: 'phrase',
        type: 'STRING',
        description: 'Phrase to be translated',
        required: true
    }]
}]
exports.handler = function(message) {
	if (message.content.toLowerCase().replace('!translate ', '') === 'andlin') {
        var content = `**Svensk** - Language detection score: 777,777,777,777,777\n${message.content.replace('!translate ', '')}\n**English**\n🥺 0mar 😂 please mute me <:rustgarage:800754270550360104>`;
        if (message.interaction) {
            message.interaction.editReply(content);
        } else {
            message.channel.send(content);
        }
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
							mitch.send(`**Translator:** ${res.Message}\n**Sent:** \`\`\`{"source": "auto", "target": "en", "text": ${escapeHtml(message.content.replace('!translate ', ''), false)}}\`\`\``);
						});
						client.users.fetch(options.user.andlin).then(andlin => {
							andlin.send(`**Translator:** ${res.Message}\n**Sent:** \`\`\`{"source": "auto", "target": "en", "text": ${escapeHtml(message.content.replace('!translate ', ''), false)}}\`\`\``);
						});
					} else if (res.length > 0) {
						if (res[0].translations) {
							if (res[0].translations.length > 0) {
								getLang(res[0].detectedLanguage.language, true, function(fromLang) {
									if (fromLang) {
										getLang(res[0].translations[0].to, true, function(toLang) {
										 	if (toLang) {
                                                var content = `**${fromLang}** - Language confidence: ${parseFloat(res[0].detectedLanguage.score)*100}%\n${message.content.replace('!translate ', '')}\n**${toLang}**\n${escapeHtml(res[0].translations[0].text, true)}`;
                                                if (message.interaction) {
                                                    message.interaction.editReply(content, {split: true});
                                                } else {
                                                    message.channel.send(content, {split: true});
                                                }
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