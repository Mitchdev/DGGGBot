exports.commands = {'0mar': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: '0mar',
  description: '0MAR LMAO',
}];
exports.commandHandler = function(interaction, Discord) {
  interaction.defer();
  interaction.editReply({content: `0m${generateNumber()}r`});

  /**
   * Recursive function that returns a string of numbers.
   * @return {number} returns a string of random numbers.
   */
  function generateNumber() {
    if (Math.floor(Math.random() * 3) === 1) return Math.floor(Math.random() * 10).toString() + generateNumber().toString();
    return Math.floor(Math.random() * 10);
  }
};
