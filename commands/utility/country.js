exports.commands = {'country': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'country',
  description: 'Gets stats of a country',
  options: [{
    name: 'country',
    type: 'STRING',
    description: 'Country of stats',
    required: true,
  }],
}];
exports.commandHandler = async function(interaction, Discord) {
  const req = interaction.options.get('country').value;
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
    const embed = new Discord.MessageEmbed().setTitle(country.name);

    const landPeople = `Demonym **${country.demonym}**\n` +
                        `Population **${country.population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}**\n` +
                        `Capital **${country.capital}**\n` +
                        `Region **${country.region}**\n` +
                        `Subregion **${country.subregion}**\n` +
                        (country.regionalBlocs.length > 0 ? `Regional Blocs **${country.regionalBlocs.map((reb) => reb.name).join(', ')}**\n` : '') +
                        `Area **${country.area.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}km²**\n` +
                        (country.borders.length > 0 ? `Borders **${country.borders.join(', ')}**` : '');

    const naming = `Native Name **${country.nativeName}**\n` +
                    `Alt Spellings **${country.altSpellings.join(', ')}**\n` +
                    `Codes **${country.numericCode}, ${country.alpha2Code}, ${country.alpha3Code}**\n`;

    const other = `Domains **${country.topLevelDomain.join(', ')}**\n` +
                  `Phones **${country.callingCodes.map((pn) => `+${pn}`).join(', ')}**\n` +
                  `Currencies **${country.currencies.map((cur) => cur.code).join(', ')}**\n` +
                  `Languages **${country.languages.map((lan) => lan.name).join(', ')}**`;

    embed.addFields([{
      name: 'Land & People',
      value: landPeople,
    }, {
      name: 'Naming',
      value: naming,
    }, {
      name: 'Other',
      value: other,
    }]);

    const response = await fetch(country.flag);
    const buffer = await response.buffer();
    const pngFlag = await sharp(buffer).png().toBuffer();
    const color = await colorThief.getColorFromURL(pngFlag);

    interaction.editReply({files: [{attachment: pngFlag, name: 'flag.png'}], embeds: [embed.setThumbnail('attachment://flag.png').setColor(color)]});
  } else {
    await interaction.defer({ephemeral: true});
    interaction.editReply({content: `Could not find country ${interaction.options.get('country').value}`});
  }
};
