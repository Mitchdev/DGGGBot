exports.commands = {'connect4': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'connect4',
  description: 'Starts a game of connect4 with another user',
  options: [{
    name: 'user',
    type: 'USER',
    description: 'User to play against',
    required: true,
  }],
}];
exports.commandHandler = function(interaction, Discord) {
  // interaction.defer();

  interaction.defer({ephemeral: true});
  interaction.editReply({content: 'Coming Soon', ephemeral: true});

  // const id = makeID();
  // connect4Games[id] = new Connect4(id, {'user': interaction.user, 'member': interaction.member}, {'user': interaction.options.first().user, 'member': interaction.options.first().member}, interaction);
  // connect4Games[id].startGame();

  /**
   * Connect4 constructor.
   * @param {string} id of the game
   * @param {object} p1 user memebr object
   * @param {object} p2 user member object
   * @param {interaction} i game message
   */
  function Connect4(id, p1, p2, i) {
    this.id = id;
    this.player1 = p1;
    this.player2 = p2;
    this.interaction = i;

    this.startGame = function() {
      this.interaction.editReply({content: `${this.player1.user.username} vs ${this.player2.user.username}`});
    };
  }

  /**
   * Creates a new id.
   * @return {string} id
   */
  function makeID() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = [];
    for (let i = 0; i < 10; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
    return id;
  }
};
exports.buttonHandler = function(interaction, Discord) {};
