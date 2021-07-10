exports.commands = {'latexpng': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'latexpng',
  description: 'Latex to PNG',
  options: [{
    name: 'latex',
    type: 'STRING',
    description: 'latex',
    required: true,
  }],
}];
exports.commandHandler = async function(interaction, Discord) {
  await interaction.defer();

  request({
    method: 'POST',
    url: process.env.LATEX_TO_PNG_API,
    json: {
      'latexInput': `\\begin{align*}\n${interaction.options.get('latex').value}\n\\end{align*}\n`,
      'outputFormat': 'PNG',
      'outputScale': '200%',
    },
  }, (err, req, res) => {
    if (!err) {
      if (!res.error) {
        const embed = new Discord.MessageEmbed().setTitle('Latex to PNG').setDescription(`\`${interaction.options.get('latex').value}\``).setImage(res.imageUrl);
        interaction.editReply({embeds: [embed]});
      } else console.log('res.error', res.error);
    } else console.log('err', err);
  });
};
