exports.name = ['avatar']
exports.permission = 'none'
exports.slash = [{
    name: 'avatar',
    description: 'Posts the user profile picture',
    options: [{
        name: 'user',
        type: 'USER',
        description: 'User you want to get the avatar from',
        required: false
    }]
}]
exports.handler = function(interaction) {
	var user = (interaction.options.length == 0) ? interaction.user : interaction.options[0].user;
    interaction.editReply(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`);
}