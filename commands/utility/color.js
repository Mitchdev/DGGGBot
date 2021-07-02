exports.commands = {'color': 'none'};
exports.buttons = {};
exports.slashes = [{
  name: 'color',
  description: 'Gets the color for an image',
  options: [{
    name: 'link',
    type: 'STRING',
    description: 'Link of image to get the color of.',
    required: true,
  }],
}];
exports.commandHandler = async function(interaction, Discord) {
  await interaction.defer();

  const image = interaction.options.get('link').value;
  const colors = await colorThief.getPaletteFromURL(image, 6).catch(() => {
    return;
  });
  if (colors) {
    const embed = new Discord.MessageEmbed().setTitle(image).setImage(image).setColor(colors[0]).addFields(colors.map((c) => {
      return {'name': getColor(c).name, 'value': `rgb: **${c.join(', ')}**\nhex: **${getColor(c).hex}**`, 'inline': true};
    }));
    interaction.editReply({embeds: [embed]});
  } else {
    interaction.editReply({content: `Could not get colors from (${image})`});
  }

  /**
   * Gets the color name and hex from rgb.
   * @param {array<int>} rgb red green blue of the color.
   * @return {object} Color name and hex value.
   */
  function getColor(rgb) {
    let distance = 0;
    let minDistance = Infinity;
    let c;

    colorNames.forEach((color) => {
      distance = Math.sqrt((color.rgb.r - rgb[0]) ** 2 + (color.rgb.g - rgb[1]) ** 2 + (color.rgb.b - rgb[2]) ** 2);
      if (distance === 0) return {name: color.name, hex: color.hex};
      if (distance < minDistance) {
        minDistance = distance;
        c = color;
      }
    });

    return {name: c.name, hex: c.hex};
  }
};
