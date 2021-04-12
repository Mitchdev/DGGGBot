module.exports = function(client) {
	client.on('emojiCreate', (emoji) => {
		emotesUse.newStarted = new Date();
		for (const emote in emotesUse.emotes) {
			emotesUse.emotes[emote].newUses = 0;
		}
		updateEmoteUse();
	});
}