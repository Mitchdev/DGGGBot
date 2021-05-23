exports.name = ['feeds'];
exports.permission = 'none';
exports.slash = [{
  name: 'feeds',
  description: 'Lists all the feeds',
}];
exports.handler = function(interaction) {
  interaction.editReply(`**Feeds**\n${feeds.list.map((item) => {
    return `${client.channels.cache.find((c) => c.id === item.channel)} every ${item.interval} seconds`;
  }).join('\n')}`);
};
