exports.name = ['wizard', 'weeb', 'mute'];
exports.permission = 'mod';
exports.slash = [{
  name: 'mute',
  description: 'Gives mentions user mute role for duration',
  defaultPermission: false,
  options: [{
    name: 'user',
    type: 'USER',
    description: 'User to be given the mute role',
    required: true,
  }, {
    name: 'duration',
    type: 'STRING',
    description: 'Duration to be mute role for (eg. 10m)',
    required: true,
  }],
}, {
  name: 'weeb',
  description: 'Gives mentions user weeb role for duration',
  defaultPermission: false,
  options: [{
    name: 'user',
    type: 'USER',
    description: 'User to be given the weeb role',
    required: true,
  }, {
    name: 'duration',
    type: 'STRING',
    description: 'Duration to be weeb role for (eg. 10m)',
    required: true,
  }],
}, {
  name: 'wizard',
  description: 'Gives mentions user wizard role for duration',
  defaultPermission: false,
  options: [{
    name: 'user',
    type: 'USER',
    description: 'User to be given the wizard role',
    required: true,
  }, {
    name: 'duration',
    type: 'STRING',
    description: 'Duration to be wizard role for (eg. 10m)',
    required: true,
  }],
}];
exports.handler = function(interaction) {
  const roleRaw = interaction.commandName === 'wizard' ? 'Wizard' : interaction.commandName === 'weeb' ? 'Weeb' : 'Mute';
  const roleID = roleRaw == 'Wizard' ? options.role.wizard : (roleRaw == 'Weeb' ? options.role.weeb : options.role.mute);
  const timeRaw = interaction.options[1].value;
  const time = timeToSeconds(timeRaw);

  if (time != null && time > 0) {
    if (time <= 2592000) {
      client.guilds.resolve(options.guild).roles.fetch(roleID).then((role) => {
        const startTime = new Date();
        const inc = mutes.list.filter((m) => {
          return m.user == interaction.options[0].user.id && m.role == roleID;
        });
        if (inc.length == 0) {
          if (!gunCooldown) {
            if (Math.round(Math.random() * 100) == 70) {
              if (!member._roles.includes(roleID)) member.roles.add(role);
              interaction.editReply(`${options.emote.gun.string} gun backfired!`);
              mutes.list.push({
                'user': interaction.user.id,
                'username': interaction.user.username,
                'role': roleID,
                'roleName': roleRaw,
                'startTime': startTime,
                'time': time,
                'timeRaw': timeRaw,
                'gambled': false,
              });
              updateMutes();
            } else if (Math.round(Math.random() * 20) == 14) {
              interaction.editReply(`Looks like the gun jammed.`);
              gunCooldown = true;

              client.users.fetch(options.user.mitch).then((mitch) => {
                mitch.send(`My gun broke`);
              });

              setTimeout(function() {
                gunCooldown = false;
              }, 600000);
            } else {
              if (!interaction.options[0].member._roles.includes(roleID)) interaction.options[0].member.roles.add(role);
              interaction.editReply(`${options.emote.ok.string} ${interaction.options[0].user.username} is a ${roleRaw} for ${timeRaw}`);
              mutes.list.push({
                'user': interaction.options[0].user.id,
                'username': interaction.options[0].user.username,
                'role': roleID,
                'roleName': roleRaw,
                'startTime': startTime,
                'time': time,
                'timeRaw': timeRaw,
                'gambled': false,
              });
              updateMutes();
            }
          } else {
            interaction.editReply(`Fixing the gun...`);
          }
        } else if (interaction.user.id != interaction.options[0].user.id) {
          if (!interaction.options[0].member._roles.includes(roleID)) interaction.options[0].member.roles.add(role);
          interaction.editReply(`${options.emote.ok.string} Updated ${interaction.options[0].user.username}\'s ${roleRaw} time from ${inc[0].timeRaw} to ${timeRaw}`);
          mutes.list = mutes.list.filter((m) => {
            return (m.user != interaction.options[0].user.id) || (m.role != roleID);
          });
          mutes.list.push({
            'user': interaction.options[0].user.id,
            'username': interaction.options[0].user.username,
            'role': roleID,
            'roleName': roleRaw,
            'startTime': startTime,
            'time': time,
            'timeRaw': timeRaw,
            'gambled': false,
          });
          updateMutes();
        } else {
          interaction.editReply(options.emote.pogo.string);
        }
      }).catch(console.error);
    } else {
      interaction.editReply('Max of 30d');
    }
  }
};
