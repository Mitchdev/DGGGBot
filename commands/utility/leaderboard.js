exports.commands = {'leaderboard': 'none'};
exports.buttons = {'leaderboard': 'none'};
exports.slashes = [{
  name: 'leaderboard',
  description: 'Shows leaderboard for a game',
  options: [{
    name: 'game',
    type: 'STRING',
    description: 'Game of the leaderboard',
    required: true,
    choices: [{
      name: 'Trivia',
      value: 'Trivia',
    }],
  }, {
    name: 'user',
    type: 'USER',
    description: 'User of the leaderboard',
    required: false,
  }],
}];
exports.commandHandler = async function(interaction, Discord) {
  await interaction.defer();

  request({
    method: 'GET',
    url: process.env.ANDLIN_LEADERBOARD_API.replace('|game|', interaction.options.get('game').value),
    headers: {'Authorization': process.env.ANDLIN_TOKEN},
  }, (err, req, res) => {
    if (!err) {
      const data = JSON.parse(JSON.parse(res));
      triviaLeaderboard = data;
      if (interaction.options.get('user')) {
        const userData = data.find((p) => p.UserName === interaction.options.get('user').user.username);
        const userIndex = data.findIndex((p) => p.UserName === interaction.options.get('user').user.username);
        if (userData) {
          const embed = new Discord.MessageEmbed().setTitle(`${interaction.options.get('game').value} leaderboard for #${userIndex+1} ${interaction.options.get('user').user.username}, who has played ${userData.NumOfGuesses.toString()} games.`);
          embed.addFields([{
            name: 'Score per Game',
            value: userData.ScorePerGuess.toString(),
            inline: true,
          }, {
            name: 'Average Time',
            value: userData.AverageTime.toString(),
            inline: true,
          }, {
            name: 'Best Category',
            value: (userData.BestCategory != null) ? triviaOptions.categories[userData.BestCategory.toString()] : 'None',
            inline: true,
          }, {
            name: 'Total Score',
            value: userData.TotalScore.toString(),
            inline: true,
          }, {
            name: 'Total Time',
            value: userData.TotalTime.toString(),
            inline: true,
          }, {
            name: 'Worst Category',
            value: (userData.WorstCategory != null) ? triviaOptions.categories[userData.WorstCategory.toString()] : 'None',
            inline: true,
          }]);
          interaction.editReply({embeds: [embed]});
        } else {
          interaction.editReply(`Could not find ${interaction.options.get('user').user.username} in the ${interaction.options.get('game').value} leaderboard.`);
        }
      } else {
        const buttons = new Discord.MessageActionRow();
        buttons.addComponents(new Discord.MessageButton({custom_id: `leaderboard|prev|-1`, label: 'prev', style: 'SECONDARY', disabled: true}));
        buttons.addComponents(new Discord.MessageButton({custom_id: `leaderboard|current|0`, label: '1', style: 'SECONDARY', disabled: true}));
        buttons.addComponents(new Discord.MessageButton({custom_id: `leaderboard|next|1`, label: 'next', style: 'SECONDARY', disabled: false}));
        const embed = new Discord.MessageEmbed().setTitle(`${interaction.options.get('game').value} leaderboard`).setDescription(`Do \`/leaderboard ${interaction.options.get('game').value} (user)\` to see more details.`);
        embed.addFields([{
          name: 'Username',
          value: data.slice(0, 10).map((p, i) => `${(i % 2 === 1) ? '**' : ''}#${i+1} ${p.UserName}${(i % 2 === 1) ? '**' : ''}`).join('\n'),
          inline: true,
        }, {
          name: 'Score per Game',
          value: data.slice(0, 10).map((p, i) => `${(i % 2 === 1) ? '**' : ''}${p.ScorePerGuess.toString()}${(i % 2 === 1) ? '**' : ''}`).join('\n'),
          inline: true,
        }, {
          name: 'Average Time',
          value: data.slice(0, 10).map((p, i) => `${(i % 2 === 1) ? '**' : ''}${p.AverageTime.toString()}${(i % 2 === 1) ? '**' : ''}`).join('\n'),
          inline: true,
        }]);
        embed.setFooter(`Page (1/${Math.ceil(data.length/10)})`);
        interaction.editReply({embeds: [embed], components: [buttons]});
      }
    } else {
      console.log(err);
    }
  });
};
exports.buttonHandler = function(interaction, Discord) {
  if (triviaLeaderboard.length > 0) {
    const page = parseInt(interaction.customId.split('|')[2]);
    const buttons = new Discord.MessageActionRow();
    buttons.addComponents(new Discord.MessageButton({custom_id: `leaderboard|prev|${page-1}`, label: 'prev', style: 'SECONDARY', disabled: (page-1 < 0)}));
    buttons.addComponents(new Discord.MessageButton({custom_id: `leaderboard|current|${page}`, label: page+1, style: 'SECONDARY', disabled: true}));
    buttons.addComponents(new Discord.MessageButton({custom_id: `leaderboard|next|${page+1}`, label: 'next', style: 'SECONDARY', disabled: (page+1 >= Math.ceil(triviaLeaderboard.length/10))}));
    const embed = new Discord.MessageEmbed().setTitle(`Trivia leaderboard`).setDescription(`Do \`/leaderboard Trivia (user)\` to see more details.`);
    embed.addFields([{
      name: 'Username',
      value: triviaLeaderboard.slice(0+(page*10), 10+(page*10)).map((p, i) => `${(i % 2 === 1) ? '**' : ''}#${(page*10)+i+1} ${p.UserName}${(i % 2 === 1) ? '**' : ''}`).join('\n'),
      inline: true,
    }, {
      name: 'Score per Game',
      value: triviaLeaderboard.slice(0+(page*10), 10+(page*10)).map((p, i) => `${(i % 2 === 1) ? '**' : ''}${p.ScorePerGuess.toString()}${(i % 2 === 1) ? '**' : ''}`).join('\n'),
      inline: true,
    }, {
      name: 'Average Time',
      value: triviaLeaderboard.slice(0+(page*10), 10+(page*10)).map((p, i) => `${(i % 2 === 1) ? '**' : ''}${p.AverageTime.toString()}${(i % 2 === 1) ? '**' : ''}`).join('\n'),
      inline: true,
    }]);
    embed.setFooter(`Page (${page+1}/${Math.ceil(triviaLeaderboard.length/10)})`);
    interaction.update({embeds: [embed], components: [buttons]});
  }
};
