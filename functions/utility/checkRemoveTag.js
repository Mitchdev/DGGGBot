module.exports = function(client) {
  checkRemoveTag = function(guild, mute) {
    const difference = (new Date().getTime() - new Date(mute.startTime).getTime()) / 1000;
    const time = parseInt(mute.time) - parseInt(difference);
    guild.members.fetch(mute.user).then((guildMember) => {
      guild.roles.fetch(mute.role).then((role) => {
        if (!guildMember._roles.includes(mute.role)) guildMember.roles.add(role);
        if (time <= 0) {
          guildMember.roles.remove(role);
          mutes.list = mutes.list.filter((m) => {
            return (m.user != mute.user) || (m.role != mute.role);
          });
          updateMutes();
        } else if (!guildMember._roles.includes(mute.role)) {
          guildMember.roles.add(role);
        }
      }).catch(console.error);
    }).catch(() => {
      if (time <= 0) {
        mutes.list = mutes.list.filter((m) => {
          return (m.user != mute.user) || (m.role != mute.role);
        });
        updateMutes();
      }
    });
  };
};
