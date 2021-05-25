exports.name = ['0mar'];
exports.permission = 'none';
exports.slash = [{
  name: '0mar',
  description: '0MAR LMAO',
}];
exports.handler = function(interaction) {
  interaction.editReply(`0m${generateNumber()}r`);

  /**
   * Recursive function that returns a string of numbers.
   * @return {number} returns a string of random numbers.
   */
  function generateNumber() {
    if (Math.floor(Math.random() * 3) === 1) return Math.floor(Math.random() * 10).toString() + generateNumber().toString();
    return Math.floor(Math.random() * 10);
  }
};
