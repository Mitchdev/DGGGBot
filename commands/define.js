exports.name = ['define'];
exports.permission = 'none';
exports.slash = [{
  name: 'define',
  description: 'Gets definition of a phrase via urban dictionary',
  options: [{
    name: 'phrase',
    type: 'STRING',
    description: 'Phrase to be defined',
    required: true,
  }],
}];
exports.handler = function(interaction) {
    const prase = interaction.options[0].value.toLowerCase();
    if (prase == 'mitch') {
      const content = `**mitch**\nThe best moderator.`;
      interaction.editReply(content);
    } else {
      request('http://api.urbandictionary.com/v0/define?term=' + prase, function(err, res) {
        if (!err && res) {
          const data = JSON.parse(res.body).list;
          if (data.length > 0) {
            if (data[0].example) {
              if ((`**${prase}**\n${data[0].definition}\n\n${data[0].example}`).length >= 2000) interaction.editReply(options.emote.donowall.string);
              else interaction.editReply(`**${prase}**\n${data[0].definition}\n\n${data[0].example}`);
            } else {
              if ((`**${prase}**\n${data[0].definition}`).length >= 2000) interaction.editReply(options.emote.donowall.string);
              else interaction.editReply(`**${prase}**\n${data[0].definition}`);
            }
          } else interaction.editReply(`Couldn\'t find anything for **${prase}**.`);
        }
      });
    }
  }
};
