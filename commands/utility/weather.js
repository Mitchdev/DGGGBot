exports.commands = {'weather': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'weather',
  description: 'Gets current weather from a location',
  options: [{
    name: 'location',
    type: 'STRING',
    description: 'Location to get weather from',
    required: true,
  }, {
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
  }],
}];
exports.commandHandler = async function(interaction, Discord) {
  await interaction.defer();

  const weather = new Discord.MessageEmbed();
  const alerts = new Discord.MessageEmbed().setTitle('Alerts').setColor('RED');
  const embeds = [];

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
          if (coordinatesRes.Message.startsWith('404 Not Found:')) interaction.editReply({content: `Could not find ${location}`});
          else {
            client.users.fetch(process.env.DEV_ID).then((devLog) => {
              devLog.send({content: `**Coordinates:** ${coordinatesRes.Message}\n**Sent:** \`\`\`{"Address": ${location}}\`\`\``});
            });
            client.users.fetch(process.env.ANDLIN_ID).then((andlinLog) => {
              andlinLog.send({content: `**Coordinates:** ${coordinatesRes.Message}\n**Sent:** \`\`\`{"Address": ${location}}\`\`\``});
            });
          }
        } else {
          request(process.env.WEATHER_API.replace('|lat|', coordinatesRes.lat).replace('|lon|', coordinatesRes.lon).replace('|units|', units), (err, req, res) => {
            if (!err) {
              const data = JSON.parse(res);
              const localTime = new Date((data.current.dt+data.timezone_offset)*1000);

              const setRiseMargin = 900; // seconds
              let sunText = '';
              let moonText = '';
              let rainText = '';
              let snowText = '';
              let windText = '';
              let gustText = '';

              const sunrise = data.daily[0].sunrise - data.current.dt;
              const sunset = data.daily[0].sunset - data.current.dt;
              if (sunrise <= setRiseMargin && sunrise >= -setRiseMargin) sunText = `Sun **rising now**`;
              else if (sunset <= setRiseMargin && sunset >= -setRiseMargin) sunText = `Sun position **setting now**`;
              else if (sunrise >= 0) sunText = `Sun position **rising in ${secondsToDhms(sunrise)}**`;
              else if (sunset >= 0) sunText = `Sun position **setting in ${secondsToDhms(sunset)}**`;
              else sunText = `Sun position **set ${secondsToDhms(Math.abs(sunset))}ago**`;

              const moonrise = data.daily[0].moonrise - data.current.dt;
              const moonset = data.daily[0].moonset - data.current.dt;

              if (moonrise <= setRiseMargin && moonrise >= -setRiseMargin) moonText += `Moon position **rising now**`;
              else if (moonset <= setRiseMargin && moonset >= -setRiseMargin) moonText += `Moon position **setting now**`;
              else if (moonrise >= 0) moonText += `Moon position **rising in ${secondsToDhms(moonrise)}**`;
              else if (moonset >= 0) moonText += `Moon position **setting in ${secondsToDhms(moonset)}**`;
              else moonText += `Moon position **set ${secondsToDhms(Math.abs(moonset))}ago**`;

              if (data.daily[0].moon_phase > 0 && data.daily[0].moon_phase < 0.25) moonText += `\nMoon phase **Waxing crescent moon** 🌒`;
              if (data.daily[0].moon_phase > 0.25 && data.daily[0].moon_phase < 0.5) moonText += `\nMoon phase **Waxing gibous moon** 🌔`;
              if (data.daily[0].moon_phase > 0.5 && data.daily[0].moon_phase < 0.75) moonText += `\nMoon phase **Waning gibous moon** 🌖`;
              if (data.daily[0].moon_phase > 0.75 && data.daily[0].moon_phase < 1) moonText += `\nMoon phase **Waning crescent moon**🌘`;
              if (data.daily[0].moon_phase == 0 || data.daily[0].moon_phase == 1) moonText += `\nMoon phase **New moon**🌑`;
              if (data.daily[0].moon_phase == 0.25) moonText += `\nMoon phase **First quarter moon**🌓`;
              if (data.daily[0].moon_phase == 0.5) moonText += `\nMoon phase **Full moon**🌕`;
              if (data.daily[0].moon_phase == 0.75) moonText += `\nMoon phase **Last quarter moon**🌗`;

              const notSunSet = ((sunset > setRiseMargin || sunset < -setRiseMargin) && (sunrise > setRiseMargin || sunrise < -setRiseMargin));
              const sunBothPos = ((sunrise > setRiseMargin && sunset > setRiseMargin) && sunrise < sunset);
              const sunBothNeg = ((sunrise < -setRiseMargin && sunset < -setRiseMargin) && sunset < sunrise);
              const sunRisePosSetNeg = ((sunrise > setRiseMargin && sunset < -setRiseMargin));
              const sunRiseNegSetPos = !((sunrise < -setRiseMargin && sunset > setRiseMargin));

              const moonBothPos = ((moonrise > setRiseMargin && moonset > setRiseMargin) && moonrise < moonset);
              const moonBothNeg = ((moonrise < -setRiseMargin && moonset < -setRiseMargin) && moonset < moonrise);
              const moonRisePosSetNeg = ((moonrise > setRiseMargin && moonset < -setRiseMargin));
              const moonRiseNegSetPos = !((moonrise < -setRiseMargin && moonset > setRiseMargin));

              let hour = localTime.getHours();
              if (hour > 12) hour = 12 - (hour - 12);
              const daylightTime = Math.abs(data.daily[0].sunset - data.daily[0].sunrise);
              const nightlightTime = Math.abs(86400 - daylightTime);
              const hourOffset = ((daylightTime/3600)/12)*hour;

              // console.log(sunrise, sunset, sunBothPos, sunBothNeg, sunRisePosSetNeg, sunRiseNegSetPos);
              // console.log(moonrise, moonset, moonBothPos, moonBothNeg, moonRisePosSetNeg, moonRiseNegSetPos);

              if (notSunSet && (sunBothPos || sunBothNeg || sunRisePosSetNeg || sunRiseNegSetPos)) {
                if (moonBothPos || moonBothNeg || moonRisePosSetNeg || moonRiseNegSetPos) {
                  const colorCloud = parseInt(((80/100)*data.hourly[0].clouds));
                  // console.log('Night no moon', [colorCloud, colorCloud, colorCloud]);
                  weather.setColor([colorCloud, colorCloud, colorCloud]);
                } else {
                  // ADD MOON PHASE
                  // HIGHER = MORE LIGHT
                  const colorMoonCloud = parseInt(((85/100)*data.hourly[0].clouds)+80);
                  // console.log('Night with moon', [colorMoonCloud, colorMoonCloud, colorMoonCloud]);
                  weather.setColor([colorMoonCloud, colorMoonCloud, colorMoonCloud]);
                }
              } else {
                if ((sunrise <= setRiseMargin && sunrise >= -setRiseMargin) || (sunset <= setRiseMargin && sunset >= -setRiseMargin)) {
                  // ADD RAIN
                  // MORE RAIN = MORE PINK/PURPLE
                  const colorCloud = parseInt(80-((80/100)*data.hourly[0].clouds)); // 80-0
                  const color = parseInt((((110/12)*hourOffset)+50)+(colorCloud/1.5)); // 110-160
                  // console.log('Sun set/rise', [255, color, colorCloud], hourOffset);
                  weather.setColor([255, color, colorCloud]);
                } else {
                  const colorCloud = parseInt((255/100)*data.hourly[0].clouds); // 0-255
                  const color = parseInt(((185/12)*hourOffset)+70+(colorCloud/3.3)); // 131-285(255)
                  // console.log('Sun', [colorCloud, color > 255 ? 255 : color, 255], hourOffset);
                  weather.setColor([colorCloud, color > 255 ? 255 : color, 255]);
                }
              }

              if (data.hourly[0].rain) rainText = `\nRain this hour **${data.hourly[0].rain['1h']}mm**`;
              if (data.hourly[0].snow) snowText = `\nSnow this hour **${data.hourly[0].snow['1h']}mm**`;

              windText = `Wind **${(units === 'imperial') ? data.hourly[0].wind_speed+'mi/h' : (units === 'standard') ? data.hourly[0].wind_speed+'m/s' : (data.hourly[0].wind_speed*3.6).toFixed(2)+'km/h'} ${(units === 'standard') ? data.hourly[0].wind_deg+'°' : getCardinalDirection(data.hourly[0].wind_deg)}**`;
              if (data.hourly[0].wind_gust) gustText += `\nGusts **${(units === 'imperial') ? data.hourly[0].wind_gust+'mi/h' : (units === 'standard') ? data.hourly[0].wind_speed+'m/s' : (data.hourly[0].wind_gust*3.6).toFixed(2)+'km/h'}**`;

              weather.setThumbnail(`http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`);
              weather.setTitle(`${coordinatesRes.manicipality != null ? coordinatesRes.manicipality : location}, ${coordinatesRes.countryCode} (Location confidence: ${(coordinatesRes.score < 0) ? '0' : coordinatesRes.score}%)`);
              weather.setDescription(`Current condition **${data.hourly[0].weather[0].description}** at **${localTime.getHours() < 10 ? `0${localTime.getHours()}`: localTime.getHours()}:${localTime.getMinutes() < 10 ? `0${localTime.getMinutes()}`: localTime.getMinutes()}**`);
              weather.addFields([{
                name: 'Temperature',
                value: `Current **${data.hourly[0].temp}${units === 'imperial' ? '°F' : (units === 'standard') ? 'K' : '°C'}**`+
                `\nFeels like **${data.hourly[0].feels_like}${units === 'imperial' ? '°F' : (units === 'standard') ? 'K' : '°C'}**`+
                `\nHigh **${data.daily[0].temp.max}${units === 'imperial' ? '°F' : (units === 'standard') ? 'K' : '°C'}**`+
                `\nLow **${data.daily[0].temp.min}${units === 'imperial' ? '°F' : (units === 'standard') ? 'K' : '°C'}**`+
                `\nDew point **${data.hourly[0].dew_point}${units === 'imperial' ? '°F' : (units === 'standard') ? 'K' : '°C'}**`+
                `\nHumidity **${data.hourly[0].humidity}%**`,
                inline: true,
              }, {name: '\u200B', value: '\u200B', inline: true}, {
                name: 'Wind & Clouds',
                value: `Cloud cover **${data.hourly[0].clouds}%**\n${windText}${gustText}`,
                inline: true,
              }, {
                name: 'Extra',
                value: `Pressure **${data.hourly[0].pressure}hPa**`+
                `\nVisibility **${units === 'imperial' ? (data.hourly[0].visibility/1609).toFixed(2)+'mi' : (units === 'standard') ? data.hourly[0].visibility+'m' : (data.hourly[0].visibility/1000).toFixed(2)+'km'}**`+
                `\nUV **${data.hourly[0].uvi}**`,
                inline: true,
              }, {name: '\u200B', value: '\u200B', inline: true}, {
                name: 'Rain & Snow',
                value: `Rain probability **${Math.round(data.hourly[0].pop*100)}%**${rainText}${snowText}`,
                inline: true,
              }, {
                name: 'Sun & Moon',
                value: `Daylight **${secondsToDhms(daylightTime)}**`+
                `\n${sunText}`+
                `\nNightlight **${secondsToDhms(nightlightTime)}**`+
                `\n${moonText}`,
              }]);
              embeds.push(weather);

              if (data.alerts?.length > 0) {
                alerts.addFields(data.alerts.map((alert) => {
                  let alertTime = '';
                  const alertStart = alert.start - data.current.dt;
                  const alertEnd = alert.end - data.current.dt;
                  const alertDuration = alert.end - alert.start;

                  if (alertStart > 5) alertTime = `Starts in ${secondsToDhms(alertStart)}and lasts for ${secondsToDhms(alertDuration)}\n`;
                  else if (alertEnd > 5) alertTime = `Started ${secondsToDhms(Math.abs(alertStart))}ago and ends in ${secondsToDhms(alertEnd)}\n`;
                  else alertTime = `Ended ${secondsToDhms(Math.abs(alertEnd))}ago and lasted ${secondsToDhms(alertDuration)}\n`;

                  let description = `${alertTime}\n${alert.description}`;
                  const more = `...\n\nmore via ${alert.sender_name}`;
                  if (description.length > 500) description = description.slice(0, 500-more.length) + more;

                  return {name: `${alert.event}`, value: description};
                }));
                embeds.push(alerts);
              }

              interaction.editReply({embeds: embeds});

              animate(data.current.weather[0].main, weather.color, 0, interaction);
            }
          });
        }
      }
    });
  }

  /**
   * Animates color of embed.
   * @param {string} type type of animation.
   * @param {ColorResolvable} originalColor original color of the embed.
   * @param {int} step animation stepper.
   * @param {interaction} interaction interaction.
   */
  function animate(type, originalColor, step, interaction) {
    if (type === 'Thunderstorm') {
      setTimeout(() => {
        embeds[0].setColor('YELLOW');
        interaction.editReply({embeds: embeds});
        setTimeout(() => {
          embeds[0].setColor(originalColor);
          interaction.editReply({embeds: embeds});
          setTimeout(() => {
            embeds[0].setColor('YELLOW');
            interaction.editReply({embeds: embeds});
            setTimeout(() => {
              embeds[0].setColor(originalColor);
              interaction.editReply({embeds: embeds});
            }, 250);
          }, 100);
        }, 250);
      }, 1500);
    } else if (type === 'Rain') {
      if (step < 10) {
        embeds[0].setColor((step % 2 === 0) ? 'BLUE' : originalColor);
        interaction.editReply({embeds: embeds});
        setTimeout(() => {
          animate(type, originalColor, step+1, interaction);
        }, 250);
      }
    } else if (type === 'Snow') {
      if (step < 10) {
        embeds[0].setColor((step % 2 === 0) ? 'WHITE' : originalColor);
        interaction.editReply({embeds: embeds});
        setTimeout(() => {
          animate(type, originalColor, step+1, interaction);
        }, 250);
      }
    } else if (type === 'Sand') {
      if (step < 10) {
        embeds[0].setColor((step % 2 === 0) ? 'GOLD' : originalColor);
        interaction.editReply({embeds: embeds});
        setTimeout(() => {
          animate(type, originalColor, step+1, interaction);
        }, 250);
      }
    }
  };

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
