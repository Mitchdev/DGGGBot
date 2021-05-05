module.exports = function(client) {
	client.on('error', (string) => {
		console.log(string);
	});
}