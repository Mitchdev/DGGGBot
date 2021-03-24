module.exports = function(client) {
	updateEmoteUse = function() {
		fs.writeFileSync('./options/emotes.json', JSON.stringify(emotesUse));
	}
}