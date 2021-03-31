module.exports = function(client) {
	client.on('channelPinsUpdate', (channel, time) => {
		if (!options.disabled) {
			channel.messages.fetchPinned().then(messages => {
				if (messages.size == 50) {
					pinMessage(messages.last());
					messages.last().unpin();
				}
			}).catch(console.error);
		}
	});
}