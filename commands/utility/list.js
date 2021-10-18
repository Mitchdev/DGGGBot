exports.commands = {'list': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'list',
  description: 'Shows list of temporarily roled users',
}];
exports.commandHandler = async function(interaction, Discord) {
  await interaction.deferReply();

  const embed = new Discord.MessageEmbed().setTitle('List of temporarily roled users');
  const sorted = mutes.list.sort((a, b) => {
    const differenceA = (new Date().getTime() - new Date(a.startTime).getTime()) / 1000;
    const differenceB = (new Date().getTime() - new Date(b.startTime).getTime()) / 1000;
    return (parseInt(b.time) - parseInt(differenceB))-(parseInt(a.time) - parseInt(differenceA));
  });
  const joined = [sorted.filter((m) => m.role === process.env.ROLE_MUTE), sorted.filter((m) => m.role === process.env.ROLE_WIZARD), sorted.filter((m) => m.role === process.env.ROLE_WEEB)].filter((r) => r.length > 0);

  if (joined.length > 0) {
    embed.addFields([].concat(...joined.map((r) => {
      return [{
        name: capitalize(r[0].roleName.replace('ROLE_', '').toLowerCase()),
        value: r.map((u) => u.username).join('\n'),
        inline: true,
      }, {
        name: 'Time left',
        value: r.map((u) => {
          const difference = (new Date().getTime() - new Date(u.startTime).getTime()) / 1000;
          const time = (parseInt(u.time) - parseInt(difference) <= 0) ? 0 : parseInt(u.time) - parseInt(difference);
          return secondsToDhms(time);
        }).join('\n'),
        inline: true,
      }, {
        name: 'Gamba left',
        value: r.map((u) => u.gamble).join('\n'),
        inline: true,
      }];
    })));
  } else embed.setDescription('Nobody!');

  interaction.editReply({embeds: [embed]});
};
