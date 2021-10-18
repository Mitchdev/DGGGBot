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
  await interaction.deferReply();

  const phrase = interaction.options.get('phrase').value.toLowerCase();
  const {list} = await (await fetch(process.env.URBAN_API.replace('|phrase|', phrase))).json();
  const embed = new Discord.MessageEmbed();
  if (list?.length > 0) {
    embed.setTitle(list[0].word).setURL(list[0].permalink).addField('Definition', list[0].definition.replace(/\[(.+?)\]/gmi, (i) => {
      return `${i}(http://${i.replace(/\[|\]|\'|\"/gmi, '').replace(/\s/gmi, '-')}.urbanup.com)`;
    }));
    if (list[0].example) {
      embed.addField('Example', list[0].example.replace(/\[(.+?)\]/gmi, (i) => {
        return `${i}(http://${i.replace(/\[|\]|\'|\"/gmi, '').replace(/\s/gmi, '-')}.urbanup.com)`;
      }));
    }
    interaction.editReply({embeds: [embed]});
  } else interaction.editReply({content: `Couldn\'t find anything for **${phrase}**.`});
};
