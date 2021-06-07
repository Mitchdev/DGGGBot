exports.commands = {'scrabble': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'scrabble',
  description: 'Starts a game of scrabble with other players',
  options: [{
    name: 'player2',
    type: 'USER',
    description: 'The second player',
    required: true,
  }, {
    name: 'player3',
    type: 'USER',
    description: 'The third player',
    required: false,
  }, {
    name: 'player4',
    type: 'USER',
    description: 'The fourth player',
    required: false,
  }],
}];
exports.commandHandler = function(interaction, Discord) {
  interaction.defer();

  let players = [{'user': interaction.user, 'member': interaction.member, 'letters': [], 'color': 'rgba(255, 99, 71, 1)'}];
  interaction.options.each((option) => players.push({'user': option.user, 'member': option.member, 'letters': []}));

  const id = makeID();
  scrabbleGames[id] = new Scrabble(id, players, interaction, options.scrabbleLetters);
  scrabbleGames[id].update();

  /**
   * Scrabble constructor.
   * @param {string} id of the game
   * @param {array} p players user memebr objects
   * @param {interaction} i game message
   * @param {object} gl game letters
   */
  function Scrabble(id, p, i, gl) {
    this.id = id;
    this.players = p;
    this.interaction = i;
    this.turn = p[0];
    this.gameLetters = gl;

    this.update = function() {
      this.interaction.editReply(`**Scrabble**\n${this.players.map((player) => `${player.user.username} - ${player.letters.join(', ')}`).join('\n')}`);
    };

    this.requestLetter = function() {
      const letters = Object.keys(this.gameLetters);
      const letter = letters[Math.floor(Math.random() * letters.length)];
      this.gameLetters[letter].amountLeft--;
      if (this.gameLetters[letter].amountLeft <= 0) {
        delete this.gameLetters[letter];
      }
      return letter;
    };

    for (let i = 0; i < this.players.length; i++) {
      for (let j = 0; j < 7; j++) {
        this.players[i].letters.push(this.requestLetter());
      }
    }
  }

  /**
   * Creates a new id.
   * @return {string} id
   */
  function makeID() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < 10; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
    return id;
  }
};
exports.buttonHandler = function(interaction, Discord) {};
