exports.name = ['time'];
exports.permission = 'none';
exports.slash = [{
  name: 'time',
  description: 'Gets the local time of a location',
  options: [{
    name: 'location',
    type: 'STRING',
    description: 'Location to get time from',
    required: true,
  }],
}];
exports.handler = function(interaction) {
  request({
    method: 'POST',
    url: options.api.coordinates.url,
    headers: {'Authorization': options.api.coordinates.auth},
    json: {'Address': interaction.options[0].value},
  }, (coordinatesErr, coordinatesReq, coordinatesRes) => {
    if (!coordinatesErr) {
      if (coordinatesRes.Message) {
        if (coordinatesRes.Message.startsWith('404 Not Found:')) {
          interaction.editReply(`Could not find ${interaction.options[0].value}`);
        } else {
          client.users.fetch(options.user.mitch).then((mitch) => {
            mitch.send(`**Coordinates:** ${coordinatesRes.Message}\n**Sent:** \`\`\`{"Address": ${interaction.options[0].value}}\`\`\``);
          });
          client.users.fetch(options.user.andlin).then((andlin) => {
            andlin.send(`**Coordinates:** ${coordinatesRes.Message}\n**Sent:** \`\`\`{"Address": ${interaction.options[0].value}}\`\`\``);
          });
        }
      } else {
        request(options.api.time.url + options.api.time.auth + '&location='+coordinatesRes.lat+','+coordinatesRes.lon, function(err, req, res) {
          if (!err) {
            const time = JSON.parse(res);
            const hours = (new Date(time.datetime).getHours() < 10) ? '0' + new Date(time.datetime).getHours() : new Date(time.datetime).getHours();
            const minutes = (new Date(time.datetime).getMinutes() < 10) ? '0' + new Date(time.datetime).getMinutes() : new Date(time.datetime).getMinutes();
            if (isNaN(hours) || isNaN(minutes)) interaction.editReply(`Could not find ${interaction.options[0].value}`);
            else {
              const content = `${coordinatesRes.manicipality}, ${coordinatesRes.countryCode} (Location confidence: ${(coordinatesRes.score < 0) ? '0' : coordinatesRes.score}%)\n`+
                              `**${time.timezone_name} | ${time.timezone_location} | (${time.timezone_abbreviation}) | (GMT${time.gmt_offset >= 0 ? `+`: ``}${time.gmt_offset})**\n`+
                              `${hours}:${minutes}`;
              interaction.editReply(content);
            }
          }
        });
      }
    }
  });
};
