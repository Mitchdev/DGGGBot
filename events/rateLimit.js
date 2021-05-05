module.exports = function(client) {
	client.on('rateLimit', (rateLimitInfo) => {
		console.log(rateLimitInfo);
	});
}