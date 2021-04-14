exports.name = ['currency']
exports.permission = 'none'
exports.handler = function(message) {
	var args = /(\d+)\s(\w\w\w)\s(\w\w\w)/g.exec(message.content.toUpperCase());
	if (args) {
		request(options.api.currency.url + options.api.currency.auth, function(err, req, res) {
			if (!err) {
				var rates = JSON.parse(res).rates;
				if (rates[args[2]] && rates[args[3]]) {
					var USD = parseFloat(args[1]) / rates[args[2]];
					var REQ = USD * rates[args[3]];

					message.channel.send(`${Math.round(parseFloat(args[1]) * 100) / 100} ${args[2]} = ${Math.round(parseFloat(REQ) * 100) / 100} ${args[3]}`);
				}
			}
		});
	}
}