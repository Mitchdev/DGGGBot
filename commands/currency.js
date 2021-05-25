exports.name = ['currency'];
exports.permission = 'none';
exports.slash = [{
  name: 'currency',
  description: 'Converts ammount from one currency to another',
  options: [{
    name: 'amount',
    type: 'STRING',
    description: 'Amount in source currency',
    required: true,
  }, {
    name: 'source',
    type: 'STRING',
    description: 'Source currency',
    required: true,
  }, {
    name: 'target',
    type: 'STRING',
    description: 'Target currency',
    required: true,
  }],
}];
exports.handler = function(interaction) {
  request(options.api.currency.url + options.api.currency.auth, function(err, req, res) {
    if (!err) {
      const rates = JSON.parse(res).rates;
      const source = interaction.options[1].value.toUpperCase();
      const target = interaction.options[2].value.toUpperCase();
      if (rates[source] && rates[target]) {
        const USD = parseFloat(interaction.options[0].value) / rates[source];
        const REQ = USD * rates[target];
        interaction.editReply(`${interaction.options[0].value} ${source} = ${REQ.toFixed(2)} ${target}`);
      } else {
        let content = ``;
        if (!rates[source] && !rates[target]) content = `Could not find ${interaction.options[1].value} or ${interaction.options[2].value}`;
        else if (!rates[source]) content = `Could not find ${interaction.options[1].value}`;
        else content = `Could not find ${interaction.options[2].value}`;
        interaction.editReply(content);
      }
    }
  });
};
