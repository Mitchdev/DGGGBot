module.exports = function(client) {
  splitMessage = function(interaction, content, msg) {
    if (typeof content === 'string') content = content.match(/(.|[\r\n]){1,1999}([\r\n])/g);
    if (msg) {
      msg.reply(content[0]).then((reply) => {
        content.shift();
        if (content.length > 0) splitMessage(interaction, content, reply);
      });
    } else {
      interaction.editReply(content[0]).then((reply) => {
        content.shift();
        if (content.length > 0) splitMessage(interaction, content, reply);
      });
    }
  };
};
