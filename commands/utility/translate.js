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
    choices: [
      {value: 'af', name: 'Afrikaans'}, {value: 'da', name: 'Danish'}, {value: 'de', name: 'German'}, {value: 'en', name: 'English'}, {value: 'es', name: 'Spanish'},
      {value: 'he', name: 'Hebrew'}, {value: 'mi', name: 'Maori'}, {value: 'nb', name: 'Norwegian'}, {value: 'nl', name: 'Dutch'}, {value: 'sv', name: 'Swedish'}, {value: 'it', name: 'Italian'},
      {value: 'hu', name: 'Hungarian'}, {value: 'ro', name: 'Romanian'}, {value: 'pt', name: 'Portuguese'},
    ],
  }, {
    name: 'source',
    type: 'STRING',
    description: 'Source language',
    required: false,
    choices: [
      {value: 'auto', name: 'Automatic'}, {value: 'af', name: 'Afrikaans'}, {value: 'da', name: 'Danish'}, {value: 'de', name: 'German'}, {value: 'en', name: 'English'}, {value: 'es', name: 'Spanish'},
      {value: 'he', name: 'Hebrew'}, {value: 'mi', name: 'Maori'}, {value: 'nb', name: 'Norwegian'}, {value: 'nl', name: 'Dutch'}, {value: 'sv', name: 'Swedish'}, {value: 'it', name: 'Italian'},
      {value: 'hu', name: 'Hungarian'}, {value: 'ro', name: 'Romanian'}, {value: 'pt', name: 'Portuguese'},
    ],
  }],
}];
exports.commandHandler = async function(interaction) {
  await interaction.defer();

  const phrase = interaction.options.get('phrase').value;
  const binary = phrase.match(/[10\s]+/gmi);
  const morse = phrase.match(/[.\-\/\s]+/gmi);

  let finish = false;
  if (binary?.length === 1 || morse?.length === 1) {
    if (binary[0] === phrase && (!interaction.options.get('source') || !interaction.options.get('target'))) {
      interaction.editReply({content: `**Binary**\n${phrase}\n**Ascii**\n${decodeBinary(phrase)}`});
      finish = true;
    } else if (morse[0] === phrase && (!interaction.options.get('source') || !interaction.options.get('target'))) {
      interaction.editReply({content: `**Morse**\n${phrase}\n**Ascii**\n${decodeMorse(phrase)}`});
      finish = true;
    }
  }

  if (!finish) {
    const sourceLanguage = interaction.options.get('source') ? interaction.options.get('source').value : 'auto';
    const targetLanguage = interaction.options.get('target') ? interaction.options.get('target').value : 'en';

    const data = await (await fetch(process.env.ANDLIN_TRANSLATE_API, {
      method: 'POST',
      headers: {'Authorization': process.env.ANDLIN_TOKEN},
      body: JSON.stringify({'source': sourceLanguage, 'target': targetLanguage, 'text': escapeHtml(phrase, false)}),
    })).json();

    if (data.Message) {
      client.users.fetch(process.env.DEV_ID).then((devLog) => {
        devLog.send({content: `**Translator:** ${data.Message}\n**Sent:** \`\`\`{"source": ${sourceLanguage}, "target": ${targetLanguage}, "text": ${escapeHtml(phrase, false)}}\`\`\``});
      });
      client.users.fetch(process.env.ANDLIN_ID).then((andlinLog) => {
        andlinLog.send({content: `**Translator:** ${data.Message}\n**Sent:** \`\`\`{"source": ${sourceLanguage}, "target": ${targetLanguage}, "text": ${escapeHtml(phrase, false)}}\`\`\``});
      });
    } else if (data.length > 0) {
      if (data[0].translations) {
        if (data[0].translations.length > 0) {
          sourceLanguageName = getLang((data[0].detectedLanguage ? data[0].detectedLanguage.language : sourceLanguage));
          targetLanguageName = getLang((data[0].translations[0].to ? data[0].translations[0].to: targetLanguage));
          splitMessage(interaction, `**${sourceLanguageName}**${(data[0].detectedLanguage ? ` - Language confidence: ${parseFloat(data[0].detectedLanguage.score)*100}%` : ``)}\n${phrase}\n**${targetLanguageName}**\n${escapeHtml(data[0].translations[0].text, true)}`);
        }
      }
    }
  }

  /**
   * Gets lanuage from language code
   * @param {string} code of language.
   * @return {string} name of language.
   */
  function getLang(code) {
    const language = languageCodes.find((lang) => lang.code === code);
    return language.name;
  };

  /**
   * Converts binary to ascii.
   * @param {string} str morse.
   * @return {string} ascii.
   */
  function decodeBinary(str) {
    const splitBin = str.split(' ');
    const text = [];
    for (i = 0; i < splitBin.length; i++) text.push(String.fromCharCode(parseInt(splitBin[i], 2)));
    return text.join('');
  };

  /**
   * Converts morse to ascii.
   * @param {string} str morse.
   * @return {string} ascii.
   */
  function decodeMorse(str) {
    const morseRef = {
      '.-': 'a', '-...': 'b', '-.-.': 'c', '-..': 'd', '.': 'e', '..-.': 'f', '--.': 'g', '....': 'h', '..': 'i', '.---': 'j', '-.-': 'k', '.-..': 'l', '--': 'm', '-.': 'n', '---': 'o', '.--.': 'p', '--.-': 'q', '.-.': 'r', '...': 's', '-': 't', '..-': 'u', '...-': 'v', '.--': 'w', '-..-': 'x', '-.--': 'y', '--..': 'z',
      '.----': '1', '..---': '2', '...--': '3', '....-': '4', '.....': '5', '-....': '6', '--...': '7', '---..': '8', '----.': '9', '-----': '0',
      '/': ' ', '-.-.--': '!', '.-.-.-': '.', '--..--': ',', '.----.': '\'',
    };
    return str.split('   ').map((a) => a.split(' ').map((b) => morseRef[b]).join('')).join(' ');
  };
};
