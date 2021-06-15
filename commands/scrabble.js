exports.commands = {'scrabble': 'none'};
exports.buttons = {'scrabble': 'none'};
exports.slashes = [{
  name: 'scrabble',
  description: 'Scrabble game',
  options: [{
    name: 'create',
    description: 'Creates a game of scrabble',
    type: 'SUB_COMMAND',
  }, {
    name: 'place',
    description: 'Place a word in a current scrabble word',
    type: 'SUB_COMMAND',
    options: [{
      name: 'row',
      type: 'INTEGER',
      description: '(1-15) Row to place the first letter. (top to bottom)',
      required: true,
    }, {
      name: 'col',
      type: 'INTEGER',
      description: '(1-15) Column to place the first letter. (left to right)',
      required: true,
    }, {
      name: 'direction',
      type: 'STRING',
      description: 'Direction from the first letter.',
      required: true,
      choices: [{name: 'Right', value: 'right'}, {name: 'Down', value: 'down'}],
    }, {
      name: 'word',
      type: 'STRING',
      description: 'Direction',
      required: true,
    }],
  }],
}];
exports.commandHandler = function(interaction, Discord) {
  interaction.defer();
  const gameIDs = Object.keys(scrabbleGames);
  const gameID = gameIDs.filter((id) => scrabbleGames[id].players.find((p) => p.user.id === interaction.user.id));

  if (gameID.length > 0) {
    if (interaction.options.first().name === 'place') {
      if (interaction.user.id === scrabbleGames[gameID].players[scrabbleGames[gameID].turn].user.id) {
        const word = interaction.options.first().options.get('word').value.toUpperCase();
        const row = interaction.options.first().options.get('row').value-1;
        const col = interaction.options.first().options.get('col').value-1;
        const dir = interaction.options.first().options.get('direction').value;
        scrabbleGames[gameID].validateWord(word, row, col, dir, (valid) => {
          console.log(valid);
          if (valid.message) {
            interaction.editReply({content: valid.message});
          } else {
            scrabbleGames[gameID].placeWord(word, row, col, dir, interaction, valid.words, valid.wilds);
          }
        });
      } else {
        interaction.editReply({content: 'Not your turn'});
      }
    } else {
      interaction.editReply({content: 'You\'re already in a game'});
    }
  } else {
    if (interaction.options.first().name === 'create') {
      const id = makeID();
      scrabbleGames[id] = new Scrabble(id, {'user': interaction.user, 'member': interaction.member}, interaction, cloneDeep(options.scrabbleLetters));
      scrabbleGames[id].playerJoin({'user': interaction.user, 'member': interaction.member, 'letters': [], 'color': {}, 'points': 0}, 0);
      scrabbleGames[id].loadGame();
    } else {
      interaction.editReply('You\'re not in a game');
    }
  }

  /**
   * Scrabble constructor.
   * @param {string} id of the game
   * @param {object} o game owner
   * @param {interaction} i game message
   * @param {object} gl game letters
   */
  function Scrabble(id, o, i, gl) {
    this.id = id;
    this.owner = o;
    this.players = [];
    this.interaction = i;
    this.turn = -1;
    this.playersSkipped = 0;
    this.firstMove = true;
    this.gameLetters = gl;
    this.joinBtns = [new Discord.MessageActionRow(), new Discord.MessageActionRow()];
    this.skipBtns = [new Discord.MessageActionRow()];
    this.colors = [{'embed': 'RED', 'btn': 'DANGER', 'available': true}, {'embed': 'BLUE', 'btn': 'PRIMARY', 'available': true}, {'embed': 'YELLOW', 'btn': 'SECONDARY', 'available': true}, {'embed': 'GREEN', 'btn': 'SUCCESS', 'available': true}];
    this.rawBoard = [];
    this.board = [];

    for (let r = 0; r < 15; r++) {
      this.rawBoard.push([]);
      for (let c = 0; c < 15; c++) {
        this.rawBoard[r].push('');
      }
    }

    for (let i = 0; i < 5; i++) {
      if (i === 0) {
        this.joinBtns[1].addComponents(new Discord.MessageButton({custom_id: `null`, label: `${this.owner.user.username}:`, style: 'SECONDARY', disabled: true}));
        this.skipBtns[0].addComponents(new Discord.MessageButton({custom_id: `null`, label: `USER:`, style: 'SECONDARY', disabled: true}));
      }
      if (i === 1) {
        this.joinBtns[1].addComponents(new Discord.MessageButton({custom_id: `scrabble|${id}|start`, label: `Start`, style: 'SUCCESS'}));
        this.skipBtns[0].addComponents(new Discord.MessageButton({custom_id: `scrabble|${id}|skip`, label: `Skip Turn`, style: 'DANGER'}));
      }
      if (i === 2) this.joinBtns[1].addComponents(new Discord.MessageButton({custom_id: `scrabble|${id}|cancel`, label: `Cancel`, style: 'DANGER'}));
      if (i === 4) this.joinBtns[0].addComponents(new Discord.MessageButton({custom_id: `scrabble|${id}|leave`, label: 'Leave', style: 'DANGER'}));
      else this.joinBtns[0].addComponents(new Discord.MessageButton({custom_id: `scrabble|${id}|join|${i}`, label: `${capitalize(this.colors[i].embed.toLowerCase())}`, style: this.colors[i].btn}));
    }

    this.loadGame = function() {
      const embed = new Discord.MessageEmbed()
          .setTitle(`Owner: ${this.owner.user.username}`)
          .setColor('WHITE')
          .addFields(this.colors.map((c) => {
            if (c.available) return {name: capitalize(c.embed.toLowerCase()), value: 'available', inline: true};
            const player = this.players.find((p) => p.color.embed === c.embed);
            return {name: capitalize(c.embed.toLowerCase()), value: player.user.username, inline: true};
          }));

      this.interaction.editReply({embeds: [embed], components: this.joinBtns});
    };

    this.startGame = function() {
      const embed = new Discord.MessageEmbed()
          .setTitle(`Owner: ${this.owner.user.username}`)
          .setColor('white')
          .setDescription('Loading...')
          .addFields(this.colors.map((c) => {
            if (c.available) return {name: capitalize(c.embed.toLowerCase()), value: 'available', inline: true};
            const player = this.players.find((p) => p.color.embed === c.embed);
            return {name: capitalize(c.embed.toLowerCase()), value: player.user.username, inline: true};
          }));

      this.interaction.editReply({embeds: [embed], components: []});
      this.nextTurn(false);
    };

    this.update = async function() {
      const fields = this.players.map((p) => {
        return {name: `${p.user.username} points`, value: p.points.toString(), inline: true};
      });
      fields.push({name: `${capitalize(this.players[this.turn].color.embed.toLowerCase())}s turn`, value: this.players[this.turn].user.username});
      fields.push({name: `${capitalize(this.players[this.turn].color.embed.toLowerCase())}s letters`, value: this.players[this.turn].letters.join(', ')});
      const writeStream = await request({
        method: 'POST',
        url: process.env.ANDLIN_SCRABBLE_API,
        headers: {'Authorization': process.env.ANDLIN_TOKEN},
        json: this.board,
      }).pipe(fs.createWriteStream(dpath.join(__dirname, `../resources/scrabble/${this.id}.jpg`)));
      writeStream.on('close', () => {
        const file = new Discord.MessageAttachment(fs.readFileSync(dpath.join(__dirname, `../resources/scrabble/${this.id}.jpg`)), `${this.id}.jpg`);
        const embed = new Discord.MessageEmbed()
            .attachFiles([file])
            .setTitle('Do `/scrabble place` to place a word')
            .setColor(this.players[this.turn].color.embed)
            .addFields(fields)
            .setImage(`attachment://${this.id}.jpg`);

        this.interaction.editReply({embeds: [embed], components: this.skipBtns});

        try {
          fs.unlinkSync(dpath.join(__dirname, `../resources/scrabble/${this.id}.jpg`));
        } catch (err) {
          console.error(err);
        }
      });
    };

    this.validateWord = function(word, row, col, dir, callback) {
      const playerLetters = [...this.players[this.turn].letters];
      const words = [];
      const wordsToDelete = [];

      if (this.firstMove && (row != 7 || col != 7)) {
        callback({'message': 'The first move has to start from the middle (row:8 col:8)'}); return;
      };
      if (row < 0 || row > 14 || col < 0 || col > 14) {
        callback({'message': 'Row & col must be between 1 and 15'}); return;
      };
      if (((dir === 'down' ? row : col)+(word.length)) > 14) {
        callback({'message': 'Word must fit in the board'}); return;
      };

      let wordInSameDir = false;
      let isConneting = false;
      let originalLetters = false;

      for (i = 0; i < word.length; i++) {
        const letter = word.charAt(i);
        const letterRow = row + (dir === 'down' ? i : 0);
        const letterCol = col + (dir === 'right' ? i : 0);
        let preexisting = false;

        if (this.rawBoard[letterRow][letterCol] === letter) {
          if (word.length === 1) {
            callback({'message': `You need to add original letters`}); return;
          }
          playerLetters.push(letter);
          preexisting = true;
          isConneting = true;
        } else if (this.rawBoard[letterRow][letterCol] != '') {
          callback({'message': `${letter} does not match the letter ${this.rawBoard[letterRow][letterCol]} in the same position`});
          return;
        } else originalLetters = true;

        if (dir === 'down' || word.length == 1) {
          if (i === 0) {
            if (letterRow-1 >= 0) {
              if (this.rawBoard[letterRow-1][letterCol] != '') { // back
                wordInSameDir = true;
                let extraWord = '';
                for (let j = letterRow-1; j >= 0; j--) {
                  if (this.rawBoard[j][letterCol] != '') extraWord = this.rawBoard[j][letterCol] + extraWord;
                  else break;
                }
                if (!words.includes(extraWord + word)) {
                  // console.log('down', word.length, 'back', extraWord + word);
                  words.push(extraWord + word);
                  // console.log(words);
                }
              }
            }
          }
          if (i === word.length-1) {
            if (letterRow+1 <= 14) {
              if (this.rawBoard[letterRow+1][letterCol] != '') { // forward
                wordInSameDir = true;
                let extraWord = '';
                for (let j = letterRow+1; j <= 14; j++) {
                  if (this.rawBoard[j][letterCol] != '') extraWord += this.rawBoard[j][letterCol];
                  else break;
                }
                if (!words.includes(word + extraWord)) {
                  if (words.length > 0 && words[words.length-1].substring(words[words.length-1].length - word.length) === word) {
                    wordsToDelete.push(words.length-1);
                    words.push(words[words.length-1] + extraWord);
                    words.push(word + extraWord);
                    wordsToDelete.push(words.length-1);
                    // console.log('down', word.length, 'forward', 'connecting', words[words.length-1]);
                    // console.log(words);
                  } else {
                    // console.log('down', word.length, 'forward', word + extraWord);
                    words.push(word + extraWord);
                    // console.log(words);
                  }
                }
              }
            }
          }
          if (!preexisting) {
            if (letterCol-1 >= 0) {
              if (this.rawBoard[letterRow][letterCol-1] != '') { // left
                let extraWord = '';
                for (let j = letterCol-1; j >= 0; j--) {
                  if (this.rawBoard[letterRow][j] != '') extraWord = this.rawBoard[letterRow][j] + extraWord;
                  else break;
                }
                if (!words.includes(extraWord + letter)) {
                  // console.log('down', word.length, 'left', extraWord + letter);
                  words.push(extraWord + letter);
                  // console.log(words);
                }
              }
            }
            if (letterCol+1 <= 14) {
              if (this.rawBoard[letterRow][letterCol+1] != '') { // right
                let extraWord = '';
                for (let j = letterCol+1; j <= 14; j++) {
                  if (this.rawBoard[letterRow][j] != '') extraWord += this.rawBoard[letterRow][j];
                  else break;
                }
                if (!words.includes(letter + extraWord)) {
                  if (words.length > 0 && words[words.length-1].substring(words[words.length-1].length - word.length) === word) {
                    wordsToDelete.push(words.length-1);
                    words.push(words[words.length-1] + extraWord);
                    words.push(letter + extraWord);
                    wordsToDelete.push(words.length-1);
                    // console.log('down', word.length, 'right', 'connecting', words[words.length-1]);
                    // console.log(words);
                  } else {
                    // console.log('down', word.length, 'right', letter + extraWord);
                    words.push(letter + extraWord);
                    // console.log(words);
                  }
                }
              }
            }
          }
        }
        if (dir === 'right' || word.length == 1) {
          if (i === 0) {
            if (letterCol-1 >= 0) {
              if (this.rawBoard[letterRow][letterCol-1] != '') { // back
                wordInSameDir = true;
                let extraWord = '';
                for (let j = letterCol-1; j >= 0; j--) {
                  if (this.rawBoard[letterRow][j] != '') extraWord = this.rawBoard[letterRow][j] + extraWord;
                  else break;
                }
                if (!words.includes(extraWord + word)) {
                  // console.log('right', word.length, 'back', extraWord + word);
                  words.push(extraWord + word);
                  // console.log(words);
                }
              }
            }
          }
          if (i === word.length-1) {
            if (letterCol+1 <= 14) {
              if (this.rawBoard[letterRow][letterCol+1] != '') { // forward
                wordInSameDir = true;
                let extraWord = '';
                for (let j = letterCol+1; j <= 14; j++) {
                  if (this.rawBoard[letterRow][j] != '') extraWord += this.rawBoard[letterRow][j];
                  else break;
                }
                if (!words.includes(word + extraWord)) {
                  if (words.length > 0 && words[words.length-1].substring(words[words.length-1].length - word.length) === word) {
                    wordsToDelete.push(words.length-1);
                    words.push(words[words.length-1] + extraWord);
                    words.push(word + extraWord);
                    wordsToDelete.push(words.length-1);
                    // console.log('right', word.length, 'forward', 'connecting', words[words.length-1]);
                    // console.log(words);
                  } else {
                    // console.log('right', word.length, 'forward', word + extraWord);
                    words.push(word + extraWord);
                    // console.log(words);
                  }
                }
              }
            }
          }
          if (!preexisting) {
            if (letterRow-1 >= 0) {
              if (this.rawBoard[letterRow-1][letterCol] != '') { // up
                let extraWord = '';
                for (let j = letterRow-1; j >= 0; j--) {
                  if (this.rawBoard[j][letterCol] != '') extraWord = this.rawBoard[j][letterCol] + extraWord;
                  else break;
                }
                if (!words.includes(extraWord + letter)) {
                  // console.log('right', word.length, 'up', extraWord + letter);
                  words.push(extraWord + letter);
                  // console.log(words);
                }
              }
            }
            if (letterRow+1 <= 14) {
              if (this.rawBoard[letterRow+1][letterCol] != '') { // down
                let extraWord = '';
                for (let j = letterRow+1; j <= 14; j++) {
                  if (this.rawBoard[j][letterCol] != '') extraWord += this.rawBoard[j][letterCol];
                  else break;
                }
                if (!words.includes(letter + extraWord)) {
                  if (words.length > 0 && words[words.length-1].substring(words[words.length-1].length - word.length) === word) {
                    wordsToDelete.push(words.length-1);
                    words.push(words[words.length-1] + extraWord);
                    words.push(letter + extraWord);
                    wordsToDelete.push(words.length-1);
                    // console.log('right', word.length, 'down', 'connecting', words[words.length-1]);
                    // console.log(words);
                  } else {
                    // console.log('right', word.length, 'down', letter + extraWord);
                    words.push(letter + extraWord);
                    // console.log(words);
                  }
                }
              }
            }
          }
        }
      }

      for (let i = wordsToDelete.length-1; i >= 0; i--) {
        words.splice(wordsToDelete[i], 1);
      }

      if (!originalLetters) {
        callback({'message': `You need to add original letters`}); return;
      }

      if (!wordInSameDir && word.length > 1) words.push(word);

      if (words.length === 1 && !isConneting && !this.firstMove) {
        if (words[0] === word) {
          callback({'message': 'Your word must connect with another letter on the board'}); return;
        }
      }

      for (let i = 0; i < word.length; i++) {
        if (!playerLetters.includes(word.charAt(i))) {
          if (!playerLetters.includes('?')) {
            callback({'message': `You don't have ${word.charAt(i)} as a letter`});
            return;
          }
        }
      }

      const wordsFinal = {'wildcardsIndex': [], 'words': []};
      let wildcards = 0;
      for (let i = 0; i < word.length; i++) {
        if (!playerLetters.includes(word.charAt(i))) {
          if (playerLetters.includes('?')) {
            wordsFinal.wildcardsIndex.push(i);
            wildcards++;
          } else {
            const regex = new RegExp((this.players[this.turn].letters.includes('?') ? '\\?' : word.charAt(i)), 'g');
            callback({'message': `You only have ${this.players[this.turn].letters.join('').match(regex).length} ${(this.players[this.turn].letters.includes('?') ? 'wildcard(s)' : `${word.charAt(i)} letter(s)`)}`});
            return;
          }
        }
        const index = playerLetters.lastIndexOf(word.charAt(i));
        playerLetters.splice(index >= 0 ? index : playerLetters.lastIndexOf('?'), 1);
      }

      // Words has words I shouldn't get from preexisting letter.
      console.log(words);

      for (let i = 0; i < words.length; i++) {
        const wordLocation = words[i].indexOf(word);
        const wordWithoutWild = word.split('');
        for (let j = 0; j < wordsFinal.wildcardsIndex.length; j++) {
          wordWithoutWild.splice(wordLocation + wordsFinal.wildcardsIndex[i], 1);
        }
        let points = 0;
        for (let j = 0; j < wordWithoutWild.length; j++) {
          points += options.scrabbleLetters[wordWithoutWild[j]].points;
        }
        wordsFinal.words.push({'word': words[i], 'points': points});
      }

      this.checkWords(0, wordsFinal, wildcards, (message) => {
        callback(message);
      });
    };

    this.checkWords = function(i, wordsFinal, wildcards, callback) {
      fs.readFile(dpath.join(__dirname, '../resources/scrabble/scrabble.txt'), 'utf8', (err, data) => {
        const scrabbleDict = data;
        const regex = new RegExp(`^(${wordsFinal.words[i].word})\r\n`, 'gim');
        if (scrabbleDict.match(regex)) {
          callback({'message': undefined, 'words': wordsFinal, 'wilds': wildcards});
        } else {
          request(process.env.URBAN_API.replace('|phrase|', wordsFinal.words[i].word), (err, res) => {
            if (!err && res) {
              const data = JSON.parse(res.body).list;
              if (data.length > 0) {
                if (data[0].word === wordsFinal.words[i].word && data[0].thumbs_up >= 3) {
                  if (i === wordsFinal.words.length-1) {
                    callback({'message': undefined, 'words': wordsFinal, 'wilds': wildcards});
                  } else {
                    this.checkWords(i+1, wordsFinal, wildcards, (message) => {
                      callback(message);
                    });
                  }
                } else {
                  callback({'message': `Could not find the word ${wordsFinal.words[i].word}`});
                }
              } else {
                callback({'message': `Could not find the word ${wordsFinal.words[i].word}`});
              }
            }
          });
        }
      });
    };

    this.placeWord = function(word, row, col, dir, inter, wordsFinal, wilds) {
      const originalLetters = this.players[this.turn].letters;

      const fields = this.players.map((p) => {
        return {name: `${p.user.username} points`, value: p.points.toString(), inline: true};
      });
      fields.push({name: `${capitalize(this.players[this.turn].color.embed.toLowerCase())}s turn`, value: this.players[this.turn].user.username});
      fields.push({name: `${capitalize(this.players[this.turn].color.embed.toLowerCase())}s letters`, value: this.players[this.turn].letters.join(', ')});
      const embed = new Discord.MessageEmbed()
          .setTitle('Do `/scrabble place` to place a word')
          .setColor(this.players[this.turn].color.embed)
          .addFields(fields)
          .setImage(`attachment://${this.id}.jpg`);
      this.interaction.editReply({embeds: [embed], components: []});

      this.firstMove = false;

      for (let i = 0; i < wordsFinal.words.length; i++) {
        this.players[this.turn].points += wordsFinal.words[i].points;
      }

      for (let i = 0; i < wilds; i++) {
        this.players[this.turn].letters.splice(this.players[this.turn].letters.lastIndexOf('?'), 1);
      }

      for (let i = 0; i < word.length; i++) {
        const index = this.players[this.turn].letters.lastIndexOf(word.charAt(i));
        if (index >= 0) this.players[this.turn].letters.splice(index, 1);
        this.rawBoard[row+(dir === 'down' ? i : 0)][col+(dir === 'right' ? i : 0)] = word.charAt(i);
      }

      if (originalLetters.length === 7 && this.players[this.turn].letters.length === 0) this.players[this.turn].points += 50;

      this.interaction = inter;
      this.rawBoardtoBoard();
    };

    this.rawBoardtoBoard = function() {
      this.board = [];
      for (let r = 0; r < 15; r++) {
        for (let c = 0; c < 15; c++) {
          if (this.rawBoard[r][c] != '') {
            this.board.push({'Letter': this.rawBoard[r][c], 'Row': r, 'Column': c});
          }
        }
      }
      this.nextTurn();
    };

    this.nextTurn = function(didSkip) {
      this.turn = this.turn+1 === this.players.length ? 0 : this.turn+1;
      this.skipBtns[0].components[0].setLabel(`${this.players[this.turn].user.username}:`);
      if (didSkip) {
        this.update();
        return;
      }
      for (let i = 0; i < this.players.length; i++) {
        for (let j = 0; j < 7; j++) {
          const letters = Object.keys(this.gameLetters);
          if (letters.length > 0) {
            if (this.players[i].letters.length < 7) {
              this.players[i].letters.push(this.requestLetter());
            }
          }
          if (i === this.players.length-1 && j === 6) this.update();
        }
      }
    };

    this.requestLetter = function() {
      const letters = Object.keys(this.gameLetters);
      const random = Math.floor(Math.random() * letters.length);
      const letter = letters[random];
      this.gameLetters[letter].amountLeft--;
      if (this.gameLetters[letter].amountLeft === 0) {
        delete this.gameLetters[letter];
      }
      return letter;
    };

    this.playerLeave = function(index) {
      const colorIndex = this.colors.findIndex((c) => c.embed === this.players[index].color.embed);
      this.colors[colorIndex].available = true;
      this.players.splice(index, 1);
      this.loadGame();
    };

    this.playerJoin = function(p, index) {
      const playerIndex = this.players.findIndex((player) => player.user.username === p.user.username);
      if (playerIndex >= 0) {
        const colorIndex = this.colors.findIndex((c) => c.embed === this.players[playerIndex].color.embed);
        this.colors[colorIndex].available = true;
        this.players.splice(playerIndex, 1);
      }
      this.players.push(p);
      this.colors[index].available = false;
      this.players[this.players.length-1].color = this.colors[index];
      this.loadGame();
    };

    this.playerSkip = function(inter) {
      const fields = this.players.map((p) => {
        return {name: `${p.user.username} points`, value: p.points.toString(), inline: true};
      });
      fields.push({name: `${capitalize(this.players[this.turn].color.embed.toLowerCase())}s turn`, value: this.players[this.turn].user.username});
      fields.push({name: `${capitalize(this.players[this.turn].color.embed.toLowerCase())}s letters`, value: this.players[this.turn].letters.join(', ')});
      const embed = new Discord.MessageEmbed()
          .setTitle(`${this.players[this.turn].user.username} skipped`)
          .setColor(this.players[this.turn].color.embed)
          .addFields(fields)
          .setImage(`attachment://${this.id}.jpg`);
      this.interaction.editReply({embeds: [embed], components: []});

      this.playersSkipped += 1;
      if (this.playersSkipped === this.players.length) {
        this.endGame(false, inter);
      } else {
        if (inter) this.interaction = inter;
        this.nextTurn(true);
      }
    };

    this.endGame = async function(didCancel, inter) {
      if (inter) this.interaction = inter;
      if (didCancel) {
        const embed = new Discord.MessageEmbed()
            .setTitle(`Owner: ${this.owner.user.username}`)
            .setColor('RED')
            .setDescription('Game cancelled');

        this.interaction.editReply({embeds: [embed], components: []});
        delete scrabbleGames[this.id];
      } else {
        const writeStream = await request({
          method: 'POST',
          url: process.env.ANDLIN_SCRABBLE_API,
          headers: {'Authorization': process.env.ANDLIN_TOKEN},
          json: this.board,
        }).pipe(fs.createWriteStream(dpath.join(__dirname, `../resources/scrabble/${this.id}.jpg`)));
        writeStream.on('close', () => {
          const file = new Discord.MessageAttachment(fs.readFileSync(dpath.join(__dirname, `../resources/scrabble/${this.id}.jpg`)), `${this.id}.jpg`);
          const fields = this.players.map((p) => {
            return {name: `${p.user.username} points`, value: p.points.toString(), inline: true};
          });
          const embed = new Discord.MessageEmbed()
              .attachFiles([file])
              .setTitle('Game ended')
              .setColor('WHITE')
              .addFields(fields)
              .setImage(`attachment://${this.id}.jpg`);

          this.interaction.editReply({embeds: [embed], components: []});

          try {
            fs.unlinkSync(dpath.join(__dirname, `../resources/scrabble/${this.id}.jpg`));
          } catch (err) {
            console.error(err);
          }
        });
      }
    };
  }
};
exports.buttonHandler = function(interaction, Discord) {
  const id = interaction.customID.split('|')[1];
  if (scrabbleGames[id]) {
    if (interaction.customID.split('|')[2] === 'join') {
      interaction.deferUpdate();
      const index = parseInt(interaction.customID.split('|')[3]);
      if (scrabbleGames[id].colors[index].available) {
        scrabbleGames[id].playerJoin({'user': interaction.user, 'member': interaction.member, 'letters': [], 'color': {}, 'points': 0}, index);
      }
    } else if (interaction.customID.split('|')[2] === 'start') {
      interaction.deferUpdate();
      if (scrabbleGames[id].owner.user.id === interaction.user.id) {
        scrabbleGames[id].startGame();
      }
    } else if (interaction.customID.split('|')[2] === 'leave') {
      interaction.deferUpdate();
      const index = scrabbleGames[id].players.findIndex((p) => p.user.id === interaction.user.id);
      if (index >= 0) {
        scrabbleGames[id].playerLeave(index);
      }
    } else if (interaction.customID.split('|')[2] === 'cancel') {
      interaction.deferUpdate();
      if (scrabbleGames[id].owner.user.id === interaction.user.id) {
        scrabbleGames[id].endGame(true);
      }
    } else if (interaction.customID.split('|')[2] === 'skip') {
      if (scrabbleGames[id].players[scrabbleGames[id].turn].user.id === interaction.user.id) {
        interaction.defer();
        scrabbleGames[id].playerSkip(interaction);
      } else interaction.deferUpdate();
    }
  }
};
