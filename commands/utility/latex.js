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

  const {error, imageUrl} = await (await fetch(process.env.LATEX_TO_PNG_API, {
    method: 'POST',
    body: JSON.stringify({
      'latexInput': `\\begin{align*}\n${interaction.options.get('latex').value}\n\\end{align*}\n`,
      'outputFormat': 'PNG',
      'outputScale': '200%',
    }),
  })).json();

  if (error || !imageUrl) {
    interaction.editReply({content: `Could not convert ${interaction.options.get('latex').value}`});
  } else {
    const embed = new Discord.MessageEmbed().setTitle('Latex to PNG').setDescription(`\`${interaction.options.get('latex').value}\``).setImage(imageUrl);
    interaction.editReply({embeds: [embed]});
  }
};
