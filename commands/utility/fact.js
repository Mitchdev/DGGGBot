exports.commands = {'fact': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'fact',
  description: 'Gets a random fact',
}];
exports.commandHandler = async function(interaction, Discord) {
  await interaction.defer();
  const {data} = await (await fetch(process.env.RANDOMFACT_API)).json();
  interaction.editReply({content: data});
};
