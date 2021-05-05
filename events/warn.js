module.exports = function(client) {
	client.on('warn', (string) => {
		console.log(string);
	});
}