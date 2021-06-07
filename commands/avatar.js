exports.commands = {'avatar': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'avatar',
  description: 'Posts the user profile picture',
  options: [{
    name: 'user',
    type: 'USER',
    description: 'User you want to get the avatar from',
    required: false,
  }],
}];
exports.commandHandler = function(interaction) {
  interaction.defer();

  const user = interaction.options.get('user') ? interaction.options.get('user').user : interaction.user;
  interaction.editReply(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`);
};
