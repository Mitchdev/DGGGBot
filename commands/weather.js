exports.commands = {'weather': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'weather',
  description: 'Gets current weather from a location',
  options: [{
    name: 'unit',
    type: 'STRING',
    description: 'Unit of measurement',
    required: true,
    choices: [{
      name: 'Metric',
      value: 'metric',
    }, {
      name: 'Standard',
      value: 'standard',
    }, {
      name: 'Imperial',
      value: 'imperial',
    }],
  }, {
    name: 'location',
    type: 'STRING',
    description: 'Location to get weather from',
    required: true,
  }],
}];
exports.commandHandler = function(interaction) {
  interaction.defer();

  const units = interaction.options.get('unit').value;
  const location = interaction.options.get('location').value;
  if (location != '') {
    request({
      method: 'POST',
      url: process.env.ANDLIN_ADDRESS_API,
      headers: {'Authorization': process.env.ANDLIN_TOKEN},
      json: {'Address': location},
    }, (coordinatesErr, coordinatesReq, coordinatesRes) => {
      if (!coordinatesErr) {
        if (coordinatesRes.Message) {
          if (coordinatesRes.Message.startsWith('404 Not Found:')) interaction.editReply(`Could not find ${location}`);
          else {
            client.users.fetch(process.env.DEV_ID).then((devLog) => {
              devLog.send(`**Coordinates:** ${coordinatesRes.Message}\n**Sent:** \`\`\`{"Address": ${location}}\`\`\``);
            });
            client.users.fetch(process.env.ANDLIN_ID).then((andlinLog) => {
              andlinLog.send(`**Coordinates:** ${coordinatesRes.Message}\n**Sent:** \`\`\`{"Address": ${location}}\`\`\``);
            });
          }
        } else {
          request(process.env.WEATHER_API.replace('|lat|', coordinatesRes.lat).replace('|lon|', coordinatesRes.lon).replace('|units|', units), (err, req, res) => {
            if (!err) {
              const data = JSON.parse(res);
              let sunText = '';
              let moonText = '';
              let rainText = '';
              let snowText = '';
              let windText = '';
              let alertsText = '';

              const sunrise = data.daily[0].sunrise - data.current.dt;
              const sunset = data.daily[0].sunset - data.current.dt;
              if (sunrise <= 5 && sunrise >= -5) sunText = `\n☀️ Sun is rising now`;
              else if (sunset <= 5 && sunset >= -5) sunText = `\n☀️ Sun is setting now`;
              else if (sunrise >= 0) sunText = `\n☀️ Sun is rising in ${secondsToDhms(sunrise)}`;
              else if (sunset >= 0) sunText = `\n☀️ Sun is setting in ${secondsToDhms(sunset)}`;
              else sunText = `\n☀️ Sunset ${secondsToDhms(Math.abs(sunset))}ago`;

              if (data.daily[0].moon_phase > 0 && data.daily[0].moon_phase < 0.25) moonText = `\n🌒 Waxing crescent moon`;
              if (data.daily[0].moon_phase > 0.25 && data.daily[0].moon_phase < 0.5) moonText = `\n🌔 Waxing gibous moon`;
              if (data.daily[0].moon_phase > 0.5 && data.daily[0].moon_phase < 0.75) moonText = `\n🌖 Waning gibous moon`;
              if (data.daily[0].moon_phase > 0.75 && data.daily[0].moon_phase < 1) moonText = `\n🌘 Waning crescent moon`;
              if (data.daily[0].moon_phase == 0 || data.daily[0].moon_phase == 1) moonText = `\n🌑 New moon`;
              if (data.daily[0].moon_phase == 0.25) moonText = `\n🌓 First quarter moon`;
              if (data.daily[0].moon_phase == 0.5) moonText = `\n🌕 Full moon`;
              if (data.daily[0].moon_phase == 0.75) moonText = `\n🌗 Last quarter moon`;

              const moonrise = data.daily[0].moonrise - data.current.dt;
              const moonset = data.daily[0].moonset - data.current.dt;
              if (moonrise <= 5 && moonrise >= -5) moonText += ` is rising now`;
              else if (moonset <= 5 && moonset >= -5) moonText += ` is setting now`;
              else if (moonrise >= 0) moonText += ` is rising in ${secondsToDhms(moonrise)}`;
              else if (moonset >= 0) moonText += ` is setting in ${secondsToDhms(moonset)}`;
              else moonText += ` set ${secondsToDhms(Math.abs(moonset))}ago`;

              if (data.hourly[0].rain) rainText = `\n🌧️ ${data.hourly[0].rain['1h']}mm of rain`;
              if (data.hourly[0].snow) snowText = `\n🌨️ ${data.hourly[0].snow['1h']}mm of snow`;

              windText = `\n💨 ${(units === 'imperial') ? data.hourly[0].wind_speed+'mi/h' : (units === 'standard') ? data.hourly[0].wind_speed+'m/s' : (data.hourly[0].wind_speed*3.6).toFixed(2)+'km/h'} ${(units === 'standard') ? data.hourly[0].wind_deg+'°' : getCardinalDirection(data.hourly[0].wind_deg)}`;
              if (data.hourly[0].wind_gust) windText += ` and ${(units === 'imperial') ? data.hourly[0].wind_gust+'mi/h' : (units === 'standard') ? data.hourly[0].wind_speed+'m/s' : (data.hourly[0].wind_gust*3.6).toFixed(2)+'km/h'} gusts`;

              if (data.alerts) {
                if (data.alerts.length > 0) {
                  alertsText = `${data.alerts.map((alert) => {
                    let alertTime = '';
                    const alertStart = alert.start - data.current.dt;
                    const alertEnd = alert.end - data.current.dt;
                    const alertDuration = alert.end - alert.start;

                    if (alertStart > 5) alertTime = `starts in ${secondsToDhms(alertStart)}and lasts for ${secondsToDhms(alertDuration)}`;
                    else if (alertEnd > 5) alertTime = `started ${secondsToDhms(Math.abs(alertStart))}ago and ends in ${secondsToDhms(alertEnd)}`;
                    else alertTime = `ended ${secondsToDhms(Math.abs(alertEnd))}ago and lasted ${secondsToDhms(alertDuration)}`;

                    return `**⚠️ ${capitalize(alert.event)}** ${alertTime}\n${alert.description}`;
                  }).join('\n')}\n\n`;
                }
              }

              const content = `${coordinatesRes.manicipality}, ${coordinatesRes.countryCode} has ${data.hourly[0].weather[0].description} (Location confidence: ${(coordinatesRes.score < 0) ? '0' : coordinatesRes.score}%)\n\n`+
                              `${alertsText}`+
                              `**---- This Hour ----**\n`+
                              `**Currently** ${data.hourly[0].temp}${units === 'imperial' ? '°F' : (units === 'standard') ? 'K' : '°C'}\n`+
                              `**Feels like** ${data.hourly[0].feels_like}${units === 'imperial' ? '°F' : (units === 'standard') ? 'K' : '°C'}\n`+
                              `**Rain probability** ${data.hourly[0].pop*100}%\n`+
                              `${rainText}${snowText}`+
                              `\n☁️ ${data.hourly[0].clouds}% cloud cover`+
                              `${windText}${sunText}${moonText}\n\n`+
                              `**High** ${data.daily[0].temp.max}${units === 'imperial' ? '°F' : (units === 'standard') ? 'K' : '°C'}\n`+
                              `**Low** ${data.daily[0].temp.min}${units === 'imperial' ? '°F' : (units === 'standard') ? 'K' : '°C'}\n`+
                              `**Dew point** ${data.hourly[0].dew_point}${units === 'imperial' ? '°F' : (units === 'standard') ? 'K' : '°C'}\n`+
                              `**Humidity** ${data.hourly[0].humidity}%\n`+
                              `**Pressure** ${data.hourly[0].pressure}hPa\n`+
                              `**UV** ${data.hourly[0].uvi}\n`+
                              `**Visibility** ${units === 'imperial' ? (data.hourly[0].visibility/1609).toFixed(2)+'mi' : (units === 'standard') ? data.hourly[0].visibility+'m' : (data.hourly[0].visibility/1000).toFixed(2)+'km'}\n`;

              interaction.editReply(content);
            }
          });
        }
      }
    });
  }

  /**
   * Takes coordinate degree and converts it to a direction
   * @param {number} deg coordinate degree.
   * @return {string} direction.
   */
  function getCardinalDirection(deg) {
    if ((deg > 348.75 && deg <= 360) || (deg < 11.25 && deg >= 0)) return `N`;
    if (deg > 11.25 && deg < 33.75) return `NNE`;
    if (deg > 33.75 && deg < 56.25) return `NE`;
    if (deg > 56.25 && deg < 78.75) return `ENE`;
    if (deg > 78.75 && deg < 101.25) return `E`;
    if (deg > 101.25 && deg < 123.75) return `ESE`;
    if (deg > 123.75 && deg < 146.25) return `SE`;
    if (deg > 146.25 && deg < 168.75) return `SSE`;
    if (deg > 168.75 && deg < 191.25) return `S`;
    if (deg > 191.25 && deg < 213.75) return `SSW`;
    if (deg > 213.75 && deg < 236.25) return `SW`;
    if (deg > 236.25 && deg < 258.75) return `WSW`;
    if (deg > 258.75 && deg < 281.25) return `W`;
    if (deg > 281.25 && deg < 303.75) return `WNW`;
    if (deg > 303.75 && deg < 326.25) return `NW`;
    if (deg > 326.25 && deg < 348.75) return `NNW`;
  }
};
