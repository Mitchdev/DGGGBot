exports.commands = {'define': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'define',
  description: 'Gets definition of a phrase via urban dictionary',
  options: [{
    name: 'phrase',
    type: 'STRING',
    description: 'Phrase to be defined',
    required: true,
  }],
}];
exports.commandHandler = function(interaction) {
  interaction.defer();

  const phrase = interaction.options.get('phrase').value.toLowerCase();
  if (phrase == 'mitch') {
    const content = `**mitch**\nThe best moderator.`;
    interaction.editReply({content: content});
  } else {
    request(process.env.URBAN_API.replace('|phrase|', phrase), function(err, res) {
      if (!err && res) {
        const data = JSON.parse(res.body).list;
        if (data.length > 0) {
          if (data[0].example) splitMessage(interaction, `**${phrase}**\n${data[0].definition}\n\n${data[0].example}`);
          else splitMessage(interaction, `**${phrase}**\n${data[0].definition}`);
        } else interaction.editReply({content: `Couldn\'t find anything for **${phrase}**.`});
      }
    });
  }
};
