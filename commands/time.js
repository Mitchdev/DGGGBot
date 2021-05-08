exports.name = ['time']
exports.permission = 'none'
exports.slash = {
    name: 'time',
    description: 'Gets the local time of a location',
    options: [{
        name: 'location',
        type: 'STRING',
        description: 'Location to get time from',
        required: true
    }]
}
exports.handler = function(message) {
	var location = message.content.replace('!time ', '');
	if (location != '') {
		request(options.api.time.url + options.api.time.auth + '&location='+location, function(err,req, res) {
			if (!err) {
				var time = JSON.parse(res);
				var hours = (new Date(time.datetime).getHours() < 10) ? '0' + new Date(time.datetime).getHours() : new Date(time.datetime).getHours();
				var minutes = (new Date(time.datetime).getMinutes() < 10) ? '0' + new Date(time.datetime).getMinutes() : new Date(time.datetime).getMinutes();
				if (isNaN(hours) || isNaN(minutes)) {
                    var content = `Could not find ${location}`;
                    if (message.interaction) {
                        message.interaction.editReply(content);
                    } else {
                        message.channel.send(content);
                    }
				} else {
                    var content = `**${location}${time.timezone_name ? ` | ${time.timezone_name}` : ''}${time.timezone_location ? ` | ${time.timezone_location}`:''}${time.timezone_abbreviation ? ` | (${time.timezone_abbreviation})` : ''}${time.gmt_offset ? ` | (GMT${time.gmt_offset >= 0 ? `+${time.gmt_offset}`: time.gmt_offset})` : ''}**\n${hours}:${minutes}`;
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