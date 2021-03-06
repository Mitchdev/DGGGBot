exports.commands = {'shame': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'shame',
  description: 'Shows list of indefinitely roled users',
}];
exports.commandHandler = async function(interaction) {
  await interaction.deferReply();

  client.guilds.fetch(process.env.GUILD_ID).then((guild) => {
    guild.roles.fetch(process.env.ROLE_WIZARD).then((wizardRole) => {
      const wizardUsers = [];
      const weebUsers = [];
      const biggestWeebUsers = [];
      wizardRole.members.each((member) => {
        const inc = mutes.list.filter((m) => {
          return (m.user == member.user.id && m.role == process.env.ROLE_WIZARD);
        });
        if (inc.length == 0) wizardUsers.push(member.user.username);
      });
      guild.roles.fetch(process.env.ROLE_WEEB).then((weebRole) => {
        weebRole.members.each((member) => {
          const inc = mutes.list.filter((m) => {
            return (m.user == member.user.id && m.role == process.env.ROLE_WEEB);
          });
          if (inc.length == 0) weebUsers.push(member.user.username);
        });
        guild.roles.fetch(process.env.ROLE_WEEBLEADER).then((weebleaderRole) => {
          weebleaderRole.members.each((member) => {
            biggestWeebUsers.push(member.user.username);
          });

          for (let i = 0; i < biggestWeebUsers.length; i++) {
            if (weebUsers.indexOf(biggestWeebUsers[i]) != -1) {
              weebUsers.splice(weebUsers.indexOf(biggestWeebUsers[i]), 1);
            }
          }

          let content = (biggestWeebUsers.length > 0 ? '**Biggest Weeb' + (biggestWeebUsers.length > 1 ? 's' : '') + '**\n'+biggestWeebUsers.map((m)=>{
            return m;
          }).join(', ') + (weebUsers.length > 0 ? '\n' : '') : '') + (weebUsers.length > 0 ? '**Weeb' + (weebUsers.length > 1 ? 's' : '') + '**\n'+weebUsers.map((m)=>{
            return m;
          }).join(', ') + (wizardUsers.length > 0 ? '\n' : '') : '') + (wizardUsers.length > 0 ? '**Grand Wizard' + (wizardUsers.length > 1 ? 's' : '') + '**\n'+wizardUsers.map((m)=>{
            return m;
          }).join(', ') : '');
          if (content === ``) content = `Nobody is a weeb/wizard`;
          interaction.editReply({content: content});
        });
      });
    });
  });
};
