exports.commands = {'mute': 'mod', 'weeb': 'mod', 'wizard': 'mod'};
exports.buttons = {};
exports.slashes = [{
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
exports.commandHandler = async function(interaction) {
  await interaction.defer();

  const roleRaw = `ROLE_${interaction.commandName.toUpperCase()}`;
  const roleID = process.env[roleRaw];
  const timeRaw = interaction.options.get('duration').value;
  const time = timeToSeconds(timeRaw);

  if (time != null && time > 0) {
    if (time <= 2592000) {
      client.guilds.resolve(process.env.GUILD_ID).roles.fetch(roleID).then((role) => {
        const startTime = new Date();
        const inc = mutes.list.filter((m) => {
          return m.user == interaction.options.get('user').user.id && m.role == roleID;
        });
        if (inc.length == 0) {
          if (!gunCooldown) {
            if (Math.round(Math.random() * 100) == 70) {
              if (!member._roles.includes(roleID)) member.roles.add(role);
              interaction.editReply({content: `${options.emote.gun.string} gun backfired!`});
              mutes.list.push({
                'user': interaction.user.id,
                'username': interaction.user.username,
                'role': roleID,
                'roleName': roleRaw,
                'startTime': startTime,
                'time': time,
                'timeRaw': timeRaw,
                'gamble': 5,
              });
              updateMutes();
            } else if (Math.round(Math.random() * 20) == 14) {
              interaction.editReply({content: `Looks like the gun jammed.`});
              gunCooldown = true;
              setTimeout(function() {
                gunCooldown = false;
              }, 600000);
            } else {
              if (!interaction.options.get('user').member._roles.includes(roleID)) interaction.options.get('user').member.roles.add(role);
              interaction.editReply({content: `${options.emote.ok.string} ${interaction.options.get('user').user.username} is a ${capitalize(roleRaw.replace('ROLE_', '').toLowerCase())} for ${timeRaw}`});
              mutes.list.push({
                'user': interaction.options.get('user').user.id,
                'username': interaction.options.get('user').user.username,
                'role': roleID,
                'roleName': roleRaw,
                'startTime': startTime,
                'time': time,
                'timeRaw': timeRaw,
                'gamble': 5,
              });
              updateMutes();
            }
          } else {
            interaction.editReply({content: `Fixing the gun...`});
          }
        } else if (interaction.user.id != interaction.options.get('user').user.id) {
          if (!interaction.options.get('user').member._roles.includes(roleID)) interaction.options.get('user').member.roles.add(role);
          interaction.editReply({content: `${options.emote.ok.string} Updated ${interaction.options.get('user').user.username}\'s ${capitalize(roleRaw.replace('ROLE_', '').toLowerCase())} time from ${inc[0].timeRaw} to ${timeRaw}`});
          mutes.list = mutes.list.filter((m) => {
            return (m.user != interaction.options.get('user').user.id) || (m.role != roleID);
          });
          mutes.list.push({
            'user': interaction.options.get('user').user.id,
            'username': interaction.options.get('user').user.username,
            'role': roleID,
            'roleName': roleRaw,
            'startTime': startTime,
            'time': time,
            'timeRaw': timeRaw,
            'gamble': 5,
          });
          updateMutes();
        } else {
          interaction.editReply({content: options.emote.pogo.string});
        }
      }).catch(console.error);
    } else {
      interaction.editReply({content: 'Max of 30d'});
    }
  }
};
