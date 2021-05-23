exports.name = ['currency']
exports.permission = 'none'
exports.slash = [{
    name: 'currency',
    description: 'Converts ammount from one currency to another',
    options: [{
        name: 'amount',
        type: 'STRING',
        description: 'Amount in source currency',
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
exports.handler = function(interaction) {
	request(options.api.currency.url + options.api.currency.auth, function(err, req, res) {
		if (!err) {
			var rates = JSON.parse(res).rates;
			var source = interaction.options[1].value.toUpperCase();
			var target = interaction.options[2].value.toUpperCase();
			if (rates[source] && rates[target]) {
				var USD = parseFloat(interaction.options[0].value) / rates[source];
				var REQ = USD * rates[target];
				var content = `${interaction.options[0].value} ${source} = ${REQ.toFixed(2)} ${target}`;
				interaction.editReply(content);
			} else {
				var content = ``;
				if (!rates[source] && !rates[target]) content = `Could not find ${interaction.options[1].value} or ${interaction.options[2].value}`;
				else if (!rates[source]) content = `Could not find ${interaction.options[1].value}`;
				else content = `Could not find ${interaction.options[2].value}`;
				interaction.editReply(content);
			}
		}
	});
}