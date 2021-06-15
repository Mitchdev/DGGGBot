module.exports = function(client) {
  splitMessage = function(interaction, content, msg) {
    if (typeof content === 'string') content = (content+'\n').match(/(.|[\r\n]){1,1999}([\r\n])/g);
    if (msg) {
      msg.reply({content: content[0]}).then((reply) => {
        content.shift();
        if (content.length > 0) splitMessage(interaction, content, reply);
      });
    } else {
      interaction.editReply({content: content[0]}).then((reply) => {
        content.shift();
        if (content.length > 0) splitMessage(interaction, content, reply);
      });
    }
  };
};
