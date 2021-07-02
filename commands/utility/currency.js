exports.commands = {'currency': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'currency',
  description: 'Converts amount from one currency to another',
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
exports.commandHandler = async function(interaction, Discord) {
  await interaction.defer();
  const embed = new Discord.MessageEmbed().setTitle('Currency Conversion');

  request(process.env.CURRENCY_API, function(err, req, res) {
    if (!err) {
      const rates = JSON.parse(res).rates;
      const source = interaction.options.get('source').value.toUpperCase();
      const target = interaction.options.get('target').value.toUpperCase();
      if (rates[source] && rates[target]) {
        const USD = parseFloat(interaction.options.get('amount').value) / rates[source];
        const REQ = USD * rates[target];

        embed.addFields([{
          name: source,
          value: interaction.options.get('amount').value,
          inline: true,
        }, {name: '\u200B', value: '**=**', inline: true}, {
          name: target,
          value: REQ.toFixed(2),
          inline: true,
        }]);

        interaction.editReply({embeds: [embed]});
      } else {
        let content = ``;
        if (!rates[source] && !rates[target]) content = `Could not find ${interaction.options.get('source').value} or ${interaction.options.get('target').value}`;
        else if (!rates[source]) content = `Could not find ${interaction.options.get('source').value}`;
        else content = `Could not find ${interaction.options.get('target').value}`;
        interaction.editReply({content: content});
      }
    }
  });
};
