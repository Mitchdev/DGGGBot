exports.commands = {'8ball': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: '8ball',
  description: 'Get a random Magic 8 Ball answer to a question',
  options: [{
    name: 'question',
    type: 'STRING',
    description: 'Question you want to answer',
    required: true,
  }],
}];
exports.commandHandler = async function(interaction, Discord) {
  await interaction.deferReply();

  const answers = shuffle(options.eightBallAnswers);
  const random = Math.floor(Math.random() * answers.length);
  const embed = new Discord.MessageEmbed().setTitle('Magic 8 Ball').addFields([{
    name: 'Question',
    value: interaction.options.get('question').value,
  }, {
    name: 'Answer',
    value: answers[random],
  }]);

  interaction.editReply({embeds: [embed]});
};
