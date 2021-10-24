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
  const rolled = [];
  let sum = 0;

  if (dice > 100 || dice < 1) {
    await interaction.deferReply({ephemeral: true});
    interaction.editReply({content: 'Maximum of 100 dice, Minimum of 1 dice'});
  } else if (sides > 1000 || sides < 1) {
    await interaction.deferReply({ephemeral: true});
    interaction.editReply({content: 'Maximum of 1000 sides, Minimum of 1 sides'});
  } else {
    await interaction.deferReply();

    for (let i = 0; i < dice; i++) {
      const roll = Math.round(Math.random() * (sides-1))+1;
      rolled.push(roll);
      sum += roll;
    }

    const embed = new Discord.MessageEmbed().setTitle(`Rolling ${dice} dice of ${sides} sides`);

    embed.addFields([{
      name: 'Result',
      value: sum.toString(),
    }]);

    if (dice > 1) {
      embed.addFields([{
        name: 'Dice',
        value: rolled.join(', '),
      }]);
    }

    interaction.editReply({embeds: [embed]});
  }
};
