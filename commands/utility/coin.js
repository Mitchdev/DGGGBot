exports.commands = {'coinflip': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'coinflip',
  description: 'Coin flip',
}];
exports.commandHandler = async function(interaction, Discord) {
  await interaction.deferReply();

  const embed = new Discord.MessageEmbed().setTitle('Heads or Tails').setDescription(Math.floor(Math.random() * 2) === 1 ? 'Heads' : 'Tails');

  interaction.editReply({embeds: [embed]});
};
