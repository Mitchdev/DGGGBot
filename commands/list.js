exports.name = ['list']
exports.permission = 'none'
exports.slash = [{
    name: 'list',
    description: 'Shows list of temporarily roled users'
}]
exports.handler = function(interaction) {
	var sorted = mutes.list.sort((a, b) => {
		var differenceA = (new Date().getTime() - new Date(a.startTime).getTime()) / 1000;
		var differenceB = (new Date().getTime() - new Date(b.startTime).getTime()) / 1000;
		return (parseInt(b.time) - parseInt(differenceB))-(parseInt(a.time) - parseInt(differenceA));
	});

	interaction.editReply((sorted.length > 0) ? `${sorted.map(m => {
		var difference = (new Date().getTime() - new Date(m.startTime).getTime()) / 1000;
		var time = (parseInt(m.time) - parseInt(difference) <= 0) ? 0 : parseInt(m.time) - parseInt(difference);
		return `${m.username} is a ${m.roleName} until ${secondsToDhms(time)}`;
	}).join('\n')}` : `Nobody is a mute/weeb/wizard`);
}