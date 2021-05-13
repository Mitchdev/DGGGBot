module.exports = function(client) {
	updateFeed = function() {
		fs.writeFileSync('./options/feeds.json', JSON.stringify(feeds));
	}
}