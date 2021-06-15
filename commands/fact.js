exports.commands = {'fact': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'fact',
  description: 'Gets a random fact',
}];
exports.commandHandler = function(interaction, Discord) {
  interaction.defer();

  request(process.env.RANDOMFACT_API, function(err, req, res) {
    if (!err) {
      interaction.editReply({content: JSON.parse(res).data});
    }
  });
};
