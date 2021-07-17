exports.commands = {'flag': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'flag',
  description: 'Gets the flag of a country',
  options: [{
    name: 'country',
    type: 'STRING',
    description: 'Country of the flag you want',
    required: true,
  }],
}];
exports.commandHandler = async function(interaction, Discord) {
  const country = countries.find((c) => {
    if (c.name.toLowerCase() === req.toLowerCase()) return true;
    if (c.alpha2Code === req.toUpperCase()) return true;
    if (c.alpha3Code === req.toUpperCase()) return true;
    if (c.altSpellings.find((alt) => alt.toLowerCase() === req.toLowerCase())) return true;
    if (c.nativeName.toLowerCase() === req.toLowerCase()) return true;
    return false;
  });
  if (country) {
    await interaction.defer();
    const response = await fetch(country.flag);
    const buffer = await response.buffer();
    const pngFlag = await sharp(buffer).png().toBuffer();
    const color = await colorThief.getColorFromURL(pngFlag);
    interaction.editReply({files: [{attachment: pngFlag, name: 'flag.png'}], embeds: [new Discord.MessageEmbed().setTitle(`Flag of ${country.name}`).setImage('attachment://flag.png').setColor(color)]});
  } else {
    await interaction.defer({ephemeral: true});
    interaction.editReply({content: `Could not find country ${interaction.options.get('country').value}`});
  }
};
