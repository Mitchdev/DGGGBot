module.exports = function(client) {
	updateMutes = function() {
		fs.writeFileSync('./options/mutes.json', JSON.stringify(mutes));
	}
}