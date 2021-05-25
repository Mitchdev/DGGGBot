exports.name = ['list'];
exports.permission = 'none';
exports.slash = [{
  name: 'list',
  description: 'Shows list of temporarily roled users',
}];
exports.handler = function(interaction) {
  const sorted = mutes.list.sort((a, b) => {
    const differenceA = (new Date().getTime() - new Date(a.startTime).getTime()) / 1000;
    const differenceB = (new Date().getTime() - new Date(b.startTime).getTime()) / 1000;
    return (parseInt(b.time) - parseInt(differenceB))-(parseInt(a.time) - parseInt(differenceA));
  });

  interaction.editReply((sorted.length > 0) ? `${sorted.map((m) => {
    const difference = (new Date().getTime() - new Date(m.startTime).getTime()) / 1000;
    const time = (parseInt(m.time) - parseInt(difference) <= 0) ? 0 : parseInt(m.time) - parseInt(difference);
    return `${m.username} is a ${m.roleName} until ${secondsToDhms(time)} | **${m.gamble} gamble${m.gamble == 1 ? '' : 's'} left**`;
  }).join('\n')}` : `Nobody is a mute/weeb/wizard`);
};
