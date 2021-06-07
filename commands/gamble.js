exports.commands = {'gamble': 'weeb/wizard'};
exports.buttons = {'acceptduel': 'none', 'denyduel': 'none'};
exports.slashes = [{
  name: 'gamble',
  description: 'Gamble a temporary role time',
  defaultPermission: false,
  options: [{
    name: 'odds',
    description: 'Basic odds gamble',
    type: 'SUB_COMMAND',
    options: [{
      name: 'role',
      type: 'STRING',
      description: 'Role to gamble',
      required: true,
      choices: [{
        name: 'Weeb',
        value: 'ROLE_WEEB',
      }, {
        name: 'Wizard',
        value: 'ROLE_WIZARD',
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
    description: 'Horse racing gamble',
    type: 'SUB_COMMAND',
    options: [{
      name: 'role',
      type: 'STRING',
      description: 'Role to gamble',
      required: true,
      choices: [{
        name: 'Weeb',
        value: 'ROLE_WEEB',
      }, {
        name: 'Wizard',
        value: 'ROLE_WIZARD',
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
    }],
  }, {
    name: 'duel',
    description: 'Creates a duel with another player',
    type: 'SUB_COMMAND',
    options: [{
      name: 'role',
      type: 'STRING',
      description: 'Role to gamble',
      required: true,
      choices: [{
        name: 'Weeb',
        value: 'ROLE_WEEB',
      }, {
        name: 'Wizard',
        value: 'ROLE_WIZARD',
      }],
    }, {
      name: 'user',
      type: 'USER',
      description: 'User to duel',
      required: true,
    }],
  }],
}];
exports.commandHandler = function(interaction, Discord) {
  interaction.defer();
  
  if (interaction.options.first().name === 'odds') {
    const foundUser = userHasRole(interaction.user.id, process.env[interaction.options.first().options.get('role').value], true);
    if (foundUser.err) interaction.editReply(foundUser.err);
    else {
      const random = Math.floor(Math.random() * interaction.options.first().options.get('odds').value) + 1;
      const percentage = (interaction.options.first().options.get('odds').value-1)*10;
      foundUser.found.gamble -= 1;
      if (random === 1) {
        mutes.list = mutes.list.filter((m) => ((m.user != interaction.user.id) || (m.role != process.env[interaction.options.first().options.get('role').value])));
        interaction.editReply(`**Win!** Subtracting ${percentage}% from your timeleft.\n${secondsToDhms(foundUser.time)}- ${secondsToDhms(Math.round(foundUser.time*(percentage/100)))}= ${secondsToDhms(foundUser.time - Math.round(foundUser.time*(percentage/100)))}`);
        foundUser.found.time = foundUser.found.time - Math.round(foundUser.time*(percentage/100));
        foundUser.found.timeRaw = secondsToDuration(foundUser.found.time);
        mutes.list.push(foundUser.found);
        updateMutes();
      } else {
        mutes.list = mutes.list.filter((m) => ((m.user != interaction.user.id) || (m.role != process.env[interaction.options.first().options.get('role').value])));
        interaction.editReply(`**Lost!** Adding ${percentage}% to your timeleft.\n${secondsToDhms(foundUser.time)}+ ${secondsToDhms(Math.round(foundUser.time*(percentage/100)))}= ${secondsToDhms(foundUser.time + Math.round(foundUser.time*(percentage/100)))}`);
        foundUser.found.time = foundUser.found.time + Math.round(foundUser.time*(percentage/100));
        foundUser.found.timeRaw = secondsToDuration(foundUser.found.time);
        mutes.list.push(foundUser.found);
        updateMutes();
      }
    }
  } else if (interaction.options.first().name === 'horse') {
    const foundUser = userHasRole(interaction.user.id, process.env[interaction.options.first().options.get('role').value], true);
    if (foundUser.err) interaction.editReply(foundUser.err);
    else {
      const horseDistance = [0, 0, 0, 0, 0];
      foundUser.found.gamble -= 1;
      interaction.editReply(`**You picked #${interaction.options.first().options.get('horse').value} in the horse race**\n${horseDistance.map((dist, index) => {
        return `🏁 ${('- '.repeat(10-dist)).trim()} 🏇 #${index+1}`;
      }).join('\n')}`);
      setTimeout(() => updateHorse(horseDistance, foundUser), 750);
    }
  } else if (interaction.options.first().name === 'duel') {
    if (interaction.options.first().options.first().name === 'create') {
      const foundUser1 = userHasRole(interaction.user.id, process.env[interaction.options.first().options.first().options.get('role').value], false);
      const foundUser2 = userHasRole(interaction.options.first().options.first().options.get('user').value, process.env[interaction.options.first().options.first().options.get('role').value], false);
      if (foundUser1.err) interaction.editReply(foundUser1.err);
      else if (foundUser2.err || interaction.user.id == interaction.options.first().options.first().options.get('user').value) interaction.editReply(`Cannot duel this user`);
      else {
        if (gambleDuels[foundUser2.found.user]) {
          interaction.editReply(`${interaction.options.first().options.first().options.get('user').member.username} already has a duel waiting to accept`);
        } else {
          foundUser1["username"] = interaction.member.displayName;
          foundUser2["username"] = interaction.options.first().options.first().options.get('user').member.displayName;
          gambleDuels[foundUser2.found.user] = {"user1": foundUser1, "user2": foundUser2}
          const row = new Discord.MessageActionRow().addComponents(new Discord.MessageButton({custom_id: 'acceptduel', label: 'Accept', style: 'SUCCESS', disabled: false})).addComponents(new Discord.MessageButton({custom_id: 'denyduel', label: 'Deny', style: 'DANGER', disabled: false}));
          interaction.editReply(`${interaction.options.first().options.first().options.get('user').user}, ${interaction.member.displayName} wants to duel. (You have 2m to accept)`, {components: [row]});
          setTimeout(() => {
            if (gambleDuels[foundUser2.found.user]) {
              delete gambleDuels[foundUser2.found.user];
              const row = new Discord.MessageActionRow().addComponents(new Discord.MessageButton({custom_id: 'null', label: `${foundUser2.username} failed to accept`, style: 'DANGER', disabled: true}));
              interaction.editReply(`${interaction.options.first().options.first().options.get('user').user}, ${interaction.member.displayName} wants to duel. (You have 2m to accept)`, {components: [row]})
            }
          }, 120000);
        }
      }
    }
  }

  /**
   * Updates the horse race message.
   * @param {array} array of horse distances
   * @param {number} time current temp role time
   */
  function updateHorse(array, foundUser) {
    let horseRaceEnd = false;
    const horseDistance = array;
    const horseMove = [Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2)];
    if ((horseMove[0] + horseMove[1] + horseMove[2] + horseMove[3] + horseMove[4]) === 0) horseMove[Math.floor(Math.random() * 5)] = 1;
    for (let i = 0; i < horseDistance.length; i++) {
      horseDistance[i] += horseMove[i];
      if (horseDistance[i] === 10) horseRaceEnd = true;
    }
    if (horseRaceEnd) {
      mutes.list = mutes.list.filter((m) => ((m.user != interaction.user.id) || (m.role != process.env[interaction.options.first().options.get('role').value])));
      if (horseDistance[interaction.options.first().options.get('horse').value-1] === 10) {
        interaction.editReply(`**You picked #${interaction.options.first().options.get('horse').value} in the horse race**\n${horseDistance.map((dist, index) => {
          return `🏁 ${('- '.repeat(10-dist)).trim()} 🏇 #${index+1}`;
        }).join('\n')}\n\n**Win!** Subtracting 40% from your timeleft.\n${secondsToDhms(foundUser.time)}- ${secondsToDhms(Math.round(foundUser.time*0.4))}= ${secondsToDhms(foundUser.time - Math.round(foundUser.time*0.4))}`);
        foundUser.found.time = foundUser.found.time - Math.round(foundUser.time*0.4);
        foundUser.found.timeRaw = secondsToDuration(foundUser.found.time);
        mutes.list.push(foundUser.found);
        updateMutes();
      } else {
        mutes.list = mutes.list.filter((m) => ((m.user != interaction.user.id) || (m.role != process.env[interaction.options.first().options.get('role').value])));
        interaction.editReply(`**You picked #${interaction.options.first().options.get('horse').value} in the horse race**\n${horseDistance.map((dist, index) => {
          return `🏁 ${('- '.repeat(10-dist)).trim()} 🏇 #${index+1}`;
        }).join('\n')}\n\n**Lost!** Adding 40% to your timeleft.\n${secondsToDhms(foundUser.time)}+ ${secondsToDhms(Math.round(foundUser.time*0.4))}= ${secondsToDhms(foundUser.time + Math.round(foundUser.time*0.4))}`);
        foundUser.found.time = foundUser.found.time + Math.round(foundUser.found.time*0.4);
        foundUser.found.timeRaw = secondsToDuration(foundUser.time);
        mutes.list.push(foundUser.found);
        updateMutes();
      }
    } else {
      interaction.editReply(`**You picked #${interaction.options.first().options.get('horse').value} in the horse race**\n${horseDistance.map((dist, index) => {
        return `🏁 ${('- '.repeat(10-dist)).trim()} 🏇 #${index+1}`;
      }).join('\n')}`);
      setTimeout(() => updateHorse(horseDistance, foundUser), 750);
    }
  }
};
exports.buttonHandler = function(interaction, Discord) {
  if (interaction.customID === 'acceptduel') {
    const foundData = gambleDuels[interaction.user.id];
    if (foundData) {

      const row = new Discord.MessageActionRow().addComponents(new Discord.MessageButton({custom_id: 'null', label: `${interaction.user.username} accepted`, style: 'SUCCESS', disabled: true}));
      interaction.update(interaction.message.content, {components: [row]})

      const user1Win = (Math.floor(Math.random() * 2) === 1)
      const winner = user1Win ? foundData.user1 : foundData.user2;
      const loser = user1Win ? foundData.user2 : foundData.user1;
      mutes.list = mutes.list.filter((m) => ((m.user != winner.found.user) || (m.role != winner.found.role)));
      mutes.list = mutes.list.filter((m) => ((m.user != loser.found.user) || (m.role != loser.found.role)));

      interaction.message.reply(`<@!${foundData.user1.found.user}> vs <@!${foundData.user2.found.user}>\n\n${winner.username} won!\n`+
        `Transfering 20% of ${winner.username}s timeleft to ${loser.username}s timeleft.\n\n`+
        `**${winner.username}** ${secondsToDhms(winner.time)}- ${secondsToDhms(Math.round(winner.time*0.2))}= ${secondsToDhms(winner.time - Math.round(winner.time*0.2))}\n`+
        `**${loser.username}** ${secondsToDhms(loser.time)}+ ${secondsToDhms(Math.round(winner.time*0.2))}= ${secondsToDhms(loser.time + Math.round(winner.time*0.2))}`);

      winner.found.time = winner.found.time - Math.round(winner.time*0.2);
      loser.found.time = loser.found.time + Math.round(winner.time*0.2);
      winner.found.timeRaw = secondsToDuration(winner.found.time);
      loser.found.timeRaw = secondsToDuration(loser.found.time);
      mutes.list.push(winner.found, loser.found);
      updateMutes();
      delete gambleDuels[interaction.user.id];
    }
  } else if (interaction.customID === 'denyduel') {
    const foundData = gambleDuels[interaction.user.id];
    if (foundData) {
      const row = new Discord.MessageActionRow().addComponents(new Discord.MessageButton({custom_id: 'null', label: `${interaction.user.username} denined`, style: 'DANGER', disabled: true}));
      interaction.update(interaction.message.content, {components: [row]})
      delete gambleDuels[interaction.user.id];
    }
  }
};