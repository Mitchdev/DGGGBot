exports.name = ['convert']
exports.permission = 'none'
exports.slash = [{
    name: 'convert',
    description: 'Converts amount from one unit to another',
    options: [{
        name: 'amount',
        type: 'STRING',
        description: 'Amount in source unit',
        required: true
    }, {
        name: 'source',
        type: 'STRING',
        description: 'Source unit',
        required: true
    }, {
        name: 'target',
        type: 'STRING',
        description: 'Target unit',
        required: true
    }]
}]
exports.handler = function(interaction) {
	var complete = false;
	for (var i = 0; i < measurements.length; i++) {
		var source = measurements[i].data.find(unit => {return (unit.full.toLowerCase() === interaction.options[1].value.toLowerCase() || unit.short === interaction.options[1].value || unit.multi.toLowerCase() === interaction.options[1].value.toLowerCase())});
		var target = measurements[i].data.find(unit => {return (unit.full.toLowerCase() === interaction.options[2].value.toLowerCase() || unit.short === interaction.options[2].value || unit.multi.toLowerCase() === interaction.options[2].value.toLowerCase())});
		var value = parseFloat(interaction.options[0].value);
		if (value) {
			if (source) {
				if (target) {
					if (!source.base) value = convertValue(source.conversion.source, source.conversion.value, value);
					if (!target.base) value = convertValue(target.conversion.target, target.conversion.value, value);
					interaction.editReply(`**Converting ${measurements[i].name}**\n${parseFloat(interaction.options[0].value)} ${(value > 1 || value < -1) ? source.multi : source.full} (${source.short}) = **${(Math.round(value * 1000) / 1000)}** ${(value > 1 || value < -1) ? target.multi : target.full} (${target.short})`);
					complete = true;
					break;
				}
			}
		}
	}

	if (!complete) interaction.editReply(`Could not convert`);

	function convertValue(type, conversionValue, value) {
		switch(type) {
			case "divide":
				return value / conversionValue;
			case "multiply":
				return value * conversionValue;
			case "plus":
				return value + conversionValue;
			case "minus":
				return value - conversionValue;
			case "t180d200":
				return value * 180 / 200;
			case "t200d180":
				return value * 200 / 180;
			case "t1000pid180":
				return value * 1000 * Math.PI / 180;
			case "t180d1000pi":
				return value * 180 / 1000 * Math.PI;
			case "tpid180":
				return value * Math.PI / 180;
			case "t180dpi":
				return value * 180 / Math.PI;
			case "pt9d5pp32":
				return (value * 9/5) + 32;
			case "pmi32pt5d9":
				return (value - 32) * 5/9;
			case "d2pi":
				return value / (2 * Math.PI);
			case "t2pi":
				return value * (2 * Math.PI);
		}
	}
}