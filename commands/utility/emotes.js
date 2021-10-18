exports.commands = {'emotes': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'emotes',
  description: 'Shows emote usage',
  options: [{
    name: 'timeframe',
    type: 'STRING',
    description: 'Timeframe of emote uses',
    required: true,
    choices: [{
      name: 'Last added',
      value: 'false',
    }, {
      name: 'Total',
      value: 'true',
    }],
  }, {
    name: 'size',
    type: 'STRING',
    description: 'Size of shown emote uses',
    required: true,
    choices: [{
      name: 'Top/Bottom 5',
      value: 'false',
    }, {
      name: 'All',
      value: 'true',
    }],
  }],
}];
exports.commandHandler = async function(interaction) {
  await interaction.deferReply({ephemeral: (interaction.options.get('size').value === 'true')});

  if (interaction.options.get('size').value === 'true') {
    interaction.editReply({content: 'Fixing'});
    return;
  }

  //
  // EMBED WITH THREE ROWS
  //

  client.guilds.fetch(process.env.GUILD_ID).then((guild) => {
    const e = [];
    const combined = [];
    let totalLen = 0;
    let size = 0;

    guild.emojis.cache.each((emoji) => {
      if (!emoji.animated) {
        totalLen += parseInt(`<:${emoji.name}:${emoji.id}>`.length);
        size++;
        if (emotesUse.emotes[emoji.id]) {
          e.push({'name': emoji.name, 'id': emoji.id, 'count': (interaction.options.get('timeframe').value === 'true') ? emotesUse.emotes[emoji.id].uses : emotesUse.emotes[emoji.id].newUses});
        } else {
          e.push({'name': emoji.name, 'id': emoji.id, 'count': 0});
        }
      }
    });

    e.sort((a, b) => a.count-b.count);

    for (let i = 0; i < e.length; i++) {
      if (i == 0) {
        combined.unshift([e[i]]);
      } else {
        if (e[i].count == combined[0][combined[0].length-1].count) {
          combined[0].push(e[i]);
        } else {
          combined.unshift([e[i]]);
        }
      }
    }

    for (let i = 0; i < combined.length; i++) {
      if (combined[i].length > Math.round(1950/(totalLen/size))) {
        combined[i] = [{'emotes': combined[i].length, 'count': combined[i][0].count}];
      }
    }

    const difference = (new Date().getTime() - new Date((interaction.options.get('timeframe').value === 'true') ? emotesUse.started : emotesUse.newStarted).getTime()) / 1000;
    if ((interaction.options.get('size').value === 'true')) {
      const content = 'Emote usage since '+secondsToDhms(parseInt(difference))+'ago ('+new Date((interaction.options.get('timeframe').value === 'true') ? emotesUse.started : emotesUse.newStarted).toUTCString()+')\n'+combined.map((l) => {
        if (l) {
          if (l[0].emotes) {
            return l[0].count + ' - ' + l[0].emotes + ' emotes';
          } else {
            return l[0].count + ' - ' + l.map((em) => {
              return '<:' + em.name + ':' + em.id + '>';
            }).join('');
          }
        } else {
          return;
        }
      }).join('\n');

      splitMessage(interaction, content);
    } else {
      const top5 = [combined[0], combined[1], combined[2], combined[3], combined[4]];
      const bottom5 = [combined[combined.length-1], combined[combined.length-2], combined[combined.length-3], combined[combined.length-4], combined[combined.length-5]];
      interaction.editReply({content: 'Emote usage since '+secondsToDhms(parseInt(difference))+'ago ('+new Date((interaction.options.get('timeframe').value === 'true') ? emotesUse.started : emotesUse.newStarted).toUTCString()+')\n**Most used**\n'+top5.map((l) => {
        if (l) {
          if (l[0].emotes) {
            return l[0].count + ' - ' + l[0].emotes + ' emotes';
          } else {
            return l[0].count + ' - ' + l.map((em) => {
              return '<:' + em.name + ':' + em.id + '>';
            }).join('');
          }
        } else {
          return;
        }
      }).join('\n') + '\n\n**Least used**\n' + bottom5.map((l) => {
        if (l) {
          if (l[0].emotes) {
            return l[0].count + ' - ' + l[0].emotes + ' emotes';
          } else {
            return l[0].count + ' - ' + l.map((em) => {
              return '<:' + em.name + ':' + em.id + '>';
            }).join('');
          }
        } else {
          return;
        }
      }).join('\n')});
    }
  });
};
