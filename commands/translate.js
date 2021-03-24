exports.name = ['translate']
exports.permission = 'none'
exports.handler = function(message) {
	request({
		method: 'POST',
		url: options.api.translate.url,
		headers: {'Authorization': options.api.translate.auth},
		json: {"source": "auto", "target": "en", "text": message.content.replace('!translate ', '')}
	}, function (err, req, res) {
		//console.log(res);
		if (!err) {
			if (res) {
				if (res.message) {
					client.users.fetch(options.user.mitch).then(mitch => {
						mitch.send(`Translator: ${res.message}`);
					});
				} else {
					if (res.length > 0) {
						if (res[0].translations) {
							if (res[0].translations.length > 0) {
								getLang(res[0].detectedLanguage.language, true, function(fromLang) {
									if (fromLang) {
										getLang(res[0].translations[0].to, true, function(toLang) {
										 	if (toLang) {
												message.channel.send(`**${fromLang}** - Language detection score: ${res[0].detectedLanguage.score}\n${message.content.replace('!translate ', '')}\n**${toLang}**\n${res[0].translations[0].text}`);
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
			}
		} else {
			console.log(err);
		}
	});
}