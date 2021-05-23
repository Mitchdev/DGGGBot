exports.name = ['convertlist']
exports.permission = 'none'
exports.slash = [{
    name: 'convertlist',
    description: 'Lists all the measurements',
    options: [{
        name: 'measurement',
        type: 'STRING',
        description: 'Lists all units for the measurement',
        required: false
    }]
}]
exports.handler = function(interaction) {
	if (interaction.options.length == 0) {
		interaction.editReply(`**Conversion Measurement List**\n${measurements.map(measurement => measurement.name).join('\n')}`);
	} else {
		var measurement = measurements.find(m => m.name.toLowerCase() === interaction.options[0].value.toLowerCase());
		var content = `Could not find measurement`;
		if (measurement) {
			content = `**${measurement.name} Units List**\n${measurement.data.map(unit => {
				return `${unit.full} (${unit.short})`;
			}).join('\n')}`
		}
		interaction.editReply(content);
	}
}