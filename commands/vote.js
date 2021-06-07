exports.commands = {'vote': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'vote',
  description: 'Starts a vote for specified duration',
  options: [{
    name: 'duration',
    type: 'STRING',
    description: 'Amount of time vote goes for (eg. 1m)',
    required: true,
  }, {
    name: 'question',
    type: 'STRING',
    description: 'Question you want to ask',
    required: true,
  }, {
    name: '1',
    type: 'STRING',
    description: 'Answer one to question',
    required: true,
  }, {
    name: '2',
    type: 'STRING',
    description: 'Answer two to question',
    required: true,
  }, {
    name: '3',
    type: 'STRING',
    description: 'Answer three to question',
    required: false,
  }, {
    name: '4',
    type: 'STRING',
    description: 'Answer four to question',
    required: false,
  }, {
    name: '5',
    type: 'STRING',
    description: 'Answer five to question',
    required: false,
  }, {
    name: '6',
    type: 'STRING',
    description: 'Answer six to question',
    required: false,
  }, {
    name: '7',
    type: 'STRING',
    description: 'Answer seven to question',
    required: false,
  }, {
    name: '8',
    type: 'STRING',
    description: 'Answer eight to question',
    required: false,
  }, {
    name: '9',
    type: 'STRING',
    description: 'Answer nine to question',
    required: false,
  }],
}];
exports.commandHandler = function(interaction) {
  interaction.defer();

  const question = interaction.options.get('question').value;
  const time = timeToSeconds(interaction.options.get('duration').value);
  const answers = interaction.options.filter((option) => (option.name != 'duration' && option.name != 'question')).map((option) => option.value);

  if (time != null && time > 0) {
    interaction.editReply(`**Vote** started for ${interaction.options.get('duration').value}\n${question}\n`+answers.map((a, i) => {
      return `${options.voteReactions[i]} ${a}`;
    }).join('\n')).then((vote) => {
      currentVoteID = vote.id;
      for (let i = 0; i < answers.length; i++) {
        vote.react(options.voteReactions[i]);
        voteValidReactions.push(options.voteReactions[i]);
        if (i == answers.length-1) {

        }
      }
      setTimeout(function() {
        const results = [];
        let i = 0;
        vote.reactions.cache.each((reaction) => {
          if (voteValidReactions.includes(reaction._emoji.name)) {
            results.push([answers[i], reaction.count-1]);
            i++;
          }
        });
        results.sort((a, b) => b[1]-a[1]);
        currentVoteID = null;
        voteValidReactions = [];
        vote.reply('**Vote Results**\n'+question+'\n'+results.map((a, i) => {
          return a[0]+' - **'+a[1]+'**';
        }).join('\n'));
      }, (time+answers.length) * 1000);
    });
  }
};
