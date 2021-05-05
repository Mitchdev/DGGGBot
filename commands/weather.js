exports.name = ['weather']
exports.permission = 'none'
exports.handler = function(message) {
	var location = message.content.replace('!weather ', '');
	if (location != '') {
		request(options.api.weather.url + location + '&appid=' + options.api.weather.auth, function(err,req,res) {
			if (!err) {
				var data = JSON.parse(res);
				if (data.cod == 200) {
					var sunText = "";
					var snowText = "";
					var rainText = "";
					var cloudText = "";
					var windText = "";
					var tempText = "";

					var sunrise = data.sys.sunrise - data.dt;
					var sunset = data.sys.sunset - data.dt;
					if (sunrise <= 5 && sunrise >= -5) sunText = `\n☀️ Sun is rising now`;
					else if (sunset <= 5 && sunset >= -5) sunText = `\n☀️ Sun is setting now`;
					else if (sunrise >= 0) sunText = `\n☀️ Sun is rising in ${secondsToDhms(sunrise)}`;
					else if (sunset >= 0) sunText = `\n☀️ Sun is setting in ${secondsToDhms(sunset)}`;
					else sunText = `\n☀️ Sunset ${secondsToDhms(Math.abs(sunset))}ago`;

					if (data.rain) rainText = `\n🌧️ ${data.rain["1h"]}mm of rain in the last hour`;
					if (data.snow) snowText = `\n🌨️ ${data.snow["1h"]}mm of snow in the last hour`;
					if (data.clouds) cloudText = `\n☁️ ${data.clouds.all}% Cloud cover`;

					if (data.wind) {
						windText = `\n💨 ${(data.wind.speed*3.6).toFixed(2)}km/h ${getCardinalDirection(data.wind.deg)}`;
						if (data.wind.gust) windText += ` with ${(data.wind.gust*3.6).toFixed(2)}km/h gusts`;
					}

					if (data.main) {
						tempText = `\n**Currently** ${data.main.temp}°C`;
						if (data.main.feels_like) tempText += `\n**Feels like** ${data.main.feels_like}°C`;
						if (data.main.temp_max) tempText += `\n**High** ${data.main.temp_max}°C`;
						if (data.main.temp_min) tempText += `\n**Low** ${data.main.temp_min}°C`;
						if (data.main.humidity) {
							//Ts = (b(ln(RH/100) + aT/(b+T))) / (a - (ln(RH/100) + aT/(b+T)))
							var Ts = (243.12*(Math.log(data.main.humidity/100) + 17.62*data.main.temp/(243.12+data.main.temp))) / (17.62 - (Math.log(data.main.humidity/100) + 17.62*data.main.temp/(243.12+data.main.temp)));
							tempText += `\n**Dew point** ${Ts.toFixed(2)}°C`;
							tempText += `\n**Humidity** ${data.main.humidity}%`;
						}
						if (data.main.pressure) tempText += `\n**Pressure** ${data.main.pressure}hPa`;
					}

					message.channel.send(`${data.name}, ${data.sys.country} Has ${data.weather[0].description}\n${tempText}\n${sunText}${rainText}${snowText}${cloudText}${windText}`);
				} else if (data.cod == 404) message.channel.send(`Could not find ${location}`);
			}
		});
	}

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
}