exports.commands = {'translate': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'translate',
  description: 'Translates a phrase into english',
  options: [{
    name: 'phrase',
    type: 'STRING',
    description: 'Phrase to be translated',
    required: true,
  }, {
    name: 'target',
    type: 'STRING',
    description: 'Target language',
    required: false,
    choices: [{value: 'af', name: 'Afrikaans'}, {value: 'da', name: 'Danish'}, {value: 'de', name: 'German'}, {value: 'en', name: 'English'}, {value: 'es', name: 'Spanish'}, {value: 'he', name: 'Hebrew'}, {value: 'mi', name: 'Maori'}, {value: 'nb', name: 'Norwegian'}, {value: 'nl', name: 'Dutch'}, {value: 'sv', name: 'Swedish'}, {value: 'it', name: 'Italian'}, {value: 'hu', name: 'Hungarian'}, {value: 'ro', name: 'Romanian'}, {value: 'pt', name: 'Portuguese'}],
  }, {
    name: 'source',
    type: 'STRING',
    description: 'Source language',
    required: false,
    choices: [{value: 'auto', name: 'Automatic'}, {value: 'af', name: 'Afrikaans'}, {value: 'da', name: 'Danish'}, {value: 'de', name: 'German'}, {value: 'en', name: 'English'}, {value: 'es', name: 'Spanish'}, {value: 'he', name: 'Hebrew'}, {value: 'mi', name: 'Maori'}, {value: 'nb', name: 'Norwegian'}, {value: 'nl', name: 'Dutch'}, {value: 'sv', name: 'Swedish'}, {value: 'it', name: 'Italian'}, {value: 'hu', name: 'Hungarian'}, {value: 'ro', name: 'Romanian'}, {value: 'pt', name: 'Portuguese'}],
  }],
}];
exports.commandHandler = function(interaction) {
  interaction.defer();

  const phrase = interaction.options.get('phrase').value;
  if (phrase.toLowerCase() === 'andlin') interaction.editReply({content: `**Svensk** - Language detection score: 777,777,777,777,777\n${phrase}\n**English**\n🥺 0mar 😂 please mute me <:rustgarage:800754270550360104>`});
  else {
    const sourceLanguage = interaction.options.get('source') ? interaction.options.get('source').value : 'auto';
    const targetLanguage = interaction.options.get('target') ? interaction.options.get('target').value : 'en';
    request({
      method: 'POST',
      url: process.env.ANDLIN_TRANSLATE_API,
      headers: {'Authorization': process.env.ANDLIN_TOKEN},
      json: {'source': sourceLanguage, 'target': targetLanguage, 'text': escapeHtml(phrase, false)},
    }, function(err, req, res) {
      if (!err) {
        if (res) {
          if (res.Message) {
            client.users.fetch(process.env.DEV_ID).then((devLog) => {
              devLog.send({content: `**Translator:** ${res.Message}\n**Sent:** \`\`\`{"source": ${sourceLanguage}, "target": ${targetLanguage}, "text": ${escapeHtml(phrase, false)}}\`\`\``});
            });
            client.users.fetch(process.env.ANDLIN_ID).then((andlinLog) => {
              andlinLog.send({content: `**Translator:** ${res.Message}\n**Sent:** \`\`\`{"source": ${sourceLanguage}, "target": ${targetLanguage}, "text": ${escapeHtml(phrase, false)}}\`\`\``});
            });
          } else if (res.length > 0) {
            if (res[0].translations) {
              if (res[0].translations.length > 0) {
                sourceLanguageName = getLang((res[0].detectedLanguage ? res[0].detectedLanguage.language : sourceLanguage));
                targetLanguageName = getLang((res[0].translations[0].to ? res[0].translations[0].to: targetLanguage));
                splitMessage(interaction, `**${sourceLanguageName}**${(res[0].detectedLanguage ? ` - Language confidence: ${parseFloat(res[0].detectedLanguage.score)*100}%` : ``)}\n${phrase}\n**${targetLanguageName}**\n${escapeHtml(res[0].translations[0].text, true)}`);
              }
            }
          }
        }
      } else console.log(err);
    });
  }

  getLang = function(code) {
    const language = languageCodes.find((lang) => lang.code === code);
    return language.name;
  };
};
