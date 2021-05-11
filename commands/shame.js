exports.name = ['shame']
exports.permission = 'none'
exports.slash = {
    name: 'shame',
    description: 'Shows list of indefinitely roled users'
}
exports.handler = function(message) {
	client.guilds.fetch(options.guild).then(guild => {
		guild.roles.fetch(options.role.wizard).then(wizardRole => {
			var wizardUsers = [];
			var weebUsers = [];
			var biggestWeebUsers = [];
			wizardRole.members.each(member => {
				var inc = mutes.list.filter(m => {
					return (m.user == member.user.id && m.role == options.role.wizard);
				});
				if (inc.length == 0) wizardUsers.push(member.user.username);
			});
			guild.roles.fetch(options.role.weeb).then(weebRole => {
				weebRole.members.each(member => {
					var inc = mutes.list.filter(m => {
						return (m.user == member.user.id && m.role == options.role.weeb);
					});
					if (inc.length == 0) weebUsers.push(member.user.username);
				});
				guild.roles.fetch(options.role.weebleader).then(weebleaderRole => {
					weebleaderRole.members.each(member => {
						biggestWeebUsers.push(member.user.username);
					});
					
					for (var i = 0; i < biggestWeebUsers.length; i++) {
						if (weebUsers.indexOf(biggestWeebUsers[i]) != -1) {
							weebUsers.splice(weebUsers.indexOf(biggestWeebUsers[i]), 1);
						}
					}
                    
                    var content = (biggestWeebUsers.length > 0 ? '**Biggest Weeb' + (biggestWeebUsers.length > 1 ? 's' : '') + '**\n'+biggestWeebUsers.map(m=>{return m}).join(', ') + (weebUsers.length > 0 ? '\n' : '') : '') + (weebUsers.length > 0 ? '**Weeb' + (weebUsers.length > 1 ? 's' : '') + '**\n'+weebUsers.map(m=>{return m}).join(', ') + (wizardUsers.length > 0 ? '\n' : '') : '') + (wizardUsers.length > 0 ? '**Grand Wizard' + (wizardUsers.length > 1 ? 's' : '') + '**\n'+wizardUsers.map(m=>{return m}).join(', ') : '');
                    if (content === ``) content = `Nobody is a weeb/wizard`
                    
                    if (message.interaction) {
                        message.interaction.editReply(content);
                    } else {
                        message.channel.send(content);
                    }
				});
			});
		});
	});
}