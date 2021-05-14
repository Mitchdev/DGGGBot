exports.name = ['currency']
exports.permission = 'none'
exports.slash = [{
    name: 'currency',
    description: 'Converts ammount from one currency to another',
    options: [{
        name: 'ammount',
        type: 'STRING',
        description: 'Ammount in source currency',
        required: true
    }, {
        name: 'source',
        type: 'STRING',
        description: 'Source currency',
        required: true
    }, {
        name: 'target',
        type: 'STRING',
        description: 'Target currency',
        required: true
    }]
}]
exports.handler = function(message) {
	var args = /([+-]?[0-9]*[.]?[0-9]+)\s(\w\w\w)\s(\w\w\w)/g.exec(message.content.toUpperCase());
	if (args) {
		request(options.api.currency.url + options.api.currency.auth, function(err, req, res) {
			if (!err) {
				var rates = JSON.parse(res).rates;
				if (rates[args[2]] && rates[args[3]]) {
					var USD = parseFloat(args[1]) / rates[args[2]];
					var REQ = USD * rates[args[3]];
                    var content = `${args[1]} ${args[2]} = ${REQ.toFixed(2)} ${args[3]}`;
                    if (message.interaction) {
                        message.interaction.editReply(content);
                    } else {
                        message.channel.send(content);
                    }
				}
			}
		});
	}
}