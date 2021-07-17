module.exports = function(client) {
  const {Util} = require('discord.js');
  splitMessage = async function(interaction, content, codeblock, message) {
    if (typeof content === 'string') {
      content = Util.splitMessage(content, {maxLength: (codeblock ? ((1995-6)-(typeof codeblock === 'string' ? codeblock.length+2 : 0)) : 1995)});
    }
    if (message) {
      message.reply({content: `${codeblock ? `\`\`\`${typeof codeblock === 'string' ? `${codeblock}\n` : ''}` : ''}${content[0]}${codeblock ? '```' : ''}`}).then((reply) => {
        content.shift();
        if (content.length > 0) splitMessage(interaction, content, codeblock, reply);
      });
    } else {
      interaction.editReply({content: `${codeblock ? `\`\`\`${typeof codeblock === 'string' ? `${codeblock}\n` : ''}` : ''}${content[0]}${codeblock ? '```' : ''}`}).then((reply) => {
        content.shift();
        if (content.length > 0) splitMessage(interaction, content, codeblock, reply);
      });
    }
  };
};
