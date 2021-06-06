exports.commands = {'tictactoe': 'none'};
exports.buttons = {'tictactoe': 'none'};
exports.slashes = [{
  name: 'tictactoe',
  description: 'Starts a game of tic tac toe with another user',
  options: [{
    name: 'user',
    type: 'USER',
    description: 'User to play against',
    required: true,
  }],
}];
exports.commandHandler = function(interaction, Discord) {
  interaction.defer();

  if (interaction.user.id === interaction.options.first().user.id || interaction.options.first().user.bot) {
    interaction.editReply(`You can't play with ${interaction.options.first().user.bot ? 'a bot' : 'yourself'} ${options.emote.pogo.string}`);
    return;
  }

  const id = makeID();
  tictactoeGames[id] = new tictactoe(id, {'user': interaction.user, 'member': interaction.member}, {'user': interaction.options.first().user, 'member': interaction.options.first().member}, interaction);
  tictactoeGames[id].update();

  function tictactoe(id, p1, p2, i) {
    this.id = id;
    this.player1 = p1;
    this.player2 = p2;
    this.interaction = i;
    this.turn = p2;
    this.turnSymbol = '⭕';
    this.win = false;
    this.filled = 0;
    this.buttons = [new Discord.MessageActionRow(), new Discord.MessageActionRow(), new Discord.MessageActionRow()];
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        this.buttons[i].addComponents(new Discord.MessageButton({custom_id: `tictactoe|${id}|${i}.${j}`, label: " ", style: 'SECONDARY'}))
      }
    }

    this.update = function() {
      if (this.win) {
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            this.buttons[i].components[j].disabled = true;
          }
        }
        this.interaction.editReply(`**TIC TAC TOE**\n${this.player1.user}**[X]** vs **[O]**${this.player2.user}\n\n**${this.turn.member.displayName} won!**`, {components: this.buttons});
        delete tictactoeGames[this.id];
      } else if (this.filled === 9) {
        this.interaction.editReply(`**TIC TAC TOE**\n${this.player1.user}**[X]** vs **[O]**${this.player2.user}\n\n**Draw!**`, {components: this.buttons});
        delete tictactoeGames[this.id];
      } else {
        if (this.turnSymbol === '❌') {
          this.turnSymbol = '⭕';
          this.turn = this.player2;
        } else {
          this.turnSymbol = '❌';
          this.turn = this.player1;
        }
        this.interaction.editReply(`**TIC TAC TOE**\n${this.player1.user}**[X]** vs **[O]**${this.player2.user}\n\n**[${this.turnSymbol === '❌' ? 'X' : 'O'}]**${this.turn.member.displayName}s turn`, {components: this.buttons});
      }
    }

    this.makeMove = function(v, h) {
      this.filled++;
      this.buttons[v].components[h].setEmoji(this.turnSymbol);
      this.buttons[v].components[h].label = "";
      this.buttons[v].components[h].disabled = true;
      this.checkWin(v, h);
    }

    this.checkWin = function(v, h) {
      if (this.buttons[0].components[h].emoji?.name === this.turnSymbol && this.buttons[1].components[h].emoji?.name === this.turnSymbol && this.buttons[2].components[h].emoji?.name === this.turnSymbol) {
        this.setGreen(0, h, 1, h, 2, h);
      }
      if (this.buttons[v].components[0].emoji?.name === this.turnSymbol && this.buttons[v].components[1].emoji?.name === this.turnSymbol && this.buttons[v].components[2].emoji?.name === this.turnSymbol) {
        this.setGreen(v, 0, v, 1, v, 2);
      }
      if ((v == 0 && (h == 0 || h == 2)) || (v == 2 && (h == 0 || h == 2))) {
        if (this.buttons[1].components[1].emoji?.name === this.turnSymbol) {
          if (this.buttons[0].components[0].emoji?.name === this.turnSymbol && this.buttons[2].components[2].emoji?.name === this.turnSymbol) {
            this.setGreen(1, 1, 0, 0, 2, 2);
          }
          if (this.buttons[0].components[2].emoji?.name === this.turnSymbol && this.buttons[2].components[0].emoji?.name === this.turnSymbol) {
            this.setGreen(1, 1, 0, 2, 2, 0);
          }
        }
      }
      this.update();
    }

    this.setGreen = function(v1, h1, v2, h2, v3, h3) {
      this.buttons[v1].components[h1].style = 'SUCCESS';
      this.buttons[v2].components[h2].style = 'SUCCESS';
      this.buttons[v3].components[h3].style = 'SUCCESS';
      this.win = true;
    }
  }

  function makeID() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < 10; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
    return id;
  }
};
exports.buttonHandler = function(interaction, Discord) {
  interaction.deferUpdate();
  const id = interaction.customID.split('|')[1];
  const move = interaction.customID.split('|')[2].split('.');
  if (tictactoeGames[id]) {
    if (interaction.user.id === tictactoeGames[id].turn.user.id) {
      if (tictactoeGames[id].buttons[move[0]].components[move[1]].emoji == undefined) {
        tictactoeGames[id].makeMove(move[0], move[1]);
      }
    }
  }
};