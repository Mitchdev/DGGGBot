exports.commands = {'coinflip': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'coinflip',
  description: 'Coin flip',
}];
exports.commandHandler = async function(interaction, Discord) {
  await interaction.deferReply();
  interaction.editReply({content: Math.floor(Math.random() * 2) === 1 ? 'Heads' : 'Tails'});
};
