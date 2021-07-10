exports.commands = {'0mar': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: '0mar',
  description: '0MAR LMAO',
}];
exports.commandHandler = async function(interaction, Discord) {
  await interaction.defer();

  if (Math.floor(Math.random() * 1000000) === 1) {
    interaction.editReply({content: `0m3r ${options.emote.strong.string}`});
  } else {
    const number = generateNumber();
    interaction.editReply({content: `0m${number === 3 ? number + generateNumber() : number}r`});
  }

  /**
   * Recursive function that returns a string of numbers.
   * @return {number} returns a string of random numbers.
   */
  function generateNumber() {
    if (Math.floor(Math.random() * 3) === 1) return Math.floor(Math.random() * 10).toString() + generateNumber().toString();
    return Math.floor(Math.random() * 10);
  }
};
