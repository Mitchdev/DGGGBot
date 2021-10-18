exports.commands = {'imdb': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'imdb',
  description: 'Gets the information of a film',
  options: [{
    name: 'search',
    type: 'STRING',
    description: 'Search for film',
    required: true,
  }],
}];
exports.commandHandler = async function(interaction, Discord) {
  await interaction.deferReply();

  const {results, errorMessage} = await (await fetch(process.env.IMDB_SEARCH_API.replace('|search|', encodeURIComponent(interaction.options.get('search').value)))).json();

  if (errorMessage != '') {
    interaction.editReply({content: `Too many requests`});
    return;
  }

  if (results?.length > 0) {
    const data = await (await fetch(process.env.IMDB_INFO_API.replace('|id|', results[0].id))).json();
    const dataAlt = await (await fetch(process.env.IMDB_INFO_ALT_API.replace('|id|', results[0].id))).json();
    const dataAltRT = dataAlt.Ratings.find((r) => r.Source === 'Rotten Tomatoes')?.Value;
    const dataAltMC = dataAlt.Ratings.find((r) => r.Source === 'Metacritic')?.Value;
    if (data.errorMessage === '') {
      const embed = new Discord.MessageEmbed().setTitle(`${data.title} (${data.year})`).setURL(`https://www.imdb.com/title/${data.id}/`).addFields([{
        name: 'Plot',
        value: dataAlt.Plot != 'N/A' ? dataAlt.Plot : data.plot != '' ? data.plot : 'Unknown',
        inline: false,
      }, {
        name: 'IMDb Rating',
        value: data.ratings.imDb != '' ? `${data.ratings.imDb} / 10` : dataAlt.imdbRating != 'N/A' ? `${dataAlt.imdbRating} / 10` : 'Unknown',
        inline: true,
      }, {
        name: 'Rotten Tomatoes',
        value: data.ratings.rottenTomatoes != '' ? `${data.ratings.rottenTomatoes} / 100` : dataAltRT ? dataAltRT.replace('%', ' / 100') : 'Unknown',
        inline: true,
      }, {
        name: 'Metacritic',
        value: data.ratings.metacritic != '' ? `${data.ratings.metacritic} / 100` : dataAltMC ? dataAltMC.replace('/', ' / ') : 'Unknown',
        inline: true,
      }, {
        name: 'Release Date',
        value: dataAlt.Released != 'N/A' ? dataAlt.Released : data.releaseDate != '' ? data.releaseDate : 'Unknown',
        inline: true,
      }, {
        name: 'Director',
        value: dataAlt.Director != 'N/A' ? dataAlt.Director : data.directors != '' ? data.directorList[0].name : 'Unknown',
        inline: true,
      }, {
        name: 'Rating',
        value: dataAlt.Rated != 'N/A' ? dataAlt.Rated : data.contentRating != '' ? data.contentRating : 'Unknown',
        inline: true,
      }, {
        name: 'Duration',
        value: dataAlt.Runtime != 'N/A' ? dataAlt.Runtime : data.runtimeStr != '' ? data.runtimeStr : 'Unknown',
        inline: true,
      }, {
        name: 'Budget (USD)',
        value: data.boxOffice.budget != '' ? data.boxOffice.budget.replace(' (estimated)', '') : 'Unknown',
        inline: true,
      }, {
        name: 'Box Office Gross (USD)',
        value: data.boxOffice.cumulativeWorldwideGross != '' ? data.boxOffice.cumulativeWorldwideGross : 'Unknown',
        inline: true,
      }]);

      if (data.image != '') {
        embed.setThumbnail(data.image);
        const color = await colorThief.getColorFromURL(data.image);
        embed.setColor(color);
      }

      interaction.editReply({embeds: [embed]});
    } else {
      interaction.editReply({content: `Too many requests`});
    }
  } else {
    interaction.editReply({content: `Could not find ${interaction.options.get('search').value}`});
  }
};
