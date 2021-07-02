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
    choices: [
      {name: 'Random (Affects Leaderboard)', value: '0'}, {name: 'General Knowledge', value: '9'}, {name: 'History', value: '23'}, {name: 'Animals', value: '27'}, {name: 'Geography', value: '22'}, {name: 'Politics', value: '24'},
      {name: 'Mythology', value: '20'}, {name: 'Science & Nature', value: '17'}, {name: 'Computers', value: '18'}, {name: 'Mathematics', value: '19'}, {name: 'Books', value: '10'}, {name: 'Film', value: '11'}, {name: 'Music', value: '12'},
      {name: 'Musicals & Theatres', value: '13'}, {name: 'Television', value: '14'}, {name: 'Video Games', value: '15'}, {name: 'Board Games', value: '16'}, {name: 'Sports', value: '21'}, {name: 'Art', value: '25'}, {name: 'Celebrities', value: '26'},
      {name: 'Vehicles', value: '28'}, {name: 'Comics', value: '29'}, {name: 'Gadgets', value: '30'}, {name: 'Japanese Anime & Manga', value: '31'}, {name: 'Cartoon & Animations', value: '32'},
    ],
  }, {
    name: 'difficulty',
    type: 'STRING',
    description: 'Difficulty of trivia question',
    required: true,
    choices: [{
      name: 'Hard',
      value: 'hard',
    }, {
      name: 'Medium',
      value: 'medium',
    }, {
      name: 'Easy',
      value: 'easy',
    }],
  }],
}];
exports.commandHandler = async function(interaction, Discord) {
  await interaction.defer({ephemeral: true});
  if (interaction.channel.id === process.env.CHANNEL_GENERAL) {
    interaction.editReply({content: `Please use ${client.channels.resolve(process.env.CHANNEL_BOT_GAMES)}`});
  } else {
    const id = makeID();
    const category = interaction.options.get('category').value;
    const isRandom = (category === '0');
    const keys = Object.keys(triviaOptions.categories);
    const game = new Trivia(id, interaction.user, interaction, (isRandom ? keys[Math.floor(Math.random()*keys.length)] : category), interaction.options.get('difficulty').value, isRandom);
    game.loadQuestion((success) => {
      if (!success) return;
      else {
        interaction.editReply({content: 'Added to queue', ephemeral: true});
        if (triviaGame === null) {
          triviaGame = game;
          interaction.channel.send({embeds: [triviaGame.embed]}).then((msg) => {
            triviaGame.message = msg;
            triviaGame.start();
          });
        } else {
          triviaQueue.push(game);
        }
      }
    });
  }

  /**
   * Trivia constructor.
   * @param {string} id of the game
   * @param {object} u object
   * @param {interaction} i game message
   * @param {string} category of the question
   * @param {string} difficulty of the question
   * @param {boolean} isR of the question
   */
  function Trivia(id, u, i, category, difficulty, isR) {
    this.id = id;
    this.interaction = i;
    this.user = u;
    this.message = null;
    this.category = category;
    this.difficulty = difficulty;
    this.isRandom = isR;
    this.isGPT2 = false;
    this.hasEnded = false;
    this.data = {};
    this.embed = new Discord.MessageEmbed();
    this.answers = new Discord.MessageActionRow();
    this.guessed = [];
    this.startTime = '';
    this.timeleft = 20;
    this.interval;

    this.loadQuestion = function(callback) {
      if (this.isRandom && Math.floor(Math.random() * 15) === 1) {
        this.isGPT2 = true;
        this.data = triviaGPT2[Math.floor(Math.random()*triviaGPT2.length)];
        this.load(callback);
      } else {
        this.getTriviaToken((token) => {
          request(process.env.TRIVIA_API.replace('|category|', this.category).replace('|difficulty|', this.difficulty).replace('|token|', token), (err, req, res) => {
            if (!err) {
              const data = JSON.parse(res);
              if (data.response_code === 0) {
                this.data = data.results[0];
                this.load(callback);
              } else if (data.response_code === 3 || data.response_code === 4) {
                request(process.env.TRIVIA_TOKENRESET_API.replace('|token|', token));
                triviaOptions.token = '';
                this.loadQuestion((success) => callback(success));
              } else {
                this.interaction.editReply({content: 'Could not create a trivia question.', ephemeral: true});
                callback(false);
              }
            }
          });
        });
      }
    };

    this.load = function(callback) {
      const answersButtons = [];
      for (let i = 0; i < this.data.incorrect_answers.length+1; i++) {
        const answer = (i < this.data.incorrect_answers.length) ? this.data.incorrect_answers[i] : this.data.correct_answer;
        answersButtons.push(new Discord.MessageButton({custom_id: `trivia|${this.id}|${escapeHtml(answer, true)}`, label: escapeHtml(answer, true), style: 'SECONDARY'}));
      }

      if (this.data.incorrect_answers.length === 1) this.answers.addComponents(answersButtons.sort((a, b) => a.label.length - b.label.length));
      else this.answers.addComponents(shuffle(answersButtons));

      this.embed.setTitle(`Trivia started by ${this.user.username}${this.isRandom ? ' (This question affects the leaderboard)' : ''}`).setColor('DARK_GREEN').addFields({
        name: 'Timeleft',
        value: this.timeleft.toString(),
        inline: true,
      }, {name: '\u200B', value: '\u200B', inline: true}, {
        name: 'Questions in Queue',
        value: triviaQueue.length.toString(),
        inline: true,
      }, {
        name: 'Category',
        value: this.isGPT2 ? 'General Knowledge' : triviaOptions.categories[this.category],
        inline: true,
      }, {name: '\u200B', value: '\u200B', inline: true}, {
        name: 'Difficulty',
        value: capitalize(this.difficulty),
        inline: true,
      }, {
        name: 'Question',
        value: escapeHtml(this.data.question, true),
        inline: false,
      });

      callback(true);
    };

    this.start = function() {
      this.update(false, () => {
        this.startTime = new Date();
        this.interval = setInterval(() => {
          if (this.timeleft >= 0) {
            this.timeleft--;

            if (this.timeleft === 15) this.embed.setColor('GREEN');
            if (this.timeleft === 10) this.embed.setColor('YELLOW');
            if (this.timeleft === 3) this.embed.setColor('ORANGE');
            if (this.timeleft === 2) this.embed.setColor('DARK_ORANGE');
            if (this.timeleft === 1) this.embed.setColor('DARK_RED');

            this.embed.fields[0].value = this.timeleft.toString();
            this.embed.fields[2].value = triviaQueue.length.toString();

            if (this.timeleft === 15 || this.timeleft === 10 || this.timeleft === 5 || this.timeleft === 3 || this.timeleft === 2 || this.timeleft === 1) this.update();
            if (this.timeleft === 0) {
              setTimeout(() => {
                this.end();
              }, 150);
            }
          }
        }, 1000);
      });
    };

    this.getTriviaToken = function(callback) {
      if (triviaOptions.token != '') callback(triviaOptions.token);
      else {
        request(process.env.TRIVIA_TOKEN_API, (err, req, res) => {
          if (!err) {
            triviaOptions.token = JSON.parse(res).token;
            callback(triviaOptions.token);
            fs.writeFileSync(dpath.join(__srcdir, './options/trivia.json'), JSON.stringify(triviaOptions));
          }
        });
      }
    };

    this.update = function(isEnd = false, callback = () => {}) {
      if (isEnd) {
        this.message.edit({embeds: [this.embed], components: [this.answers, new Discord.MessageActionRow().addComponents(new Discord.MessageButton({custom_id: `trivia|p|${this.isGPT2}|${this.message.channel.guild.id}|${this.message.channel.id}|${this.message.id}`, label: 'Problem with question?', style: 'DANGER'}))]}).then(callback);
      } else this.message.edit({embeds: [this.embed], components: [this.answers]}).then(callback);
    };

    this.end = function() {
      this.hasEnded = true;

      clearInterval(this.interval);
      if (this.guessed.length > 0) this.embed.spliceFields(this.embed.fields.length-1, 1);

      this.embed.fields.splice(0, 3);
      this.embed.setColor(); // NOT_QUITE_BLACK
      this.embed.addFields({
        name: 'Players Correct',
        value: '0',
        inline: true,
      }, {name: '\u200B', value: '\u200B', inline: true}, {
        name: 'Players Incorrect',
        value: '0',
        inline: true,
      });

      let correct = 0;
      let incorrect = 0;
      const guesses = [];
      if (this.guessed.length > 0) {
        for (let i = -1; i < this.data.incorrect_answers.length; i++) {
          let answer = '';
          const filtered = this.guessed.filter((g) => {
            answer = (i === -1) ? escapeHtml(this.data.correct_answer, true) : escapeHtml(this.data.incorrect_answers[i], true);
            // console.log(answer);
            return g.answer === answer;
          });
          // console.log(filtered);
          if (filtered.length > 0) {
            guesses.push(filtered);
            if (i != -1) {
              if ((correct === 0 && incorrect === 0) || (correct >= 0 && incorrect > 0)) this.embed.addFields([{name: '\u200B', value: '\u200B', inline: true}]);
              this.embed.addFields([{name: '\u200B', value: '\u200B', inline: true}]);
              incorrect += filtered.length;
            } else {
              correct += filtered.length;
            }
            this.embed.addFields([{
              name: answer,
              value: filtered.map((g) => {
                const placement = this.guessed.findIndex((gu) => gu.id === g.id)+1;
                const diff = (this.difficulty === 'hard' ? 10 : this.difficulty === 'medium' ? 5 : 1);
                const multiBi = (this.data.incorrect_answers.length === 1 ? 1 : 2);
                let score = (diff * multiBi) + 5 + ((this.guessed.length - placement)*2);
                if (i != -1) score = 0;
                return `${g.username} in ${g.time}s${score > 0 ? ` (+${score})` : ``}`;
              }).join('\n'),
              inline: true,
            }]);
          }
        }

        if (!this.guessed.find((g) => g.id === this.user.id)) {
          incorrect++;
          if (correct === 0) this.embed.addFields([{name: '\u200B', value: '\u200B', inline: true}]);
          this.embed.addFields([{name: '\u200B', value: '\u200B', inline: true}, {
            name: 'Didn\'t Answer',
            value: this.user.username,
            inline: true,
          }]);
          guesses.push([{
            id: this.user.id,
            username: this.user.username,
            correct: false,
            answer: 'Didn\'t Answer',
            time: '20.000',
          }]);
        }
      } else {
        incorrect++;
        this.embed.addFields([{name: '\u200B', value: '\u200B', inline: true}, {name: '\u200B', value: '\u200B', inline: true}, {
          name: 'Didn\'t Answer',
          value: this.user.username,
          inline: true,
        }]);
        guesses.push([{
          id: this.user.id,
          username: this.user.username,
          correct: false,
          answer: 'Didn\'t Answer',
          time: '20.000',
        }]);
      }

      this.embed.fields[4].value = correct.toString();
      this.embed.fields[6].value = incorrect.toString();

      for (let i = 0; i < this.answers.components.length; i++) {
        if (this.answers.components[i].label === escapeHtml(this.data.correct_answer, true)) this.answers.components[i].setStyle('SUCCESS');
        this.answers.components[i].setDisabled(true);
      }

      this.update(true, () => {
        if (this.isRandom && !this.isGPT2) {
          const answers = this.data.incorrect_answers;
          answers.push(this.data.correct_answer);
          const triviaData = {
            'question': this.data.question,
            'category': this.category,
            'difficulty': this.difficulty,
            'answers': answers,
            'correct': this.data.correct_answer,
            'startTime': this.startTime,
            'numGuessed': correct+incorrect,
            'numCorrect': correct,
            'numIncorrect': incorrect,
            'guessed': guesses,
          };

          request({
            method: 'POST',
            url: process.env.ANDLIN_TRIVIA_LEADERBOARD_ADD_API,
            headers: {'Authorization': process.env.ANDLIN_TOKEN},
            json: triviaData,
          }, (err, req, res) => {
            if (!err) {
              if (res) console.log(res);
            } else {
              console.log(triviaData);
              console.log(err);
            }
          });
        }

        if (triviaQueue.length > 0) {
          setTimeout(() => {
            triviaQueue[0].interaction.channel.send({embeds: [triviaQueue[0].embed]}).then((msg) => {
              setTimeout(() => {
                triviaQueue[0].message = msg;
                triviaQueue[0].start();
                triviaGame = triviaQueue[0];
                triviaQueue.splice(0, 1);
              }, 250);
            });
          }, 1750);
        } else {
          triviaGame = null;
        }
      });
    };

    this.guess = function(answer, user, answerTime) {
      if (!this.hasEnded) {
        this.guessed.push({'id': user.id, 'username': user.username, 'correct': (answer === escapeHtml(this.data.correct_answer, true)), 'answer': answer, 'time': ((answerTime - this.startTime)/1000).toFixed(3)});
        if (this.guessed.length > 1) this.embed.spliceFields(this.embed.fields.length-1, 1);
        this.embed.addFields([{
          name: `Guessed`,
          value: this.guessed.map((g) => g.username).join('\n'),
          inline: false,
        }]);
        this.update();
      }
    };
  };
};
exports.buttonHandler = async function(interaction, Discord) {
  const time = new Date();
  const id = interaction.customID.split('|')[1];
  const answer = interaction.customID.split('|')[2];
  if (id === 'p') {
    await interaction.defer({ephemeral: true});
    if (answer == 'true') interaction.editReply({content: options.emote.troll.string});
    else {
      // let btns = interaction.message.components;
      // btns[1].components[0].disabled = true;
      // interaction.message.edit({embeds: interaction.message.embeds, components: btns});
      interaction.editReply({content: options.emote.ok.string});
      // const logProblem = await client.channels.resolve(process.env.CHANNEL_BOT_TESTING)
      // logProblem.send({content: `Problem reported, https://discord.com/channels/${interaction.customID.split('|')[3]}/${interaction.customID.split('|')[4]}/${interaction.customID.split('|')[5]}`});
    }
  } else if (triviaGame?.id === id) {
    const found = triviaGame.guessed.find((g) => g.id === interaction.user.id);
    if (!found) {
      await interaction.deferUpdate();
      triviaGame.guess(answer, interaction.user, time);
    } else {
      await interaction.defer({ephemeral: true});
      interaction.editReply({content: `Already guessed`, ephemeral: true});
    }
  }
};
