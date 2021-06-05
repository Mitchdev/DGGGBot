exports.commands = {'translate': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'translate',
  description: 'Translate a phrase into english',
  options: [{
    name: 'phrase',
    type: 'STRING',
    description: 'Phrase to be translated',
    required: true,
  }],
}];
exports.commandHandler = function(interaction) {
  interaction.defer();
  
  const phrase = interaction.options.get('phrase').value;
  if (phrase.toLowerCase() === 'andlin') interaction.editReply(`**Svensk** - Language detection score: 777,777,777,777,777\n${phrase}\n**English**\n🥺 0mar 😂 please mute me <:rustgarage:800754270550360104>`);
  else {
    request({
      method: 'POST',
      url: options.api.translate.url,
      headers: {'Authorization': options.api.translate.auth},
      json: {'source': 'auto', 'target': 'en', 'text': escapeHtml(phrase, false)},
    }, function(err, req, res) {
      if (!err) {
        if (res) {
          if (res.Message) {
            client.users.fetch(options.user.mitch).then((mitch) => {
              mitch.send(`**Translator:** ${res.Message}\n**Sent:** \`\`\`{"source": "auto", "target": "en", "text": ${escapeHtml(phrase, false)}}\`\`\``);
            });
            client.users.fetch(options.user.andlin).then((andlin) => {
              andlin.send(`**Translator:** ${res.Message}\n**Sent:** \`\`\`{"source": "auto", "target": "en", "text": ${escapeHtml(phrase, false)}}\`\`\``);
            });
          } else if (res.length > 0) {
            if (res[0].translations) {
              if (res[0].translations.length > 0) {
                getLang(res[0].detectedLanguage.language, true, function(fromLang) {
                  if (fromLang) {
                    getLang(res[0].translations[0].to, true, function(toLang) {
                      if (toLang) splitMessage(interaction, `**${fromLang}** - Language confidence: ${parseFloat(res[0].detectedLanguage.score)*100}%\n${phrase}\n**${toLang}**\n${escapeHtml(res[0].translations[0].text, true)}`);
                      else {
                        client.users.fetch(options.user.mitch).then((mitch) => {
                          mitch.send(`Language missing: ${res[0].translations[0].to}`);
                        });
                      }
                    });
                  } else {
                    client.users.fetch(options.user.mitch).then((mitch) => {
                      mitch.send(`Language missing: ${res[0].detectedLanguage.language}`);
                    });
                  }
                });
              }
            }
          }
        }
      } else console.log(err);
    });
  }
};
