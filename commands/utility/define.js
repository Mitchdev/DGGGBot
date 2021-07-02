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
exports.commandHandler = async function(interaction, Discord) {
  await interaction.defer();

  const phrase = interaction.options.get('phrase').value.toLowerCase();
  request(process.env.URBAN_API.replace('|phrase|', phrase), function(err, res) {
    if (!err && res) {
      const data = JSON.parse(res.body).list;
      const embed = new Discord.MessageEmbed();
      if (data.length > 0) {
        embed.setTitle(data[0].word).setURL(data[0].permalink).addField('Definition', data[0].definition.replace(/\[(.+?)\]/gmi, (i) => {
          return `${i}(http://${i.replace(/\[|\]|\'|\"/gmi, '').replace(/\s/gmi, '-')}.urbanup.com)`;
        }));
        if (data[0].example) {
          embed.addField('Example', data[0].example.replace(/\[(.+?)\]/gmi, (i) => {
            return `${i}(http://${i.replace(/\[|\]|\'|\"/gmi, '').replace(/\s/gmi, '-')}.urbanup.com)`;
          }));
        }
        interaction.editReply({embeds: [embed]});
      } else interaction.editReply({content: `Couldn\'t find anything for **${phrase}**.`});
    }
  });
};
