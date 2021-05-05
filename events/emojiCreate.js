module.exports = function(client) {
	client.on('emojiCreate', (emoji) => {
		fs.writeFileSync('./options/emotesBackup.json', JSON.stringify(emotesUse));
		emotesUse.newStarted = new Date();
		for (const emote in emotesUse.emotes) {
			emotesUse.emotes[emote].newUses = 0;
		}
		updateEmoteUse();
	});
}