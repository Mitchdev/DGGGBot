exports.commands = {'olympics': 'none'};
exports.buttons = {'olympics': 'none'};
exports.slashes = [{
  name: 'olympics',
  description: 'Olympic medal leaderboard',
  options: [{
    name: 'all',
    type: 'BOOLEAN',
    description: 'Show all countries',
    required: false,
  }],
}];
exports.commandHandler = async function(interaction, Discord) {
  await interaction.deferReply();

  const data = await(await fetch(process.env.OLYMPICS_API, {
    headers: {
      'cookie': '_reg-csrf=s:Lb4Zz-LpDPkbrySdaAOBf4ph.b8+k7hRf7u0Kx0sxq7Y8oUZktcVO67P+dVEi9jyBYik; consentUUID=565528a8-709c-4c3b-911d-44f32c19a3c3; bb_geo_info={"country":"NZ","region":"Asia","fieldN":"hf"}|1628043162479; _user-status=anonymous; bb_geo_info={"countryCode":"NZ","country":"NZ","field_n":"hf","trackingRegion":"Asia","cacheExpiredTime":1628043175961,"region":"Asia","fieldN":"hf"}|1628043175961; agent_id=b2162f50-92ba-468f-9814-b1961afc183a; session_id=36283d65-c32f-410b-9144-216971e5cbda; session_key=80f92c35716f4dd02dab3c68301fb0aabe8a1321; gatehouse_id=22b04912-d3ac-438b-9876-da9d65ded495; _reg-csrf-token=uPmvDUG2-4h7nM1t02XaQC_i5fmsPVZka26Y; pxcts=9200af80-ef51-11eb-bcca-8d72a22d6803; _pxvid=920064c2-ef51-11eb-8f65-0242ac120019; cookieConsent=required|performance|advertising|adwords|demandbase|linkedin-insights|media-shop|; cPixel=required|performance|advertising|adwords|demandbase|linkedin-insights|media-shop|',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
    },
  })).json();

  olympicsLeaderboardUpdated = data.lastUpdated;
  olympicsLeaderboard = data.data.medals.sort((a, b) => {
    if (a.gold === b.gold) {
      if (a.silver === b.silver) {
        return b.bronze - a.bronze;
      } else {
        return b.silver - a.silver;
      }
    } else {
      return b.gold - a.gold;
    }
  });

  const buttons = new Discord.MessageActionRow();
  buttons.addComponents(new Discord.MessageButton({custom_id: `olympics|${interaction.options.get('all')?.value}|-1`, label: 'prev', style: 'SECONDARY', disabled: true}));
  buttons.addComponents(new Discord.MessageButton({custom_id: `olympics|${interaction.options.get('all')?.value}|0`, label: '1', style: 'SECONDARY', disabled: true}));
  buttons.addComponents(new Discord.MessageButton({custom_id: `olympics|${interaction.options.get('all')?.value}|1`, label: 'next', style: 'SECONDARY', disabled: 1 >= Math.ceil(olympicsLeaderboard.filter((c) => {
    if (!interaction.options.get('all')?.value) return olympicUsers.includes(c.noc);
    else return c.total > 0;
  }).length/25)}));
  const embed = new Discord.MessageEmbed().setTitle(`Olympic Medal Leaderboard`).addFields([{
    name: 'Last Updated',
    value: `<t:${new Date(olympicsLeaderboardUpdated).getTime() / 1000}:R>`,
  }, {
    name: 'Country',
    value: olympicsLeaderboard.filter((c) => {
      if (!interaction.options.get('all')?.value) return olympicUsers.includes(c.noc);
      else return c.total > 0;
    }).slice(0, 25).map((c, i) => `${(i % 2 === 1) ? '**' : ''}#${i+1} ${olympicDel[c.noc]}${(i % 2 === 1) ? '**' : ''}`).join('\n'),
    inline: true,
  }, {
    name: 'Go - Si - Br - To',
    value: olympicsLeaderboard.filter((c) => {
      if (!interaction.options.get('all')?.value) return olympicUsers.includes(c.noc);
      else return c.total > 0;
    }).slice(0, 25).map((c, i) => `${(i % 2 === 1) ? '**' : ''}${c.gold.toString()} - ${c.silver.toString()} - ${c.bronze.toString()} - ${c.total.toString()}${(i % 2 === 1) ? '**' : ''}`).join('\n'),
    inline: true,
  }, {
    name: 'Total per 10 Million',
    value: olympicsLeaderboard.filter((c) => {
      if (!interaction.options.get('all')?.value) return olympicUsers.includes(c.noc);
      else return c.total > 0;
    }).slice(0, 25).map((c, i) => `${(i % 2 === 1) ? '**' : ''}${((10000000 / olympicDel[c.noc+'-pop']) * c.total).toFixed(3)}${(i % 2 === 1) ? '**' : ''}`).join('\n'),
    inline: true,
  }]);
  embed.setFooter(`Page (1/${Math.ceil(olympicsLeaderboard.filter((c) => {
    if (!interaction.options.get('all')?.value) return olympicUsers.includes(c.noc);
    else return c.total > 0;
  }).length/25)})`);
  interaction.editReply({embeds: [embed], components: [buttons]});
};
exports.buttonHandler = function(interaction, Discord) {
  if (olympicsLeaderboard.length > 0) {
    const page = parseInt(interaction.customId.split('|')[2]);
    const buttons = new Discord.MessageActionRow();
    buttons.addComponents(new Discord.MessageButton({custom_id: `olympics|${interaction.customId.split('|')[1]}|${page-1}`, label: 'prev', style: 'SECONDARY', disabled: (page-1 < 0)}));
    buttons.addComponents(new Discord.MessageButton({custom_id: `olympics|${interaction.customId.split('|')[1]}|${page}`, label: page+1, style: 'SECONDARY', disabled: true}));
    buttons.addComponents(new Discord.MessageButton({custom_id: `olympics|${interaction.customId.split('|')[1]}|${page+1}`, label: 'next', style: 'SECONDARY', disabled: (page+1 >= Math.ceil(olympicsLeaderboard.filter((c) => {
      if (!interaction.customId.split('|')[1]) return olympicUsers.includes(c.noc);
      else return c.total > 0;
    }).length/25))}));

    const embed = new Discord.MessageEmbed().setTitle(`Olympic Medal Leaderboard`).addFields([{
      name: 'Last Updated',
      value: `<t:${new Date(olympicsLeaderboardUpdated).getTime() / 1000}:R>`,
    }, {
      name: 'Country',
      value: olympicsLeaderboard.filter((c) => {
        if (!interaction.customId.split('|')[1]) return olympicUsers.includes(c.noc);
        else return c.total > 0;
      }).slice(0+(page*25), 25+(page*25)).map((c, i) => `${(i % 2 === 1) ? '**' : ''}#${(page*25)+i+1} ${olympicDel[c.noc]}${(i % 2 === 1) ? '**' : ''}`).join('\n'),
      inline: true,
    }, {
      name: 'Go - Si - Br - To',
      value: olympicsLeaderboard.filter((c) => {
        if (!interaction.customId.split('|')[1]) return olympicUsers.includes(c.noc);
        else return c.total > 0;
      }).slice(0+(page*25), 25+(page*25)).map((c, i) => `${(i % 2 === 1) ? '**' : ''}${c.gold.toString()} - ${c.silver.toString()} - ${c.bronze.toString()} - ${c.total.toString()}${(i % 2 === 1) ? '**' : ''}`).join('\n'),
      inline: true,
    }, {
      name: 'Total per 10 Million',
      value: olympicsLeaderboard.filter((c) => {
        if (!interaction.customId.split('|')[1]) return olympicUsers.includes(c.noc);
        else return c.total > 0;
      }).slice(0+(page*25), 25+(page*25)).map((c, i) => `${(i % 2 === 1) ? '**' : ''}${((10000000 / olympicDel[c.noc+'-pop']) * c.total).toFixed(3)}${(i % 2 === 1) ? '**' : ''}`).join('\n'),
      inline: true,
    }]);
    embed.setFooter(`Page (${page+1}/${Math.ceil(olympicsLeaderboard.filter((c) => {
      if (!interaction.customId.split('|')[1]) return olympicUsers.includes(c.noc);
      else return c.total > 0;
    }).length/25)})`);
    interaction.update({embeds: [embed], components: [buttons]});
  }
};
