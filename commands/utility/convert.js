exports.commands = {'convert': 'none', 'convertlist': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'convert',
  description: 'Converts amount from one unit to another',
  options: [{
    name: 'amount',
    type: 'STRING',
    description: 'Amount in source unit',
    required: true,
  }, {
    name: 'source',
    type: 'STRING',
    description: 'Source unit',
    required: true,
  }, {
    name: 'target',
    type: 'STRING',
    description: 'Target unit',
    required: true,
  }],
}, {
  name: 'convertlist',
  description: 'List all measurement or units of measurement',
  options: [{
    name: 'measurement',
    type: 'STRING',
    description: 'Lists all units for the measurement',
    required: false,
  }],
}];
exports.commandHandler = async function(interaction, Discord) {
  if (interaction.commandName === 'convertlist') {
    await interaction.defer({ephemeral: true});
    if (!interaction.options.get('measurement')) {
      interaction.editReply({content: `**Conversion Measurement List**\n${measurements.map((measurement) => measurement.name).join('\n')}`});
    } else {
      const measurement = measurements.find((m) => m.name.toLowerCase() === interaction.options.get('measurement').value.toLowerCase());
      let content = `Could not find measurement`;
      if (measurement) {
        content = `**${measurement.name} Units List**\n${measurement.data.map((unit) => {
          return `${unit.full} (${unit.short})`;
        }).join('\n')}`;
      }
      interaction.editReply({content: content});
    }
  } else {
    await interaction.defer();
    const embed = new Discord.MessageEmbed();
    let complete = false;
    for (let i = 0; i < measurements.length; i++) {
      let value = parseFloat(interaction.options.get('amount').value);
      const source = measurements[i].data.find((unit) => {
        if (unit.full.toLowerCase() === interaction.options.get('source').value.toLowerCase() || unit.short.toLowerCase() === interaction.options.get('source').value.toLowerCase()) return true;
        else if (unit.multi) {
          if (unit.multi?.toLowerCase() === interaction.options.get('source').value.toLowerCase()) return true;
        }
      });
      const target = measurements[i].data.find((unit) => {
        if (unit.full.toLowerCase() === interaction.options.get('target').value.toLowerCase() || unit.short.toLowerCase() === interaction.options.get('target').value.toLowerCase()) return true;
        else if (unit.multi) {
          if (unit.multi?.toLowerCase() === interaction.options.get('target').value.toLowerCase()) return true;
        }
      });
      if (value) {
        if (source) {
          if (target) {
            if (measurements[i].name === 'Currency') {
              convertCurrency(source, target, value, embed);
              complete = true;
              break;
            } else {
              if (!source.base) value = convertValue(source.conversion.source, source.conversion.value, value);
              if (!target.base) value = convertValue(target.conversion.target, target.conversion.value, value);
              embed.setTitle(`${measurements[i].name} Conversion`);
              embed.addFields([{
                name: `${(value > 1 || value < -1) ? source.multi : source.full} (${source.short})`,
                value: interaction.options.get('amount').value,
                inline: true,
              }, {name: '\u200B', value: '**=**', inline: true}, {
                name: `${(value > 1 || value < -1) ? target.multi : target.full} (${target.short})`,
                value: (Math.round(value * 1000) / 1000).toString(),
                inline: true,
              }]);
              interaction.editReply({embeds: [embed]});
              complete = true;
              break;
            }
          }
        }
      }
    }
    if (!complete) interaction.editReply({content: 'Could not convert'});
  }

  /**
   * Converts currency
   * @param {object} source of conversion.
   * @param {object} target of conversion.
   * @param {number} value original value.
   * @param {Embed} embed message embed.
   */
  async function convertCurrency(source, target, value, embed) {
    const {rates} = await (await fetch(process.env.CURRENCY_API)).json();
    if (rates[source.short] && rates[target.short]) {
      const USD = value / rates[source.short];
      const REQ = USD * rates[target.short];
      embed.addFields([{
        name: `${source.full} (${source.short})`,
        value: source.symbol+interaction.options.get('amount').value,
        inline: true,
      }, {name: '\u200B', value: '**=**', inline: true}, {
        name: `${target.full} (${target.short})`,
        value: target.symbol+REQ.toFixed(2),
        inline: true,
      }]);
      interaction.editReply({embeds: [embed]});
    } else {
      let content = ``;
      if (!rates[source.short] && !rates[target.short]) content = `Could not find ${interaction.options.get('source').value} or ${interaction.options.get('target').value}`;
      else if (!rates[source.short]) content = `Could not find ${interaction.options.get('source').value}`;
      else content = `Could not find ${interaction.options.get('target').value}`;
      interaction.editReply({content: content});
    }
  }

  /**
   * Converts value by type and conversionValue
   * @param {string} type of conversion.
   * @param {number} conversionValue Conversion value.
   * @param {number} value Original value.
   * @return {number} New value.
   */
  function convertValue(type, conversionValue, value) {
    switch (type) {
      case 'divide':
        return value / conversionValue;
      case 'multiply':
        return value * conversionValue;
      case 'plus':
        return value + conversionValue;
      case 'minus':
        return value - conversionValue;
      case 't180d200':
        return value * 180 / 200;
      case 't200d180':
        return value * 200 / 180;
      case 't1000pid180':
        return value * 1000 * Math.PI / 180;
      case 't180d1000pi':
        return value * 180 / 1000 * Math.PI;
      case 'tpid180':
        return value * Math.PI / 180;
      case 't180dpi':
        return value * 180 / Math.PI;
      case 'pt9d5pp32':
        return (value * 9/5) + 32;
      case 'pmi32pt5d9':
        return (value - 32) * 5/9;
      case 'd2pi':
        return value / (2 * Math.PI);
      case 't2pi':
        return value * (2 * Math.PI);
    }
  }
};
