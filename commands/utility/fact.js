exports.commands = {'fact': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'fact',
  description: 'Gets a random fact',
}];
exports.commandHandler = async function(interaction, Discord) {
  await interaction.defer();

  request(process.env.RANDOMFACT_API, function(err, req, res) {
    if (!err) {
      interaction.editReply({content: JSON.parse(res).data});
    }
  });
};
