exports.commands = {'minesweeper': 'none'};
exports.buttons = {'minesweeper': 'none'};
exports.slashes = [{
  name: 'minesweeper',
  description: 'Starts a game of minesweeper',
}];
exports.commandHandler = async function(interaction, Discord) {
  if (interaction.channel.id === process.env.CHANNEL_GENERAL) {
    await interaction.defer({ephemeral: true});
    interaction.editReply({content: `Please use ${client.channels.resolve(process.env.CHANNEL_BOT_GAMES)}`});
  } else {
    await interaction.defer();

    const id = makeID();
    minesweeperGames[id] = new Minesweeper(id, interaction.user, interaction);
    minesweeperGames[id].update(false, false);
  }
  /**
   * Minesweeper constructor.
   * @param {string} id of the game
   * @param {object} u user memebr object
   * @param {interaction} i game message
   */
  function Minesweeper(id, u, i) {
    this.id = id;
    this.player = u;
    this.interaction = i;
    this.startTime = new Date();
    this.didFlag = false;
    this.flagging = false;
    this.minesOnBoard = 5;
    this.rows = 5;
    this.columns = 5;
    this.moves = [];
    this.mines = [];
    this.board = [];

    for (let i = 0; i < this.rows; i++) {
      this.board.push(new Discord.MessageActionRow());
      for (let j = 0; j < this.columns; j++) {
        this.board[i].addComponents(new Discord.MessageButton({custom_id: `minesweeper|${id}|first|${i}.${j}`, label: '', style: 'PRIMARY', emoji: '<:BLANK:855340392165015573>'}));
      }
    }

    this.placeMines = function(callback) {
      if (this.mines.length < this.minesOnBoard+1) {
        const row = Math.floor(Math.random()*this.rows);
        const col = Math.floor(Math.random()*this.columns);
        if (this.mines.indexOf(`${row}.${col}`) < 0) this.mines.push(`${row}.${col}`);
        this.placeMines(callback);
      } else {
        callback();
      }
    };

    this.mineCount = function(pos) {
      let count = 0;
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if (this.mines.indexOf(`${pos[0]+i}.${pos[1]+j}`) >= 0) count++;
        }
      }
      return count;
    };

    this.update = function(isEnd, didWin) {
      if (isEnd) {
        const endTime = new Date();
        const minesweeperData = {
          'userID': this.player.id,
          'rows': this.rows,
          'cols': this.columns,
          'mines': this.mines.map((m) => [parseInt(m.split('.')[0]), parseInt(m.split('.')[1])]),
          'moves': this.moves,
          'didFlag': this.didFlag,
          'startTime': this.startTime,
          'time': (endTime - this.startTime),
          'didWin': didWin,
        };

        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            if (!didWin && this.mines.indexOf(`${i}.${j}`) >= 0) this.board[i].components[j].setStyle('DANGER');
            this.board[i].components[j].setDisabled(true);
          }
        }
        this.interaction.editReply({content: `**Minesweeper (${this.minesOnBoard} Mines)**\n${didWin ? 'Won' : 'Lost'} in ${secondsToDhms((endTime - this.startTime)/1000)} with ${this.moves.length} moves (inc flag)`, components: this.board});
        delete minesweeperGames[this.id];
      } else {
        this.interaction.editReply({content: `**Minesweeper (${this.minesOnBoard} Mines)**`, components: this.board});
      }
    };

    this.first = function(pos, time) {
      this.mines.push(`${pos[0]}.${pos[1]}`);
      this.board = [];
      this.placeMines(() => {
        this.mines.splice(0, 1);
        for (let i = 0; i < this.rows; i++) {
          this.board.push(new Discord.MessageActionRow());
          for (let j = 0; j < this.columns; j++) {
            if (this.mines.indexOf(`${i}.${j}`) >= 0) {
              this.board[i].addComponents(new Discord.MessageButton({custom_id: `minesweeper|${id}|mine|${i}.${j}`, label: '', style: 'PRIMARY', emoji: '<:BLANK:855340392165015573>'}));
            } else if (i === pos[0] && j === pos[1]) {
              this.board[i].addComponents(new Discord.MessageButton({custom_id: `minesweeper|${id}|${this.mineCount([i, j])}|${i}.${j}`, label: this.mineCount([i, j]), style: 'PRIMARY', disabled: true}));
            } else {
              this.board[i].addComponents(new Discord.MessageButton({custom_id: `minesweeper|${id}|${this.mineCount([i, j])}|${i}.${j}`, label: '', style: 'PRIMARY', emoji: '<:BLANK:855340392165015573>'}));
            }
          }
        }
        if (this.board[pos[0]].components[pos[1]].customID.split('|')[2] === '0') this.hitZero(pos, time);
        else this.hit(pos, this.board[pos[0]].components[pos[1]].customID.split('|')[2], time);
      });
    };

    this.checkWin = function() {
      let end = true;
      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          if ((this.board[i].components[j].emoji?.name === 'BLANK' || this.board[i].components[j].emoji?.name === '🚩') && this.board[i].components[j].customID.split('|')[2] != 'mine') {
            end = false;
            break;
          }
        }
      }
      this.update(end, true);
    };

    this.hitZero = function(pos, time) {
      if (this.board[pos[0]].components[pos[1]].emoji?.name != '🚩') {
        this.moves.push({pos: pos, type: '0', time: (time - this.startTime)});
        this.board[pos[0]].components[pos[1]].setStyle('SECONDARY').setLabel('').setEmoji('⬛').setDisabled(true);
        for (let i = -1; i < 2; i++) {
          for (let j = -1; j < 2; j++) {
            if (pos[0]+i < this.rows && pos[0]+i >= 0 && pos[1]+j < this.columns && pos[1]+j >= 0 && !(i === 0 && j === 0)) {
              if (this.board[pos[0]+i].components[pos[1]+j].emoji?.name === 'BLANK') {
                const label = this.board[pos[0]+i].components[pos[1]+j].customID.split('|')[2];
                this.board[pos[0]+i].components[pos[1]+j].setStyle('SECONDARY').setLabel('').setEmoji(`${options.voteReactions[parseInt(label)-1]}`).setDisabled(true);
                if (label === '0') {
                  this.hitZero([pos[0]+i, pos[1]+j]);
                }
              }
            }
          }
        }
        this.checkWin();
      }
    };

    this.hit = function(pos, label, time) {
      if (this.board[pos[0]].components[pos[1]].emoji?.name != '🚩') {
        this.moves.push({pos: pos, type: label, time: (time - this.startTime)});
        this.board[pos[0]].components[pos[1]].setStyle('SECONDARY').setLabel('').setEmoji(`${options.voteReactions[parseInt(label)-1]}`).setDisabled(true);
        this.checkWin();
      }
    };

    this.flag = function(pos, time) {
      this.didFlag = true;
      if (this.board[pos[0]].components[pos[1]].emoji?.name != '🚩') {
        this.moves.push({pos: pos, type: 'flag', time: (time - this.startTime)});
        this.board[pos[0]].components[pos[1]].setStyle('SUCCESS').setEmoji('🚩');
      } else {
        this.moves.push({pos: pos, type: 'unflag', time: (time - this.startTime)});
        this.board[pos[0]].components[pos[1]].setStyle('PRIMARY').setEmoji('<:BLANK:855340392165015573>');
      }
      this.update(false, false);
    };

    this.hitMine = function(pos, time) {
      if (this.board[pos[0]].components[pos[1]].emoji?.name != '🚩') {
        this.moves.push({pos: pos, type: 'mine', time: (time - this.startTime)});
        this.board[pos[0]].components[pos[1]].setStyle('DANGER').setEmoji('💣').setLabel('').setDisabled(true);
        this.update(true, false);
      }
    };
  };
};
exports.buttonHandler = async function(interaction, Discord) {
  const time = new Date();
  const id = interaction.customID.split('|')[1];
  const move = interaction.customID.split('|')[2];
  const pos = [parseInt(interaction.customID.split('|')[3].split('.')[0]), parseInt(interaction.customID.split('|')[3].split('.')[1])];
  if (minesweeperGames[id]) {
    if (interaction.user.id === minesweeperGames[id].player.id) {
      if (move === 'first') {
        await interaction.defer({ephemeral: true});
        await interaction.editReply({components: [new Discord.MessageActionRow().addComponents(new Discord.MessageButton({custom_id: `minesweeper|${id}|flag|0.0`, label: 'Flag (off)', style: 'DANGER'}))], ephemeral: true});
        minesweeperGames[id].first(pos, time);
      } else {
        await interaction.deferUpdate();
        if (move === 'flag') {
          interaction.editReply({components: [new Discord.MessageActionRow().addComponents(new Discord.MessageButton({custom_id: `minesweeper|${id}|flag|0.0`, label: `Flag (${!minesweeperGames[id].flagging ? 'on' : 'off'})`, style: `${!minesweeperGames[id].flagging ? 'SUCCESS' : 'DANGER'}`}))], ephemeral: true});
          minesweeperGames[id].flagging = !minesweeperGames[id].flagging;
        } else {
          if (minesweeperGames[id].flagging) {
            minesweeperGames[id].flag(pos, time);
          } else {
            if (move === 'mine') {
              minesweeperGames[id].hitMine(pos, time);
            } else if (move === '0') {
              minesweeperGames[id].hitZero(pos, time);
            } else {
              minesweeperGames[id].hit(pos, move, time);
            }
          }
        }
      }
    }
  } else {
    if (move === 'flag') {
      await interaction.deferUpdate({ephemeral: true});
      interaction.editReply({components: [new Discord.MessageActionRow().addComponents(new Discord.MessageButton({custom_id: `null`, label: `Flag (off)`, style: 'DANGER', disabled: true}))], ephemeral: true});
    }
  }
};
