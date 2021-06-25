exports.commands = {'time': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'time',
  description: 'Gets the local time of a location',
  options: [{
    name: 'location',
    type: 'STRING',
    description: 'Location to get time from',
    required: true,
  }],
}];
exports.commandHandler = function(interaction) {
  interaction.defer();

  request({
    method: 'POST',
    url: process.env.ANDLIN_ADDRESS_API,
    headers: {'Authorization': process.env.ANDLIN_TOKEN},
    json: {'Address': interaction.options.get('location').value},
  }, (coordinatesErr, coordinatesReq, coordinatesRes) => {
    if (!coordinatesErr) {
      if (coordinatesRes.Message) {
        if (coordinatesRes.Message.startsWith('404 Not Found:')) {
          interaction.editReply({content: `Could not find ${interaction.options.get('location').value}`});
        } else {
          client.users.fetch(process.env.DEV_ID).then((devLog) => {
            devLog.send({content: `**Coordinates:** ${coordinatesRes.Message}\n**Sent:** \`\`\`{"Address": ${interaction.options.get('location').value}}\`\`\``});
          });
          client.users.fetch(process.env.ANDLIN_ID).then((andlinLog) => {
            andlinLog.send({content: `**Coordinates:** ${coordinatesRes.Message}\n**Sent:** \`\`\`{"Address": ${interaction.options.get('location').value}}\`\`\``});
          });
        }
      } else {
        request(process.env.TIME_API.replace('|lat|', coordinatesRes.lat).replace('|lon|', coordinatesRes.lon), function(err, req, res) {
          if (!err) {
            const time = JSON.parse(res);
            const hours = (new Date(time.datetime).getHours() < 10) ? '0' + new Date(time.datetime).getHours() : new Date(time.datetime).getHours();
            const minutes = (new Date(time.datetime).getMinutes() < 10) ? '0' + new Date(time.datetime).getMinutes() : new Date(time.datetime).getMinutes();
            if (isNaN(hours) || isNaN(minutes)) interaction.editReply({content: `Could not find ${interaction.options.get('location').value}`});
            else {
              const content = `${coordinatesRes.manicipality != null ? coordinatesRes.manicipality : interaction.options.get('location').value}, ${coordinatesRes.countryCode} (Location confidence: ${(coordinatesRes.score < 0) ? '0' : coordinatesRes.score}%)\n`+
                              `**${time.timezone_name} | ${time.timezone_location} | (${time.timezone_abbreviation}) | (GMT${time.gmt_offset >= 0 ? `+`: ``}${time.gmt_offset})**\n`+
                              `${hours}:${minutes}`;
              interaction.editReply({content: content});
            }
          }
        });
      }
    }
  });
};
