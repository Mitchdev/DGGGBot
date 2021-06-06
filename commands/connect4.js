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
  //interaction.defer();

  interaction.defer({ephemeral: true});
  interaction.editReply('Coming Soon', {ephemeral: true});

  // const id = makeID();
  // connect4Games[id] = new connect4(id, {'user': interaction.user, 'member': interaction.member}, {'user': interaction.options.first().user, 'member': interaction.options.first().member}, interaction);
  // connect4Games[id].startGame();

  function connect4(id, p1, p2, i) {
    this.id = id;
    this.player1 = p1;
    this.player2 = p2;
    this.interaction = i;

    this.startGame = function() {
      this.interaction.editReply(`${this.player1.user.username} vs ${this.player2.user.username}`)
    }
  }

  function makeID() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = [];
    for (let i = 0; i < 10; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
    return id;
  }
};
exports.buttonHandler = function(interaction, Discord) {};