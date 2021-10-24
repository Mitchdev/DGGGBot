exports.commands = {'dice': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'dice',
  description: 'Rolls dice',
  options: [{
    name: 'dice',
    description: 'Number of dice to roll',
    type: 'INTEGER',
    required: true,
  }, {
    name: 'sides',
    description: 'How many sides on the dice',
    type: 'INTEGER',
    required: true,
  }],
}];
exports.commandHandler = async function(interaction, Discord) {
  const dice = interaction.options.get('dice').value;
  const sides = interaction.options.get('sides').value;

  if (dice > 10000 || dice < 1 || sides > 1000000 || sides < 1) {
    await interaction.deferReply({ephemeral: true});

    interaction.editReply({content: `Maximum of 10000 dice, Minimum of 1 dice.\nMaximum of 1,000,000 sides, Minimum of 1 sides.`});
  } else {
    await interaction.deferReply();

    const rolled = Array.from({length: dice}, () => Math.floor(Math.random() * (sides-1))+1);
    const embed = new Discord.MessageEmbed().setTitle(`Rolling ${dice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} dice of ${sides.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} sides`);
    embed.setDescription(rolled.reduce((a, b) => a+b).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));

    interaction.editReply({embeds: [embed]});
  }
};
