exports.name = ['feeds', 'feedlist']
exports.permission = 'none'
exports.slash = [{
    name: 'feeds',
    description: 'Lists all the feeds'
}, {
    name: 'feedlist',
    description: 'Lists all the subs in the feed'
}]
exports.handler = function(interaction) {
	if (interaction.commandName === 'feeds') {
		interaction.editReply(`**Feeds**\n${feeds.list.map(item => {
			return `${client.channels.cache.find(c => c.id === item.channel)} every ${item.interval} seconds`;
		}).join('\n')}`);
	} else {
		var feedIndex = feeds.list.findIndex(feed => feed.channel == interaction.channelID);
		if (feedIndex >= 0) interaction.editReply(`**Subs in the feed**\n${feeds.list[feedIndex].subs.join('\n')}`);
		else interaction.editReply(`No feed in this channel`);
	}
}