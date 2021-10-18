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
exports.commandHandler = async function(interaction, Discord) {
  await interaction.deferReply();

  const time = await (await fetch(process.env.TIME_API.replace('|location|', interaction.options.get('location').value))).json();

  if (Object.keys(time).length > 0) {
    const embed = new Discord.MessageEmbed();
    embed.setTitle(`The time in ${time.requested_location} is **${(new Date(time.datetime).getHours() < 10) ? '0' + new Date(time.datetime).getHours() : new Date(time.datetime).getHours()}:${(new Date(time.datetime).getMinutes() < 10) ? '0' + new Date(time.datetime).getMinutes() : new Date(time.datetime).getMinutes()}**`);
    embed.addFields([{
      name: 'Abbreviation',
      value: time.timezone_abbreviation,
      inline: true,
    }, {
      name: 'GMT',
      value: (time.gmt_offset >= 0 ? '+' : '') + time.gmt_offset,
      inline: true,
    }, {
      name: 'Daylight Savings',
      value: capitalize(time.is_dst?.toString()),
      inline: true,
    }, {
      name: 'Name',
      value: time.timezone_name,
      inline: true,
    }, {
      name: 'Location',
      value: time.timezone_location,
      inline: true,
    }]);

    interaction.editReply({embeds: [embed]});
  } else {
    interaction.editReply({content: `Could not get the time for ${interaction.options.get('location').value}`});
  }
};
