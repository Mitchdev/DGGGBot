exports.name = ['gamble'];
exports.permission = 'weeb/wizard';
exports.slash = [{
  name: 'gamble',
  description: 'Gamble a temporary role time',
  defaultPermission: false,
  options: [{
    name: 'role',
    type: 'STRING',
    description: 'Role to gamble',
    required: true,
    choices: [{
      name: 'Weeb',
      value: 'weeb',
    }, {
      name: 'Wizard',
      value: 'wizard',
    }],
  }, {
    name: 'odds',
    type: 'INTEGER',
    description: '1 out of X gamble (Keep in mind you can only gamble once per temp role)',
    required: true,
    choices: [{
      name: '2 - (+/-)10% timeleft',
      value: 2,
    }, {
      name: '3 - (+/-)20% timeleft',
      value: 3,
    }, {
      name: '4 - (+/-)30% timeleft',
      value: 4,
    }, {
      name: '5 - (+/-)40% timeleft',
      value: 5,
    }, {
      name: '6 - (+/-)50% timeleft',
      value: 6,
    }, {
      name: '7 - (+/-)60% timeleft',
      value: 7,
    }, {
      name: '8 - (+/-)70% timeleft',
      value: 8,
    }, {
      name: '9 - (+/-)80% timeleft',
      value: 9,
    }, {
      name: '10 - (+/-)90% timeleft',
      value: 10,
    }],
  }],
}];
exports.handler = function(interaction) {
  const found = mutes.list.find((m) => (m.user == interaction.user.id && m.role == options.role[interaction.options[0].value]));
  if (found) {
    if (!found.gambled) {
      mutes.list = mutes.list.filter((m) => ((m.user != interaction.user.id) || (m.role != options.role[interaction.options[0].value])));
      found.gambled = true;
      const random = Math.floor(Math.random() * interaction.options[1].value) + 1;
      const percentage = (interaction.options[1].value-1)*10;
      if (random === 1) {
        interaction.editReply(`Win! Subtracting ${percentage}% from your timeleft.\n${found.timeRaw} - ${secondsToDuration(Math.round(found.time*(percentage/100)))} = ${secondsToDuration(found.time - Math.round(found.time*(percentage/100)))}`);
        found.time = found.time - Math.round(found.time*(percentage/100));
        found.timeRaw = secondsToDuration(found.time);
        mutes.list.push(found);
        updateMutes();
      } else {
        interaction.editReply(`Lost! Adding ${percentage}% to your timeleft.\n${found.timeRaw} + ${secondsToDuration(Math.round(found.time*(percentage/100)))} = ${secondsToDuration(found.time + Math.round(found.time*(percentage/100)))}`);
        found.time = found.time + Math.round(found.time*(percentage/100));
        found.timeRaw = secondsToDuration(found.time);
        mutes.list.push(found);
        updateMutes();
      }
    } else {
      interaction.editReply('You\'ve already gambled this temp role.');
    }
  } else {
    interaction.editReply('You don\'t have this role as a temp role.');
  }
};