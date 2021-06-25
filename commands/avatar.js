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
exports.commandHandler = async function(interaction, Discord) {
  interaction.defer();

  const user = interaction.options.get('user') ? interaction.options.get('user') : interaction;
  const username = user.member?.displayName ? `${user.member.displayName}${user.member.displayName != user.user.username ? ` (${user.user.username})` : ``}` : user.user.username;
  const image = `https://cdn.discordapp.com/avatars/${user.user.id}/${user.user.avatar}.png?size=256`;
  const color = await colorThief.getColorFromURL(image);
  const embed = new Discord.MessageEmbed().setTitle(username).setImage(image).setColor(color);
  interaction.editReply({embeds: [embed]})
};
