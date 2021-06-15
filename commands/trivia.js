exports.commands = {'trivia': 'none'};
exports.buttons = {'trivia': 'none'};
exports.slashes = [{
  name: 'trivia',
  description: 'Gets a trivia question you can answer',
  options: [{
    name: 'category',
    type: 'STRING',
    description: 'Category of trivia question',
    required: true,
    choices: [{
      name: 'Random',
      value: '0',
    }, {
      name: 'General Knowledge',
      value: '9',
    }, {
      name: 'History',
      value: '23',
    }, {
      name: 'Animals',
      value: '27',
    }, {
      name: 'Geography',
      value: '22',
    }, {
      name: 'Politics',
      value: '24',
    }, {
      name: 'Mythology',
      value: '20',
    }, {
      name: 'Science & Nature',
      value: '17',
    }, {
      name: 'Computers',
      value: '18',
    }, {
      name: 'Mathematics',
      value: '19',
    }, {
      name: 'Books',
      value: '10',
    }, {
      name: 'Film',
      value: '11',
    }, {
      name: 'Music',
      value: '12',
    }, {
      name: 'Musicals & Theatres',
      value: '13',
    }, {
      name: 'Television',
      value: '14',
    }, {
      name: 'Video Games',
      value: '15',
    }, {
      name: 'Board Games',
      value: '16',
    }, {
      name: 'Sports',
      value: '21',
    }, {
      name: 'Art',
      value: '25',
    }, {
      name: 'Celebrities',
      value: '26',
    }, {
      name: 'Vehicles',
      value: '28',
    }, {
      name: 'Entertainment: Comics',
      value: '29',
    }, {
      name: 'Science: Gadgets',
      value: '30',
    }, {
      name: 'Entertainment: Japanese Anime & Manga',
      value: '31',
    }, {
      name: 'Entertainment: Cartoon & Animations',
      value: '32',
    }],
  }, {
    name: 'difficulty',
    type: 'STRING',
    description: 'Difficulty of trivia question',
    required: true,
    choices: [{
      name: 'Easy',
      value: 'easy',
    }, {
      name: 'Medium',
      value: 'medium',
    }, {
      name: 'Hard',
      value: 'hard',
    }],
  }],
}];
exports.commandHandler = function(interaction, Discord) {
  interaction.defer();

  const id = makeID();
  triviaGames[id] = new Trivia(id, interaction, interaction.user, interaction.options.get('category').value, interaction.options.get('difficulty').value);
  triviaGames[id].start();

  /**
   * Trivia constructor.
   * @param {string} id of the game
   * @param {interaction} i game message
   * @param {object} user object
   * @param {string} category of the question
   * @param {string} difficulty of the question
   */
  function Trivia(id, i, user, category, difficulty) {
    this.id = id;
    this.interaction = i;
    this.user = user;
    this.category = category;
    this.difficulty = difficulty;
    this.data = {};
    this.embed = new Discord.MessageEmbed();
    this.answers = new Discord.MessageActionRow();
    this.guessed = [];
    this.answer = '';
    this.answerTime;
    this.postTime = '';
    this.timeleft = 20;
    this.interval;

    this.start = function() {
      this.getTriviaToken((token) => {
        request(process.env.TRIVIA_API.replace('|category|', this.category).replace('|difficulty|', this.difficulty).replace('|token|', token), (err, req, res) => {
          if (!err) {
            const data = JSON.parse(res);
            if (data.response_code === 0) {
              this.data = data.results[0];

              const answersButtons = [];

              for (let i = 0; i < this.data.incorrect_answers.length+1; i++) {
                const answer = (i < this.data.incorrect_answers.length) ? this.data.incorrect_answers[i] : this.data.correct_answer;
                answersButtons.push(new Discord.MessageButton({custom_id: `trivia|${this.id}|${escapeHtml(answer, true)}`, label: escapeHtml(answer, true), style: 'SECONDARY'}));
              }

              this.answers.addComponents(shuffle(answersButtons));

              this.embed.setTitle(`${this.timeleft} seconds left`).setColor('DARK_GREEN').addFields({
                name: 'Category',
                value: this.data.category,
                inline: true,
              }, {
                name: 'Difficulty',
                value: capitalize(this.data.difficulty),
                inline: true,
              }, {
                name: 'Question',
                value: escapeHtml(this.data.question, true),
                inline: false,
              });

              this.update();
              this.postTime = new Date();
              this.interval = setInterval(() => {
                this.timeleft--;

                if (this.timeleft === 16) this.embed.setColor('GREEN');
                if (this.timeleft === 11) this.embed.setColor('YELLOW');
                if (this.timeleft === 7) this.embed.setColor('ORANGE');
                if (this.timeleft === 4) this.embed.setColor('DARK_ORANGE');
                if (this.timeleft === 2) this.embed.setColor('RED');
                if (this.timeleft === 1) this.embed.setColor('DARK_RED');

                this.embed.setTitle(`${this.timeleft} seconds left`);
                this.update();

                if (this.timeleft === 0) this.end();
              }, 1000);
            } else if (data.response_code === 3 || data.response_code === 4) {
              request(process.env.TRIVIA_TOKENRESET_API.replace('|token|', token));
              triviaToken = '';
              this.start();
            } else {
              this.interaction.editReply({content: 'Could not create a trivia question.'});
            }
          }
        });
      });
    };

    this.getTriviaToken = function(callback) {
      if (triviaToken != '') callback(triviaToken);
      else {
        request(process.env.TRIVIA_TOKEN_API, (err, req, res) => {
          if (!err) {
            triviaToken = JSON.parse(res).token;
            callback(triviaToken);
            fs.writeFileSync(dpath.join(__dirname, '../options/triviaToken.json'), JSON.stringify({'token': triviaToken}));
          }
        });
      }
    };

    this.update = function() {
      this.interaction.editReply({embeds: [this.embed], components: [this.answers]});
    };

    this.end = function() {
      clearInterval(this.interval);
      if (this.guessed.length > 0) this.embed.spliceFields(this.embed.fields.length-1, 1);
      if (this.answer === escapeHtml(this.data.correct_answer, true)) {
        this.embed.setColor('GREEN');
        this.embed.setTitle(`${this.user.username} answered ${this.answer} in ${this.answerTime}s`);
      } else {
        this.embed.setColor('RED');
        this.embed.setTitle(`${this.user.username} ${this.answer != '' ? `answered ${this.answer} in ${this.answerTime}s` : `didn't answer`}`);
        for (let i = 0; i < this.answers.components.length; i++) {
          if (this.answers.components[i].label === this.answer) this.answers.components[i].setStyle('DANGER');
        }
      }
      if (this.guessed.length > 0) {
        const correct = this.guessed.filter((g) => g.correct && g.id != this.user.id);
        const incorrect = this.guessed.filter((g) => !g.correct && g.id != this.user.id);
        if (correct.length > 0) {
          this.embed.addFields([{
            name: `Guessed correct`,
            value: correct.map((g) => {
              return `${g.username} guessed in ${g.time}s`;
            }).join('\n'),
            inline: false,
          }]);
        }
        if (incorrect.length > 0) {
          this.embed.addFields([{
            name: `Guessed incorrect`,
            value: incorrect.map((g) => {
              return `${g.username} guessed ${g.answer} in ${g.time}s`;
            }).join('\n'),
            inline: false,
          }]);
        }
      }
      for (let i = 0; i < this.answers.components.length; i++) {
        if (this.answers.components[i].label === escapeHtml(this.data.correct_answer, true)) this.answers.components[i].setStyle('SUCCESS');
        this.answers.components[i].setDisabled(true);
      }
      this.update();
      delete triviaGames[this.id];
    };

    this.guess = function(answer, user, answerTime) {
      if (user.id === this.user.id) {
        this.answer = answer;
        this.answerTime = ((answerTime - this.postTime)/1000).toFixed(3);
      }
      this.guessed.push({'id': user.id, 'username': user.username, 'correct': (answer === escapeHtml(this.data.correct_answer, true)), 'answer': answer, 'time': ((answerTime - this.postTime)/1000).toFixed(3)});
      if (this.guessed.length > 1) this.embed.spliceFields(this.embed.fields.length-1, 1);
      this.embed.addFields([{
        name: `Guessed`,
        value: this.guessed.map((g) => g.username).join('\n'),
        inline: false,
      }]);
      this.update();
    };
  };
};
exports.buttonHandler = function(interaction, Discord) {
  const id = interaction.customID.split('|')[1];
  const answer = interaction.customID.split('|')[2];
  if (triviaGames[id]) {
    const found = triviaGames[id].guessed.find((g) => g.id === interaction.user.id);
    if (!found) {
      interaction.deferUpdate();
      triviaGames[id].guess(answer, interaction.user, new Date());
    } else {
      interaction.defer({ephemeral: true});
      interaction.editReply({content: `Already guessed`, ephemeral: true});
    }
  }
};
