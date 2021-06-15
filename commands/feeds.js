exports.commands = {'feeds': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'feeds',
  description: 'Lists all the feeds',
}];
exports.commandHandler = function(interaction) {
  interaction.defer();

  interaction.editReply({content: `**Feeds**\n${feeds.list.map((item) => {
    return `${client.channels.cache.find((c) => c.id === item.channel)} every ${item.interval} seconds`;
  }).join('\n')}`});
};
