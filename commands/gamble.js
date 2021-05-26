exports.name = ['gamble'];
exports.permission = 'weeb/wizard';
exports.slash = [{
  name: 'gamble',
  description: 'Gamble a temporary role time',
  defaultPermission: false,
  options: [{
    name: 'odds',
    type: 'SUB_COMMAND',
    description: 'Basic odds gamble',
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
      description: '1 out of X',
      required: true,
      choices: [{
        name: '1/2 | (+/-)10% timeleft',
        value: 2,
      }, {
        name: '1/3 | (+/-)20% timeleft',
        value: 3,
      }, {
        name: '1/4 | (+/-)30% timeleft',
        value: 4,
      }, {
        name: '1/5 | (+/-)40% timeleft',
        value: 5,
      }, {
        name: '1/6 | (+/-)50% timeleft',
        value: 6,
      }, {
        name: '1/7 | (+/-)60% timeleft',
        value: 7,
      }, {
        name: '1/8 | (+/-)70% timeleft',
        value: 8,
      }, {
        name: '1/9 | (+/-)80% timeleft',
        value: 9,
      }, {
        name: '1/10 | (+/-)90% timeleft',
        value: 10,
      }],
    }],
  }, {
    name: 'horse',
    type: 'SUB_COMMAND',
    description: 'Horse racing gamble',
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
      name: 'horse',
      type: 'INTEGER',
      description: 'Pick a horse',
      required: true,
      choices: [{
        name: '#1',
        value: 1,
      }, {
        name: '#2',
        value: 2,
      }, {
        name: '#3',
        value: 3,
      }, {
        name: '#4',
        value: 4,
      }, {
        name: '#5',
        value: 5,
      }],
    }]
  }],
}];
exports.handler = function(interaction) {
  const found = mutes.list.find((m) => (m.user == interaction.user.id && m.role == options.role[interaction.options[0].options[0].value]));
  if (found) {
    if (found.gamble > 0) {
      const difference = (new Date().getTime() - new Date(found.startTime).getTime()) / 1000;
      const time = (parseInt(found.time) - parseInt(difference) <= 0) ? 0 : parseInt(found.time) - parseInt(difference);
      if (time > 0) {
        mutes.list = mutes.list.filter((m) => ((m.user != interaction.user.id) || (m.role != options.role[interaction.options[0].options[0].value])));
        found.gamble -= 1;
        updateMutes();
        if (interaction.options[0].name === 'odds') {
          const random = Math.floor(Math.random() * interaction.options[0].options[1].value) + 1;
          const percentage = (interaction.options[0].options[1].value-1)*10;
          if (random === 1) {
            interaction.editReply(`**Win!** Subtracting ${percentage}% from your timeleft.\n${secondsToDhms(time)}- ${secondsToDhms(Math.round(time*(percentage/100)))}= ${secondsToDhms(time - Math.round(time*(percentage/100)))}`);
            found.time = found.time - Math.round(time*(percentage/100));
            found.timeRaw = secondsToDuration(found.time);
            mutes.list.push(found);
            updateMutes();
          } else {
            interaction.editReply(`**Lost!** Adding ${percentage}% to your timeleft.\n${secondsToDhms(time)}+ ${secondsToDhms(Math.round(time*(percentage/100)))}= ${secondsToDhms(time + Math.round(time*(percentage/100)))}`);
            found.time = found.time + Math.round(time*(percentage/100));
            found.timeRaw = secondsToDuration(found.time);
            mutes.list.push(found);
            updateMutes();
          }
        } else if (interaction.options[0].name === 'horse') {
          let horseDistance = [0, 0, 0, 0, 0];
          interaction.editReply(`**You picked #${interaction.options[0].options[1].value} in the horse race**\n${horseDistance.map((dist, index) => {
            return `🏁 ${('- '.repeat(5-dist)).trim()} 🏇 #${index+1}`;
          }).join('\n')}`);
          setTimeout(function() {updateHorse(horseDistance, time)}, 750);
        }
      } else {
        interaction.editReply('You don\'t have this role as a temp role.');
      }
    } else {
      interaction.editReply('You\'ve used all your gambles.');
    }
  } else {
    interaction.editReply('You don\'t have this role as a temp role.');
  }

  function updateHorse(array, time) {
    let horseDistance = array;
    const horse = Math.floor(Math.random() * 5);
    horseDistance[horse]++;
    if (horseDistance[horse] == 5) {
      if ((horse+1) === interaction.options[0].options[1].value) {
        interaction.editReply(`**You picked #${interaction.options[0].options[1].value} in the horse race**\n${horseDistance.map((dist, index) => {
          return `🏁 ${('- '.repeat(5-dist)).trim()} 🏇 #${index+1}`;
        }).join('\n')}\n\n**Win!** Subtracting 40% from your timeleft.\n${secondsToDhms(time)}- ${secondsToDhms(Math.round(time*0.4))}= ${secondsToDhms(time - Math.round(time*0.4))}`);
        found.time = found.time - Math.round(time*(percentage/100));
        found.timeRaw = secondsToDuration(found.time);
        mutes.list.push(found);
        updateMutes();
      } else {
        interaction.editReply(`**You picked #${interaction.options[0].options[1].value} in the horse race**\n${horseDistance.map((dist, index) => {
          return `🏁 ${('- '.repeat(5-dist)).trim()} 🏇 #${index+1}`;
        }).join('\n')}\n\n**Lost!** Adding 40% to your timeleft.\n${secondsToDhms(time)}+ ${secondsToDhms(Math.round(time*0.4))}= ${secondsToDhms(time + Math.round(time*0.4))}`);
        found.time = found.time + Math.round(time*0.4);
        found.timeRaw = secondsToDuration(found.time);
        mutes.list.push(found);
        updateMutes();
      }
    } else {
      interaction.editReply(`**You picked #${interaction.options[0].options[1].value} in the horse race**\n${horseDistance.map((dist, index) => {
        return `🏁 ${('- '.repeat(5-dist)).trim()} 🏇 #${index+1}`;
      }).join('\n')}`);
      setTimeout(function() {updateHorse(horseDistance, time)}, 750);
    }
  }
};
